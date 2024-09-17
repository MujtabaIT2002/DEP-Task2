import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const AnimeList = ({ animeList, onAnimeSelect }) => {
  return (
    <div className="anime-list">
      {animeList.length > 0 ? (
        animeList.map(anime => (
          <motion.div 
            key={anime.id} 
            className="anime-item"
            onClick={() => onAnimeSelect(anime)}
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
            <p>{anime.description ? anime.description.substring(0, 100) + '...' : 'No description available.'}</p>
          </motion.div>
        ))
      ) : (
        <p>No anime found. Try a different search.</p>
      )}
    </div>
  );
};

AnimeList.propTypes = {
  animeList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.shape({
        romaji: PropTypes.string,
        english: PropTypes.string,
      }),
      description: PropTypes.string,
      coverImage: PropTypes.shape({
        large: PropTypes.string,
      })
    })
  ).isRequired,
  onAnimeSelect: PropTypes.func.isRequired,
};

export default AnimeList;
