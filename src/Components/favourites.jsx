import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Favorites({ favorites, removeFromFavorites }) {
  const navigate = useNavigate();

  return (
    <div className="favorites-page">
      <h1>Favorites</h1>
      {favorites.length > 0 ? (
        <div className="anime-list">
          {favorites.map((anime) => (
            <motion.div 
              key={anime.id} 
              className="anime-item"
              onClick={() => navigate(`/anime/${anime.id}`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="anime-image-wrapper">
                <img src={anime.coverImage.large} alt={anime.title.romaji || anime.title.english} className="anime-image" />
              </div>
              <h2>{anime.title.romaji || anime.title.english}</h2>
              <button onClick={(e) => {
                e.stopPropagation(); // Prevent navigating to the details page
                removeFromFavorites(anime.id);
              }}>
                Remove from Favorites
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <p>No favorites yet. Add some anime to your favorites list!</p>
      )}
    </div>
  );
}

Favorites.propTypes = {
  favorites: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.shape({
        romaji: PropTypes.string,
        english: PropTypes.string,
      }),
      coverImage: PropTypes.shape({
        large: PropTypes.string,
      })
    })
  ).isRequired,
  removeFromFavorites: PropTypes.func.isRequired,
};

export default Favorites;
