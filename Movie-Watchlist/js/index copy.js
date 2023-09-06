import * as utils from "./utils.js";

/* Global Variables */

const OMDB_API_KEY = "1db25ac7";
const toggleDarkmodeBtn = document.querySelector(".btn--toggle-display");
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector(".btn--search");
const movieCardContainer = document.querySelector(".movie__container");
// const watchlist = utils.getExistingWatchlist();
let isWaiting = false;
let darkmodeSetting = JSON.parse(localStorage.getItem("movieWatchlistDarkmode")) ?? false;
// darkmodeSetting ? utils.toDarkmode("light", "dark") : "";


/* Event Listeners */
toggleDarkmodeBtn.addEventListener("click", utils.toggleDarkmode);
searchBtn.addEventListener("click", searchMovies);
document.body.addEventListener("click", (e) => {
  if (isWaiting) { return };
  if (e.target.dataset.id) {
    addToWatchlist(e, e.target.dataset.id)
    console.log(`Running toggleSnackbar(e)`);
    utils.toggleSnackbar(e);
    setTimeout(utils.toggleSnackbar, 2000);
  }
}, false)


/* Main Functionality */

async function searchMovies(e, searchType="s") {
  if (!searchInput.value) { return };
  const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&${searchType}=${searchInput.value}`);  
  const data = await response.json();
  if (data.Response === "False") {
    switch(data.Error) {
      case "Movie not found!":
        movieCardContainer.innerHTML = utils.movieNotFound();
        break;
      case "Too many results.":
        searchMovies(e, "t");
        break;
    }
  }
  let imdbIDList;
  searchType === "t" ? imdbIDList = [data.imdbID] : imdbIDList = data.Search.map(movie => movie.imdbID);
  movieCardContainer.innerHTML = `
    <div class="movie--loading">
      <img class="movie__img--loading" src="./images/loading-42.gif" alt="Loading search results">
      <p>Loading search results</p>
    <div>
    `
  setTimeout(async () => {
    movieCardContainer.style.height = "initial";
    movieCardContainer.innerHTML = await getMovieHTML(imdbIDList);
  }, 1000);
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
    const addRemove = onWatchlist ? "remove" : "add";
    html += `
      <div class="movie__card ${onWatchlist ? "on-watchlist" : ""}" data-id="${imdbID}">
        <img class="movie__poster" src="${Poster}" alt="Poster for ${Title}" />
        <div class="movie__info">
          <div class="movie__header">
            <a href="https://www.imdb.com/title/${imdbID}" target="_blank">
              <h2 class="movie__title">${Title}</h2>
            </a>
            <img class="img movie__img--icon" src="./images/star-icon.png" alt="Star rating" />
            <p class="movie__rating">${imdbRating}</p>
          </div>
          <div class="movie__body">
            <p class="movie__runtime">${Runtime}</p>
            <p class="movie__genre">${Genre}</p>
            <button class="btn btn--add-remove" data-id="${imdbID}" data-title="${Title}" data-add-remove="${addRemove}">
              <img class="img movie__img--icon" src="./images/${addRemove}-btn-icon-${lightDark}.png" data-id="${imdbID}" data-title="${Title}" data-add-remove="add" />
              Watchlist
            </button> 
            <p class="movie__plot">${Plot}</p>
          </div>
        </div>
      </div>
    `
  }
  return html;
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

async function updateAddBtnImg(e) {
  let btnElement = e.srcElement.tagName === "BUTTON" ? e.target : e.srcElement.parentElement;
  let imgElement = e.srcElement.tagName === "IMG" ? e.target : e.target.children[0];
  let lightDark = document.body.classList.contains("darkmode") ? "dark" : "light";
  let addRemove = e.target.dataset.addRemove === "add" ? "remove" : "add";
  imgElement.setAttribute("src", `./images/${addRemove}-btn-icon-${lightDark}.png`);
  btnElement.setAttribute("data-add-remove", addRemove);
  imgElement.setAttribute("data-add-remove", addRemove);
}

/* Utility Functions */

// function getExistingWatchlist() {
//   return JSON.parse(localStorage.getItem("watchlist")) ?? {};
// }

// function movieNotFound() {
//   return `
//   <div class="container flexcenter">
//     <a class="flexcenter" href="#search-input">
//       <img src="./images/movie-reel-icon.png" alt="An image of a movie reel frame" />
//       <p class="movie__msg">No matches found, please try again</p>
//     </a>
//   </div>

//   `
// }

// function toggleDarkmode() {
//   const darkmodeStatus = document.body.classList.contains("darkmode");
//   darkmodeStatus ? toDarkmode("dark", "light") : toDarkmode("light", "dark");
//   localStorage.setItem("movieWatchlistDarkmode", !darkmodeStatus);
//   darkmodeSetting = !darkmodeStatus;
// }

// function toDarkmode(changeFrom, changeTo) { 
//   document.body.classList.toggle("darkmode");
//   const toggleDarkmodeAddBtns = document.querySelectorAll(`img[src='./images/add-btn-icon-${changeFrom}.png']`);
//   const toggleDarkmodeRemoveBtns = document.querySelectorAll(`img[src='./images/remove-btn-icon-${changeFrom}.png']`);
//   toggleDarkmodeAddBtns.forEach(button => button.setAttribute("src", `./images/add-btn-icon-${changeTo}.png`));
//   toggleDarkmodeRemoveBtns.forEach(button => button.setAttribute("src", `./images/remove-btn-icon-${changeTo}.png`));
//   toggleDarkmodeBtn.textContent = `${changeFrom} mode`;
// }

// function toggleSnackbar(e = "") {
//   const snackbar = document.querySelector(".snackbar");
//   if (e) {
//     let addRemove = e.target.dataset.addRemove === "add" ? ["Added", "to"] : ["Removed", "from"];
//     snackbar.textContent = `${addRemove[0]} ${e.target.dataset.title} ${addRemove[1]} your watchlist`;
//   } 
//   snackbar.style.bottom = snackbar.style.bottom === "3em" ? "-3em" : "3em";
//   snackbar.style.opacity = snackbar.style.opacity === "1" ? "0" : "1";
//   isWaiting = !isWaiting;
// }