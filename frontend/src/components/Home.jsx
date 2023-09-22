import React, { useState, useEffect } from "react";
import { Typography, Select, Option } from "@material-tailwind/react";

const Home = () => {
  const [movieTitle, setMovieTitle] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [movieTitles, setMovieTitles] = useState([]);

  useEffect(() => {
    // Fetch movie titles from the backend
    fetch("http://127.0.0.1:5000/api/movie_titles")
      .then((response) => response.json())
      .then((data) => {
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
    <div className="flex flex-col justify-center items-center pt-20 bg-gray-900">
      <h1 className="bg-black text-red-900 font-bold rounded-2xl mb-5 p-2 text-center">
        Movie Recommendations
      </h1>
      <form
        className="flex flex-col items-center justify-center p-5 m-10 rounded-xl bg-gray-400"
        onSubmit={handleSubmit}>
        <label className="px-10 flex flex-col">
          Enter a movie title:
          <select
            className="m-5 w-96"
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
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 text-center ">
            {recommendations.map((movie) => (
              <div
                className=" flex items-center mt-6 bg-black p-5 rounded-2xl"
                key={movie.recommendation.title}>
                <div color="blue-gray" className="m-2">
                  <img
                    className="w-36 h-auto max-w-52 rounded-md duration-200 hover:scale-110"
                    src={movie.poster}
                    alt={movie.recommendation.title}
                  />
                </div>
                <div className="sm:w-72 ml-5">
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="mb-2 text-red-900">
                    {movie.recommendation.title}
                  </Typography>
                  <Typography className="text-white">
                    {movie.recommendation.overview}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
