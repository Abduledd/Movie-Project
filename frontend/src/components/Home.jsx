import React, { useState, useEffect } from "react";

const Home = () => {
  const [movieTitle, setMovieTitle] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [movieTitles, setMovieTitles] = useState([]);
  const [movies20, setMovies20] = useState([]);

  useEffect(() => {
    // Fetch movie titles from the backend
    fetch("http://127.0.0.1:5000/api/movie_titles")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.movies_20_titles);
        setMovieTitles(data.movie_titles);
      })
      .catch((error) => console.error("Error fetching movie titles:", error));
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
    <div className="flex flex-col justify-center items-center bg-gray-700">
      <div></div>

      <div>
        <ul className="flex justify-center flex-wrap">
          {recommendations.map((movie) => (
            <li className="m-5 text-center" key={movie.recommendation.title}>
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
              <li className="m-5 text-center" key={movie.recommendation.title}>
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
