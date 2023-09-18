import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [movieTitle, setMovieTitle] = useState("");
  const [recommendations, setRecommendations] = useState([]);

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
        setRecommendations(data.recommendations);
      })
      .catch((error) => {
        console.error("Error fetching recommendations:", error.message);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center bg-orange-300">
      <h1>Movie Recommendations</h1>
      <form
        className="flex flex-col items-center justify-center m-5"
        onSubmit={handleSubmit}>
        <label>
          Enter a movie title:
          <input
            className="m-5"
            type="text"
            value={movieTitle}
            onChange={handleInputChange}
          />
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
          <ul>
            {recommendations.map((movie) => (
              <li key={movie.title}>{movie.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
