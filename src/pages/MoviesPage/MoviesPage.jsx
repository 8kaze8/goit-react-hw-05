import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import MovieList from "../../components/MovieList/MovieList";
import css from "./MoviesPage.module.css";

const API_KEY = "fc00e292316728435fcb18b4452b3c72";

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") ?? "";

  useEffect(() => {
    if (!query) return;

    const searchMovies = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
        );
        setMovies(response.data.results);
      } catch (error) {
        setError("Failed to search movies");
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const searchQuery = form.elements.query.value;
    setSearchParams(searchQuery !== "" ? { query: searchQuery } : {});
  };

  return (
    <div className={css.container}>
      <form onSubmit={handleSubmit} className={css.searchForm}>
        <input
          type="text"
          name="query"
          defaultValue={query}
          placeholder="Search movies..."
          className={css.input}
        />
        <button type="submit" className={css.button}>
          Search
        </button>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div className={css.error}>{error}</div>}
      {movies.length > 0 && <MovieList movies={movies} />}
    </div>
  );
};

export default MoviesPage;
