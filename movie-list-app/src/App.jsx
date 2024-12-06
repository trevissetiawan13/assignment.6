import React, { useReducer, useEffect } from 'react';
import './index.css';

const initialState = {
  movies: [],
  loading: true,
  searchTerm: 'batman',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_MOVIES':
      return { ...state, movies: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { movies, loading, searchTerm } = state;
  const apiKey = import.meta.env.VITE_OMDB_API_KEY;

  useEffect(() => {
    const fetchMovies = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`);
      const data = await response.json();
      if (data.Response === "True") {
        dispatch({ type: 'SET_MOVIES', payload: data.Search });
      } else {
        console.error('Error fetching movies:', data.Error);
      }
    };

    fetchMovies();
  }, [apiKey, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.searchTerm.value });
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <nav className="bg-gray-800 py-4">
        <div className="container mx-auto p-4 flex justify-between">
          <h1 className="text-3xl font-bold text-white">Trevis Movie Finder</h1>
          <form onSubmit={handleSearch} className="flex items-center">
            <input type="text" name="searchTerm" placeholder="Cari film..." className="py-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600" />
            <button type="submit" className="ml-4 py-2 px-4 text-sm text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600">Cari</button>
          </form>
        </div>
      </nav>
      <div className="container mx-auto p-4 mt-4">
        <h1 className="text-3xl font-bold text-center mb-4">Movie List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <div key={movie.imdbID} className="bg-white rounded-lg shadow-md p-4">
              <img src={movie.Poster} alt={movie.Title} className="rounded-t-lg w-full h-auto" />
              <h2 className="text-xl font-semibold">{movie.Title}</h2>
              <p className="text-gray-600">{movie.Year}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;