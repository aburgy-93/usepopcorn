import { WatchedMovie } from "./WatchedMovie";

// Presentational
export function WatchedMoviesList({ watched, onDeleteWatched }) {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <WatchedMovie
                    movie={movie}
                    key={movie.title}
                    onDeleteWatched={onDeleteWatched}
                />
            ))}
        </ul>
    );
}
