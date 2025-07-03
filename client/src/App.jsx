import { useEffect, useState } from 'react'
import './App.css'
import { Search } from './components/Search.jsx'
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import { useDebounce } from 'react-use';
import { UpdateSearchCount } from './UpdateSearchCount.jsx';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const backendUrl=import.meta.env.VITE_BACKEND_URL;

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
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    useDebounce(()=> setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
    const trendingmovies=async()=>{
        try{
            const response=await fetch(`${backendUrl}/api/trending-movies`,{
                method:'GET',
                headers:{
                    accept:'application/json', // Only accept header
                }
            })
            const data=await response.json();
            if(data.success){
                setTrendingMovies(data.data);
            }
            console.log(data);
        }
        catch(error){
            console.error('Error fetching trending movies:', error);
            setErrorMessage(error.message || 'An error occurred while fetching trending movies');
    }

    }
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
                await UpdateSearchCount(query, data.results[0]);
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
    useEffect(() => {
        trendingmovies();
    },[]);
    return(
        <main>
            <div className="pattern"/>
            <div className="wrapper">
                <header>
                    <img src="hero.png" className="" alt="Hero Image" />
                    <h1>All your <span className="text-gradient" >movies </span>in one place</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                </header>
                <section className="trending">
                    <h2 className="text-left">Trending Movies</h2>
                    {
                        trendingMovies.length > 0 ? (

                            <ul>
                                {
                                    trendingMovies.map((movie,index)=>(
                                        <li key={movie._id}>
                                            <p>{index+1}</p>
                                            <img src={movie.image_url} alt={movie.searchTerm} />

                                            </li>
                                    )
                                )
                                    
                                }
                            </ul>
                        ):(
                            <p className="text-gray-500">No trending movies available</p>
                        )
                    }
                </section>
                <section className="all-movies">
                    <h2 className="text-left">All Movies</h2>
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
