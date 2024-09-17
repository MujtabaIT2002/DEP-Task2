import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

function AnimeDetails({ addToFavorites, removeFromFavorites, favorites }) {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnimeDetails = () => {
      const query = `
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
            id
            title {
              romaji
              english
            }
            description
            coverImage {
              large
            }
          }
        }
      `;

      axios.post('https://graphql.anilist.co', {
        query: query,
        variables: { id: parseInt(id) }
      })
      .then(response => {
        setAnime(response.data.data.Media);
      })
      .catch(error => {
        console.error('Error fetching the anime details:', error);
      });
    };

    fetchAnimeDetails();
  }, [id]);

  // Check if the anime is already a favorite
  const isFavorite = anime && favorites.some((fav) => fav.id === anime.id);

  return (
    <div className="anime-details">
      {anime ? (
        <div className="anime-details-content">
          <h2>{anime.title.romaji || anime.title.english}</h2>
          <img src={anime.coverImage.large} alt={anime.title.romaji || anime.title.english} />
          <p>{anime.description || 'No description available.'}</p>
          <div className="anime-details-buttons">
            <button className="anime-details-back-button" onClick={() => navigate(-1)}>Back</button>
            {isFavorite ? (
              <button
                onClick={() => removeFromFavorites(anime.id)}
              >
                Remove from Favorites
              </button>
            ) : (
              <button
                onClick={() => addToFavorites(anime)}
              >
                Add to Favorites
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

// Define prop types for validation
AnimeDetails.propTypes = {
  addToFavorites: PropTypes.func.isRequired,
  removeFromFavorites: PropTypes.func.isRequired,
  favorites: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
};

export default AnimeDetails;
