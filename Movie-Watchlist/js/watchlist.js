import * as utils from "./utils.js";

const OMDB_API_KEY = "1db25ac7";
const toggleDarkmodeBtn = document.querySelector(".btn--toggle-display");
const movieCardContainer = document.querySelector(".movie__container");
let watchlist = utils.getExistingWatchlist();
let isWaiting = false;
let darkmodeSetting = JSON.parse(localStorage.getItem("movieWatchlistDarkmode")) ?? false;


/* Event Listeners */
toggleDarkmodeBtn.addEventListener("click", utils.toggleDarkmode);
document.body.addEventListener("click", (e) => {
  if (isWaiting) { return };
  if (e.target.dataset.id) {
    handleWatchlist(e, e.target.dataset.id)
    toggleSnackbar(e);
    setTimeout(toggleSnackbar, 2000);
  }
}, false)


/* Main Functionality */
function renderWatchlistHTML() {
  let html;
  if (!Object.keys(watchlist).length) {
    html = renderEmptyWatchlist();
    movieCardContainer.style.height = "100%";
  } else {
    html = getMovieFromWatchlistHTML(watchlist);
    movieCardContainer.style.height = "initial";
  }
  movieCardContainer.innerHTML = html;
}

function renderEmptyWatchlist() {
  return `
    <div class="container flexcenter">
      <img src="./images/movie-reel-icon.png" alt="An image of a movie reel frame" />
      <p class="movie__msg">Your watchlist is looking a little empty...</p>  
      <a href="index.html" class="movie__msg">
        <img src="./images/add-btn-icon-light.png" />
        Let's add some movies!
      </a>
    </div>
  `
}

function getMovieFromWatchlistHTML(watchlist) {
  let html = "";
  const lightDark = darkmodeSetting ? "dark" : "light";
  for (let data in watchlist) {
    const { Title, Runtime, Genre, Plot, Poster, imdbRating, imdbID } = watchlist[data];
    html += `
      <div class="movie__card" data-id="${imdbID}" tabindex="0">
        <img class="movie__poster" src="${Poster === "N/A" ? "./images/generic-movie-poster.jpg" : Poster}" alt="Poster for ${Title}" />
        <div class="movie__info">
          <div class="movie__header">
            <a href="https://www.imdb.com/title/${imdbID}" target="_blank" style="display: flex;">
              <h2 class="movie__title">${Title}</h2>
              <img class="img movie__img--icon" src="./images/star-icon.png" alt="Star rating" aria-hidden="true"/>
              <p class="movie__rating">${imdbRating} <span class='sr-only'>Star rating of</span></p>
            </a>
          </div>
          <div class="movie__body">
            <p class="movie__runtime">${Runtime === "N/A" ? "No runtime info" : "<span class='sr-only'>Runtime </span>" + Runtime}</p>
            <p class="movie__genre">${Genre === "N/A" ? "No genre info" : "<span class='sr-only'>Genre: </span>" + Genre}</p>
            <button class="btn btn--add-remove" data-id="${imdbID}" data-title="${Title}" data-add-remove="remove" title="Remove ${Title} from your watchlist">
              <img 
                class="img movie__img--icon" 
                src="./images/remove-btn-icon-${lightDark}.png" 
                data-id="${imdbID}" 
                data-title="${Title}" 
                data-add-remove="remove" 
                alt="Remove ${Title} from watchlist"
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

function handleWatchlist(e, imdbID) {
  let existingWatchlist = utils.getExistingWatchlist();
  existingWatchlist[imdbID] ? removeFromWatchlist(e, imdbID, existingWatchlist) : ""; 
}

function removeFromWatchlist(e, imdbID, existingWatchlist) {
  delete existingWatchlist[imdbID];
  localStorage.setItem("watchlist", JSON.stringify(existingWatchlist));
  document.querySelector(`[data-id="${imdbID}"]`).remove();
  checkEmptyWatchlist();
}

function checkEmptyWatchlist() {
  let existingWatchlist = utils.getExistingWatchlist();
  if (!Object.keys(existingWatchlist).length) { 
    watchlist = utils.getExistingWatchlist()
    renderWatchlistHTML() 
  }
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

renderWatchlistHTML()