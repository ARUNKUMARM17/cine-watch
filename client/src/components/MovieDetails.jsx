import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from './Spinner'; // Assuming you have a Spinner component for loading state

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS);
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // if (loading) return <div className="loading">Loading...</div>;
  // if (error) return <div className="error">Error: {error}</div>;
  // if (!movie) return <div className="error">Movie not found</div>;

return (
  <>
    {loading ? (
      <Spinner/>

    ) : error ? (
      <p className="text-red-500">{error}</p>
    ) : (
      <div className="movie-details">
        
        <div className="movie-details-content">
          <div className="movie-poster">
            <img 
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-movie.png'} 
              alt={movie.title}
            />
          </div>
          
          <div className="movie-info">
            <h1 className="text-left">{movie.title}</h1>
            <div className="movie-meta">
              <div className="rating">
                <img src="/star.svg" alt="Rating" />
                <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
              </div>
              <span>•</span>
              <span className="year">{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
              <span>•</span>
              <span className="language">{movie.original_language}</span>
              <span>•</span>
              <span className="runtime">{movie.runtime ? `${movie.runtime} min` : 'N/A'}</span>
            </div>
            
            <div className="genres">
              {movie.genres && movie.genres.map(genre => (
                <span key={genre.id} className="genre-tag">{genre.name}</span>
              ))}
            </div>
            
            <div className="overview">
              <h3>Overview</h3>
              <p className="font-dm-sans text-2xl">{movie.overview || 'No overview available'}</p>
            </div>
            
            {movie.tagline && (
              <p className="text-lime-200 mt-4 text-3xl"><em>{movie.tagline}</em></p>
              
            )}
            <button onClick={() => navigate(-1)} className="back-button mt-7">
              ← Back
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
};

export default MovieDetails;
