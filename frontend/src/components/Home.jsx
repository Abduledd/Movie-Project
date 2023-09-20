import React, { useState, useEffect } from "react";

const Home = () => {
  const [movieTitle, setMovieTitle] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [movieTitles, setMovieTitles] = useState([]);
  const [randomMovies, setRandomMovies] = useState([]);

  useEffect(() => {
    // Fetch movie titles from the backend
    fetch("http://127.0.0.1:5000/api/movie_titles")
      .then((response) => response.json())
      .then((data) => {
        setMovieTitles(data.movie_titles);
      })
      .catch((error) => console.error("Error fetching movie titles:", error));

    // Fetch 20 random movies from the backend
    fetch("http://127.0.0.1:5000/api/random_movies")
      .then((response) => response.json())
      .then((data) => {
        setRandomMovies(data.random_movies);
      })
      .catch((error) => console.error("Error fetching random movies:", error));
  }, []);

  const handleInputChange = (event) => {
    setMovieTitle(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("http://127.0.0.1:5000/api/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movie: movieTitle,
        num_recommendations: 5,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const combinedData = data.recommendations.map(
          (recommendation, index) => ({
            recommendation,
            poster: data.posters[index],
          })
        );
        setRecommendations(combinedData);
      })
      .catch((error) => {
        console.error("Error fetching recommendations:", error.message);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-950">
      <h1 className="text-white text-3xl mb-5">20 random</h1>

      <div className="flex overflow-x-auto mb-5 max-w-screen-md">
        {randomMovies.map((movie, index) => (
          <div key={index} className="flex-shrink-0 w-48 p-4">
            <img src={movie.poster} alt={movie.title} className="w-full" />
            <p className="text-white mt-2 text-center">{movie.title}</p>
          </div>
        ))}
      </div>

      <h1>Movie Recommendations</h1>
      <form
        className="flex flex-col items-center justify-center m-5"
        onSubmit={handleSubmit}>
        <label>
          Enter a movie title:
          <select
            className="m-5"
            value={movieTitle}
            onChange={handleInputChange}>
            <option value="">Select a movie</option>
            {movieTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </label>
        <button
          className="w-52 rounded bg-blue-600 m hover:bg-blue-950 text-white font-sans h-8"
          type="submit">
          Get Recommendations
        </button>
      </form>

      {recommendations.length > 0 && (
        <div>
          <h2>Recommended Movies:</h2>
          <ul className="flex justify-center flex-wrap">
            {recommendations.map((movie) => (
              <li
                className="m-5 text-center text-white"
                key={movie.recommendation.title}>
                {movie.recommendation.title}
                <img
                  className="w-52 rounded-md"
                  src={movie.poster}
                  alt={movie.recommendation.title}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
