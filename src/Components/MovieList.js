import { Movie } from "../App";

/*
// Stateful
function WatchedBox() {
    const [watched, setWatched] = useState(tempWatchedData);
    const [isOpen2, setIsOpen2] = useState(true);
    
    return (
        <div className="box">
        <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
        >
        {isOpen2 ? "–" : "+"}
        </button>
        {isOpen2 && (
            <>
            <WatchedSummary watched={watched} />
            <WatchedMoviesList watched={watched} />
            </>
        )}
        </div>
    );
}
*/
// Stateful
export function MovieList({ movies, onSelectMovie }) {
    return (
        <ul className="list list-movies">
            {movies?.map((movie) => (
                <Movie
                    movie={movie}
                    key={movie.imdbID}
                    onSelectMovie={onSelectMovie}
                />
            ))}
        </ul>
    );
}
