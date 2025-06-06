import { useState, useEffect, useRef } from "react";
import { apiKey } from "../App";
import { Loader } from "./Loader";
import StarRating from "./StarRating";
import { useKey } from "../useKey";

export function MovieDetails({
    selectedId,
    onCloseMovie,
    onAddWatched,
    watched,
}) {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState("");
    const [error, setError] = useState("");

    const countRef = useRef(0);

    useEffect(
        function () {
            if (userRating) countRef.current = countRef.current + 1;
        },
        [userRating]
    );

    // const foundMovie = watched.find((movie) => movie.imbdID === selectedId);
    const isWatched = watched.map((movie) => movie.imbdID).includes(selectedId);
    const watchedUserRating = watched.find(
        (movie) => movie.imbdID === selectedId
    )?.userRating;

    const {
        Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre,
    } = movie;

    function handleAdd() {
        const newWatchedMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(" ").at(0)),
            userRating,
            countRatingDecisions: countRef.current,
        };

        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }

    useKey("Escape", onCloseMovie);

    useEffect(
        function () {
            async function getMovieDetails() {
                try {
                    setIsLoading(true);
                    setError("");
                    const res = await fetch(
                        `http://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`
                    );

                    if (!res.ok)
                        throw new Error(
                            "Something went wrong getting movie details"
                        );

                    const data = await res.json();

                    if (data.Response === "False")
                        throw new Error("Details not found");
                    setMovie(data);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setIsLoading(false);
                }
            }

            getMovieDetails();
        },
        [selectedId]
    );

    useEffect(
        function () {
            if (!title) return;
            document.title = `Movie | ${title}`;

            return function () {
                document.title = "usePopcorn";
            };
        },
        [title]
    );

    return (
        <div className="details">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <header>
                        <button className="btn-back" onClick={onCloseMovie}>
                            &larr;
                        </button>
                        <img src={poster} alt={`Poster of ${movie} movie`} />
                        <div className="details-overview">
                            <h2>{title}</h2>
                            <p>
                                {released} &bull; {runtime}
                            </p>
                            <p>{genre}</p>
                            <p>
                                <span>⭐</span> {imdbRating} IMBd rating
                            </p>
                        </div>
                    </header>

                    <section>
                        <div className="rating">
                            {!isWatched ? (
                                <>
                                    <StarRating
                                        maxRating={10}
                                        size={24}
                                        onSetRating={setUserRating}
                                    />
                                    {userRating > 0 && (
                                        <button
                                            className="btn-add"
                                            onClick={handleAdd}
                                        >
                                            + Add to list
                                        </button>
                                    )}{" "}
                                </>
                            ) : (
                                <p>
                                    You rated this movie with{" "}
                                    {watchedUserRating} <span>⭐</span>
                                </p>
                            )}
                        </div>
                        <p>
                            <em>{plot}</em>
                        </p>
                        <p>Starring {actors}</p>
                        <p>Directed by {director}</p>
                    </section>
                </>
            )}
        </div>
    );
}
