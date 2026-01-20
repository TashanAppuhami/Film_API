const movies = [
    { id: 1, title: "The Cosmic Drift", year: 2024, rating: 9.3, genres: "Sci-Fi, Adventure", color: '50/70/100' },
    { id: 2, title: "Silent Witness", year: 2023, rating: 8.9, genres: "Thriller, Crime", color: '100/50/50' },
    { id: 3, title: "Emberheart", year: 2024, rating: 7.5, genres: "Fantasy, Drama", color: '100/80/50' },
    { id: 4, title: "Neon City", year: 2022, rating: 8.1, genres: "Cyberpunk, Action", color: '50/100/50' },
    { id: 5, title: "Desert Bloom", year: 2023, rating: 9.0, genres: "Western, Romance", color: '70/50/50' },
    { id: 6, title: "The Great Lie", year: 2021, rating: 7.9, genres: "Mystery, Suspense", color: '50/50/70' },
    { id: 7, title: "Pixel Dreams", year: 2024, rating: 8.5, genres: "Animation, Comedy", color: '50/70/100' },
    { id: 8, title: "Shadow Play", year: 2024, rating: 9.1, genres: "Action, Espionage", color: '100/50/50' },
    { id: 9, title: "Urban Legends", year: 2023, rating: 8.0, genres: "Horror", color: '50/70/100' },
    { id: 10, title: "The Timekeeper", year: 2024, rating: 9.5, genres: "Sci-Fi, Drama", color: '100/80/50' },
    { id: 11, title: "Winter's End", year: 2023, rating: 8.8, genres: "Historical", color: '50/70/100' },
];

function createMovieCard(movie) {
    const imageUrl = `https://placehold.co/300x450/${movie.color}/FFFFFF?text=${movie.title.replace(/\s/g, '+')}`;

    return `
                    <div class="movie-card flex-none w-40 md:w-56 bg-card-bg rounded-xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition duration-300 cursor-pointer group">
                        <!-- Poster Image -->
                        <div class="relative aspect-[2/3] overflow-hidden">
                            <img src="${imageUrl}" 
                                 alt="Poster for ${movie.title}" 
                                 class="poster-image w-full h-full object-cover transition duration-300 ease-in-out"
                                 onerror="this.onerror=null;this.src='https://placehold.co/300x450/1A1A1A/FFFFFF?text=Poster+Missing'">

                            <!-- Rating Badge -->
                            <div class="absolute top-2 right-2 bg-accent text-black text-xs font-black px-2 py-1 rounded-full shadow-md">
                                ${movie.rating} ⭐
                            </div>

                            <!-- Hover Overlay -->
                            <div class="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <p class="text-xs text-gray-300 mb-2">${movie.genres}</p>
                                <button class="bg-accent text-black font-bold text-sm py-2 rounded-lg hover:bg-white transition active: color-blue" onclick="openPopUp(${movies[movie.id - 1]})">
                                    View Details
                                </button>
                                <button class="mt-2 text-white border border-white/50 text-sm py-1 rounded-lg hover:bg-white/20 transition">
                                    + Watchlist
                                </button>
                            </div>
                        </div>

                        <!-- Card Info -->
                        <div class="p-3">
                            <h3 class="text-sm md:text-base font-semibold truncate text-white">${movie.title}</h3>
                            <p class="text-xs text-gray-400">${movie.year}</p>
                        </div>
                    </div>
                `;
}


function renderMovieCarousel(containerId, movies) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = movies.map(createMovieCard).join('');
    }
}


window.onload = function () {
    renderMovieCarousel('trending-movies', movies);
    renderMovieCarousel('highest-rated', movies.slice(3, 11).sort((a, b) => b.rating - a.rating));
    renderMovieCarousel('just-added', movies.slice(6));
};


const suggestions = document.getElementById('suggestions'); //suggestion box\\
const searchBtn = document.getElementById('searchBtn');
const hiddenSearchBar = document.querySelector('.hiddenSearchBar');
const movieData = document.getElementById('searchBar-input'); //search input box\\
const closeBtn = document.getElementById('closeBtn');
const movieCard = document.getElementById('popUp-movie');

closeBtn.onclick = () => {
    hiddenSearchBar.style.display = "none";
    suggestions.style.display = "none";
    movieData.value = "";
}

searchBtn.onclick = () => {
    hiddenSearchBar.style.display = "block";
    movieData.focus();
}


movieData.addEventListener('input', function () {
    const query = movieData.value.trim();

    if (query.length < 3) {
        suggestions.innerHTML = "";
        suggestions.style.display = "none";
        return;
    }

    fetch(`https://www.omdbapi.com/?apikey=1ac807c5&s=${query}`)
        .then(response => response.json())
        .then(data => {
            suggestions.innerHTML = "";

            if (data.Response === "True") {
                suggestions.style.display = "block";
                data.Search.forEach(movie => {
                    const div = document.createElement("div");
                    div.id = "movie-row";
                    div.innerHTML = `<img src="${movie.Poster}" class="movie-poster">

                                    <div class="movie-info">
                                        <h3 class="movie-title">
                                            ${movie.Title}
                                        </h3>
                                        <p class="movie-meta">
                                            ${movie.Year}
                                        </p>
                                    </div>`;
                    div.style.display = "flex";
                    div.style.alignItems = "center";
                    div.style.padding = "10px";
                    div.style.cursor = "pointer";

                    div.onclick = () => {
                        movieData.value = movie.Title;
                        suggestions.style.display = "none";
                        loadMovieDetails(movie.imdbID);
                    };

                    suggestions.appendChild(div);
                });
            }
        });

});

function loadMovieDetails(imdbID) {
    fetch(`https://www.omdbapi.com/?apikey=1ac807c5&i=${imdbID}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                openPopUp(data);
            }
        });
}

function openPopUp(data) {
    movieCard.innerHTML = `
                <button id="closePopUpBtn" onclick="document.getElementById('popUp-movie').style.display='none'; movieData.focus()">✕</button>
                    <img src="${data.Poster}" alt="${data.Title} Poster" class="pop-movie-poster">
                    <div class="pop-movie-info">
                        <h2 class="pop-movie-title">${data.Title} (${data.Year})</h2>
                        <div class="rating">
                            <span class="imdb-rating">IMDb: ${data.imdbRating}</span>
                            <span class="votes">(${data.imdbVotes} votes)</span>
                        </div>
                        <div class="tags">
                            <span class="tag">${data.Rated}</span>
                            <span class="tag">${data.Genre.split(', ')[0]}</span>
                            <span class="tag">${data.Runtime}</span>
                        </div>
                        <p class="plot">${data.Plot}</p>
                        <div class="details">
                            <p><strong>Director:</strong> ${data.Director}</p>
                            <p><strong>Writer:</strong> ${data.Writer}</p>
                            <p><strong>Actors:</strong> ${data.Actors}</p>
                            <p><strong>Genre:</strong> ${data.Genre.split(', ')}</p>
                            <p><strong>Language:</strong> ${data.Language}</p>
                            <p><strong>Country:</strong> ${data.Country}</p>
                            <p><strong>Awards:</strong> ${data.Awards}</p>
                        </div>
                    </div>`;
                movieCard.style.display = "flex";
}