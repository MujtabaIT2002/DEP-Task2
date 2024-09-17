import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import AnimeDetails from './Components/AnimeDetailsModal';
import Favorites from './Components/favourites';

function App() {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from local storage on initial render
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  // Save favorites to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (anime) => {
    setFavorites((prevFavorites) => {
      // Check if the anime is already in the favorites list
      if (prevFavorites.find((fav) => fav.id === anime.id)) {
        return prevFavorites; // If it's already a favorite, do nothing
      }
      return [...prevFavorites, anime];
    });
  };

  const removeFromFavorites = (animeId) => {
    setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== animeId));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/anime/:id" 
          element={<AnimeDetails 
            addToFavorites={addToFavorites} 
            removeFromFavorites={removeFromFavorites} 
            favorites={favorites} 
          />} 
        />
        <Route 
          path="/favorites" 
          element={<Favorites 
            favorites={favorites} 
            removeFromFavorites={removeFromFavorites} 
          />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
