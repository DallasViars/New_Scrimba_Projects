import * as utils from "./utils.js";

/* Global Variables */

const OMDB_API_KEY = "1db25ac7";
const toggleDarkmodeBtn = document.querySelector(".btn--toggle-display");
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector(".btn--search");
const movieCardContainer = document.querySelector(".movie__container");
let sessionSearch = JSON.parse(sessionStorage.getItem("sessionSearch")) ?? {};
let sessionSearchTerm = JSON.parse(sessionStorage.getItem("sessionSearchTerm")) ?? {};
let isWaiting = false;
let darkmodeSetting = JSON.parse(localStorage.getItem("movieWatchlistDarkmode")) ?? false;

if (Object.keys(sessionSearch).length > 0) {
  movieCardContainer.innerHTML = await getMovieHTML(sessionSearch);
  searchInput.value = sessionSearchTerm;
  searchInput.select();
}


/* Event Listeners */
toggleDarkmodeBtn.addEventListener("click", utils.toggleDarkmode);
searchBtn.addEventListener("click", searchMovies);

// Allows use of the Enter key on the search bar
document.body.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target === searchInput) { searchMovies(e) }  
});

// Toggles the Snackbar
document.body.addEventListener("click", (e) => {
  if (isWaiting) { return };
  if (e.target.dataset.id) {
    addToWatchlist(e, e.target.dataset.id)
    toggleSnackbar(e);
    setTimeout(toggleSnackbar, 2000);
  }
}, false)


/* Main Functionality */
async function searchMovies(e, searchType="s") {
  if (!searchInput.value) { return };
  const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&${searchType}=${searchInput.value}`);  
  const data = await response.json();
  if (data.Response === "False") {
    switch(data.Error) {

      // When there are too many matches, search again for exact title
      case "Too many results.":
        searchMovies(e, "t");
        return;
      case "Movie not found!":
      default:
        movieCardContainer.innerHTML = utils.getMovieNotFoundHTML();
        movieCardContainer.style.height = "100%";
        return;
    }
  }
  let imdbIDList;

  // Adjusts imdbIDList when error handling determines a title search is necessary
  searchType === "t" ? imdbIDList = [data.imdbID] : imdbIDList = data.Search.map(movie => movie.imdbID);

  updateSessionSearch(imdbIDList)
  renderLoadingHTML()
  renderMovieHTML(imdbIDList)
}

function renderLoadingHTML() {
  movieCardContainer.innerHTML = `
    <div class="movie--loading">
      <img class="movie__img--loading" src="./images/loading-42.gif" alt="Loading search results">
      <p>Loading search results</p>
    <div>
  ` 
}

async function getMovieHTML(imdbIDList) {
  let html = "";
  const lightDark = darkmodeSetting ? "dark" : "light";
  for (let imdbID of imdbIDList) {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}`);
    const data = await response.json();
    const { Title, Runtime, Genre, Plot, Poster, imdbRating } = data;
    const existingWatchlist = utils.getExistingWatchlist();
    const onWatchlist = Boolean(existingWatchlist[imdbID])
    const addRemove = onWatchlist ? ["remove", "from"] : ["add", "to"];
    html += `
      <div class="movie__card ${onWatchlist ? "on-watchlist" : ""}" data-id="${imdbID}" tabindex="0">
        <img class="movie__poster" src="${Poster === "N/A" ? "./images/generic-movie-poster.jpg" : Poster}" alt="Poster for ${Title}" />
        <div class="movie__info">
          <div class="movie__header">
            <a 
              href="https://www.imdb.com/title/${imdbID}" 
              target="_blank" 
              class="flex"
              title="Visit the IMDB page for ${Title}"
            >
              <h2 class="movie__title">${Title}</h2>
              <img class="img movie__img--icon" src="./images/star-icon.png" alt="Star rating" aria-hidden="true"/>
              <p class="movie__rating">${imdbRating} <span class='sr-only'>stars</span></p>
            </a>
          </div>
          <div class="movie__body">
            <p class="movie__runtime">${Runtime === "N/A" ? "No runtime info" : "<span class='sr-only'>Runtime </span>" + Runtime}</p>
            <p class="movie__genre">${Genre === "N/A" ? "No genre info" : "<span class='sr-only'>Genre: </span>" + Genre}</p>
            <button 
              class="btn btn--add-remove" 
              data-id="${imdbID}" 
              data-title="${Title}" 
              data-add-remove="${addRemove[0]}" 
              >
              <img 
                class="img movie__img--icon" 
                src="./images/${addRemove[0]}-btn-icon-${lightDark}.png" 
                data-id="${imdbID}" 
                data-title="${Title}" 
                data-add-remove="${addRemove[0]}" 
                alt="${addRemove[0]} ${Title} ${addRemove[1]} watchlist"
              />
              Watchlist
            </button> 
            <p class="movie__plot">${Plot === "N/A" ? "No plot info available" : Plot}</p>
          </div>
        </div>
      </div>
    `
  }
  return html;
}

/* Saves the most recent user search to display when the user returns
to index.html */
function updateSessionSearch(imdbIDList) {
  sessionSearchTerm = sessionStorage.setItem("sessionSearchTerm", JSON.stringify(searchInput.value));
  sessionSearch = sessionStorage.setItem("sessionSearch", JSON.stringify(imdbIDList));
}

async function renderMovieHTML(imdbIDList) {
  setTimeout(async () => {
    movieCardContainer.style.height = "initial";
    movieCardContainer.innerHTML = await getMovieHTML(imdbIDList);
  }, 1000);
}

async function addToWatchlist(e, imdbID) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}`);
  const data = await response.json();
  const { Title, Runtime, Genre, Plot, Poster, imdbRating } = data;
  let existingWatchlist = utils.getExistingWatchlist();
  if (existingWatchlist[imdbID]) {
    delete existingWatchlist[imdbID];
  } else {
    existingWatchlist[imdbID] = { Title, Runtime, Genre, Plot, Poster, imdbRating, imdbID };
  }
  localStorage.setItem("watchlist", JSON.stringify(existingWatchlist));
  updateAddBtnImg(e)
  document.querySelector(`[data-id="${imdbID}"]`).classList.toggle("on-watchlist");
}

/* Updates the +/- image for the Add to watchlist function and ensures the usage
of the proper color scheme's icon */
async function updateAddBtnImg(e) {
  let btnElement = e.srcElement.tagName === "BUTTON" ? e.target : e.srcElement.parentElement;
  let imgElement = e.srcElement.tagName === "IMG" ? e.target : e.target.children[0];
  let lightDark = document.body.classList.contains("darkmode") ? "dark" : "light";
  let addRemove = e.target.dataset.addRemove === "add" ? "remove" : "add";
  imgElement.setAttribute("src", `./images/${addRemove}-btn-icon-${lightDark}.png`);
  btnElement.setAttribute("data-add-remove", addRemove);
  imgElement.setAttribute("data-add-remove", addRemove);
}

function toggleSnackbar(e = "") {
  const snackbar = document.querySelector(".snackbar");
  if (e) {
    let addRemove = e.target.dataset.addRemove === "add" ? ["Added", "to"] : ["Removed", "from"];
    snackbar.textContent = `${addRemove[0]} ${e.target.dataset.title} ${addRemove[1]} your watchlist`;
  } 
  snackbar.style.bottom = snackbar.style.bottom === "3em" ? "-3em" : "3em";
  snackbar.style.opacity = snackbar.style.opacity === "1" ? "0" : "1";
  isWaiting = !isWaiting;
}
