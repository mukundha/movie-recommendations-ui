import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { BallTriangle } from 'react-loader-spinner';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [rating, setRating] = useState(0);
  const [mode, setMode] = useState('Batch AI');
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'Batch AI' ? 'Realtime AI' : 'Batch AI'));
  };
  
  const fetchRecommendations = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/recommendations?user_id=1&num_recommendations=30&user_last_watched=2&user_last_rating=3&realtime=true'
      );
      const data = await response.json();
      setMovies(data.recommendations);
    } catch (error) {
      console.log('Error fetching recommendations:', error);
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleRatingChange = async (ratingValue) => {
    setRating(ratingValue);
  
    if (mode === 'Realtime AI') {
      try {
        const response = await fetch(
          `http://localhost:5000/recommendations?user_id=1&num_recommendations=30&user_last_watched=${selectedMovie.movieId}&user_last_rating=${ratingValue}&realtime=true`
        );
        const data = await response.json();
        setMovies(data.recommendations);
      } catch (error) {
        console.log('Error fetching recommendations:', error);
      }
    }
  };
  

  const handleClosePanel = () => {
    setSelectedMovie(null);
    setRating(0);
  };

  const handleRefreshRecommendations = () => {
    fetchRecommendations();
  };

  const renderStars = (numStars) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= numStars ? 'star filled' : 'star'}
          onClick={() => handleRatingChange(i)}
        >
          &#9733;
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* <div className="logo">
          <img src={logo} alt="App Logo" />
        </div> */}
        <h1 className="title">Movielens!</h1>
      </header>
      
      <button class="mode-button" onClick={toggleMode}>{mode}</button>
      <button class="refresh-button" onClick={handleRefreshRecommendations}>Refresh</button>
      
      <Slider dots={true} infinite={true} speed={500} slidesToShow={5} slidesToScroll={5}>
        {movies.map((movie) => (
          <div key={movie.movieId} className="movie-card" onClick={() => handleMovieClick(movie)}>
            <img src={movie.poster} alt={movie.title} className="movie-poster" />
          </div>
        ))}
      </Slider>
      {loading && (
      <div className="loader-container">
        <BallTriangle type="Oval" color="#fff" height={80} width={80} />
      </div>
    )}
      {selectedMovie && (
        <div className="movie-details-panel">
          <div className="movie-details">
            <h2>{selectedMovie.title}</h2>
            <img src={selectedMovie.poster} alt={selectedMovie.title} className="movie-poster" />
            <p>Genres: {selectedMovie.genres}</p>
            <div className="rating-container">
              <label htmlFor="rating">Rate this movie:</label>
              {renderStars(rating)}
            </div>
            <button class="close-button" onClick={handleClosePanel}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
