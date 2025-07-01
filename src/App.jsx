import { useEffect, useState } from 'react'
import './App.css'
import { Search } from './components/Search.jsx'


const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

   


const App = ()=>{
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const fetchMovies = async () => {
        try{
            const endpoint= `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
                 const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      console.log(data);

    //   if(data.Response === 'False') {
    //     setErrorMessage(data.Error || 'Failed to fetch movies');
    //     setMovieList([]);
    //     return;
    //   }




        }
        catch(error){
            console.error('Error fetching movies:', error);
        }
    }
    useEffect(() => {  
        fetchMovies(); 

    });
    return(
     <main>
          <div className="pattern"/>
          <div className="wrapper">
          <header>
            <img src="hero.png" className="" alt="Hero Image" />
            <h1>Fell free to watch your Favourite <span className="text-gradient" >movies</span></h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

          </header>



         </div>

     </main>
    );
}


export default App
