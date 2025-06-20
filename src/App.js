import { useEffect, useState } from "react";
import { Loader } from "./Components/Loader";
import { ErrorMessage } from "./Components/ErrorMessage";
import { NavBar } from "./Components/NavBar";
import { Search } from "./Components/Search";
import { NumResults } from "./Components/NumResults";
import { Main } from "./Components/Main";
import { Box } from "./Components/Box";
import { MovieList } from "./Components/MovieList";
import { MovieDetails } from "./Components/MovieDetails";
import { WatchedSummary } from "./Components/WatchedSummary";
import { WatchedMoviesList } from "./Components/WatchedMoviesList";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";

export const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const apiKey = process.env.REACT_APP_API_KEY;

// Structural
export default function App() {
    const [query, setQuery] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const { movies, isLoading, error } = useMovies(query);

    const [watched, setWatched] = useLocalStorageState([], "watched");

    function handleSelectMovie(id) {
        setSelectedId((selectedId) => (id === selectedId ? null : id));
    }

    function handleCloseMovie() {
        setSelectedId(null);
    }

    function handleAddWatched(movie) {
        setWatched((watched) => [...watched, movie]);
    }

    function handleDeleteWatched(id) {
        setWatched((watched) => watched.filter((movie) => movie.imbdID !== id));
    }

    return (
        <>
            <NavBar>
                <Search query={query} setQuery={setQuery} />
                <NumResults movies={movies} />
            </NavBar>
            <Main>
                <Box>
                    {isLoading && <Loader />}
                    {!isLoading && !error && (
                        <MovieList
                            movies={movies}
                            onSelectMovie={handleSelectMovie}
                        />
                    )}
                    {error && <ErrorMessage message={error} />}
                </Box>

                <Box>
                    {!isLoading && !error && selectedId ? (
                        <MovieDetails
                            selectedId={selectedId}
                            onCloseMovie={handleCloseMovie}
                            onAddWatched={handleAddWatched}
                            watched={watched}
                        />
                    ) : (
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedMoviesList
                                watched={watched}
                                onDeleteWatched={handleDeleteWatched}
                            />
                        </>
                    )}
                    {error && <ErrorMessage message={error} />}
                </Box>
            </Main>
        </>
    );
}
