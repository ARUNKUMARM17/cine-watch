import { useEffect, useState } from 'react'
import './App.css'
import { Search } from './components/Search.jsx'
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import MovieDetails from './components/MovieDetails.jsx';
import { useDebounce } from 'react-use';
import { updateSearchCount } from './appwrite.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    useDebounce(()=> setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
    const fetchMovies = async (query='') => {
        setLoading(true);
        try{
            const endpoint= query?
                 `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                 :
            `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
                 const response = await fetch(endpoint, API_OPTIONS);

            if(!response.ok) {
                throw new Error('Failed to fetch movies');
            }

            const data = await response.json();
            console.log(data);

            if(data.Response === 'False') {
                setErrorMessage(data.Error || 'Failed to fetch movies');
                setMovieList([]);
                return;
            }
            setMovieList(data.results || []);

            if(query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }

        }
        catch(error){
            console.error('Error fetching movies:', error);
            setErrorMessage(error.message || 'An error occurred while fetching movies');
        }
        finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {  
        fetchMovies(debouncedSearchTerm); 
    },[debouncedSearchTerm]);
    return(
        <main>
            <div className="pattern"/>
            <div className="wrapper">
                <header>
                    <img src="hero.png" className="" alt="Hero Image" />
                    <h1>Fell free to watch your Favourite <span className="text-gradient" >movies</span></h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                </header>
                <section className="all-movies">
                    <h2>All Movies</h2>
                    {loading?(
                        <Spinner />
                    ):errorMessage?(
                        <p className="text-red-500">{errorMessage}</p>
                    ):(
                        <ul>
                            {movieList.map((movie) => (
                                <MovieCard key={movie.id} movie={movie}/>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
}


export default App
