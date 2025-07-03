import React from 'react'
import { useNavigate } from 'react-router-dom'

const MovieCard = ({movie}) => {
    const navigate = useNavigate();
    const { title, vote_average,poster_path, release_date,original_language } = movie;
    
    const handleImageClick = () => {
        navigate(`/movie/${movie.id}`);
    };
    
    return (
        <div className="movie-card">
            <img 
                src={poster_path?`https://image.tmdb.org/t/p/w500${poster_path}`:'/no-movie.png'} 
                alt={title} 
                onClick={handleImageClick}
                style={{ cursor: 'pointer' }}
            /> 
            <h3 className='text-left mt-2'>{title}</h3>
        <div className="content">
            <div className='rating'>
                <img src='star.svg' alt='Rating' />
                <p>{vote_average?vote_average.toFixed(1):'N/A'}</p>
            </div>
            <span>•</span>
            <p className="lang">
                {original_language}
            </p>
            <span>•</span>
            <p className="year">
                {release_date?release_date.split('-')[0]:'N/A'}
            </p>
        </div>


    </div>
  )
}

export default MovieCard