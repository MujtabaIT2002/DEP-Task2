import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AnimeList from '../Components/AnimeList';

function Home() {
  const [animeList, setAnimeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const navigate = useNavigate();

  // Fetch popular anime on initial load
  useEffect(() => {
    const fetchPopularAnime = () => {
      const query = `
        query {
          Page(page: 1, perPage: 10) {
            media(type: ANIME, sort: POPULARITY_DESC) {
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
        }
      `;

      axios.post('https://graphql.anilist.co', { query })
        .then(response => {
          setAnimeList(response.data.data.Page.media);
        })
        .catch(error => {
          console.error('Error fetching popular anime:', error);
        });
    };

    fetchPopularAnime();
  }, []);

  // Fetch search suggestions as the user types
  useEffect(() => {
    if (searchTerm) {
      const fetchSearchSuggestions = () => {
        const query = `
          query ($search: String) {
            Page(page: 1, perPage: 5) {
              media(search: $search, type: ANIME) {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
              }
            }
          }
        `;

        axios.post('https://graphql.anilist.co', {
          query: query,
          variables: { search: searchTerm }
        })
        .then(response => {
          setSuggestions(response.data.data.Page.media);
        })
        .catch(error => {
          console.error('Error fetching search suggestions:', error);
        });
      };

      fetchSearchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  // Fetch anime based on search term (user clicks on search or selects from suggestions)
  const fetchAnime = () => {
    if (searchTerm.trim() === '') {
      return; // Do nothing if the search term is empty
    }

    const query = `
      query ($search: String) {
        Media(search: $search, type: ANIME) {
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
      variables: { search: searchTerm }
    })
    .then(response => {
      const anime = response.data.data.Media;
      setAnimeList(anime ? [anime] : []);
      setCurrentPage(1);
      setSuggestions([]); // Clear suggestions after search
    })
    .catch(error => {
      console.error('Error fetching the anime:', error);
    });
  };

  // Pagination controls
  const totalPages = Math.ceil(animeList.length / itemsPerPage);
  const currentAnimeList = animeList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="home">
      <h1>Anime Search</h1>
      
      {/* Link to Favorites */}
      <div className="nav-links">
        <Link to="/favorites">View Favorites</Link>
      </div>

      {/* Search Input and Suggestions */}
      <div className="search-bar">
        <input 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Search for an anime..."
        />
        <button onClick={fetchAnime}>Search</button>

        {/* Show suggestions */}
        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map(suggestion => (
              <div 
                key={suggestion.id} 
                className="suggestion-item" 
                onClick={() => {
                  setSearchTerm(suggestion.title.romaji || suggestion.title.english);
                  fetchAnime();
                }}
              >
                {suggestion.title.romaji || suggestion.title.english}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Show Anime List */}
      <AnimeList 
        animeList={currentAnimeList} 
        onAnimeSelect={(anime) => navigate(`/anime/${anime.id}`)}
      />

      {/* Pagination Controls */}
      {animeList.length > 0 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
