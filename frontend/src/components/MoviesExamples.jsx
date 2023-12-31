import React, { useState, useEffect } from "react";
import { Carousel } from "@material-tailwind/react";

const MoviesExamples = () => {
  const [randomMovies, setRandomMovies] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/random_movies")
      .then((response) => response.json())
      .then((data) => {
        setRandomMovies(data.random_movies);
      })
      .catch((error) => console.error("Error fetching random movies:", error));
  }, []);

  return (
    <div className="bg-gray-900 p-5">
      <h1 className="bg-black text-red-900 font-bold rounded-2xl mb-5 p-2 text-center">
        If you're looking to find a movie similar to one you enjoyed, this
        website is the ideal choice for you.
      </h1>

      <Carousel
        className="rounded-xl"
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                  activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}>
        {randomMovies.map((movie, index) => (
          <div
            key={index}
            className="flex flex-col justify-center items-center">
            <img
              src={movie.poster}
              alt={movie.title}
              className="h-full w-52 object-cover rounded-xl duration-200 hover:scale-95"
            />
            <p className="text-red-900 mt-3 mb-8 text-center">{movie.title}</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default MoviesExamples;
