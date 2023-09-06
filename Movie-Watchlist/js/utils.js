const toggleDarkmodeBtn = document.querySelector(".btn--toggle-display");
let isWaiting = false;
let darkmodeSetting = JSON.parse(localStorage.getItem("movieWatchlistDarkmode")) ?? false;
darkmodeSetting ? toDarkmode("light", "dark") : "";

export function getExistingWatchlist() {
  return JSON.parse(localStorage.getItem("watchlist")) ?? {};
}

export function getMovieNotFoundHTML() {
  return `
  <div class="container flexcenter">
    <a class="flexcenter" href="#search-input">
      <img src="./images/movie-reel-icon.png" alt="An image of a movie reel frame" aria-hidden="true"/>
      <p class="movie__msg">No matches found, please try again</p>
    </a>
  </div>

  `
}

export function toggleDarkmode() {
  const darkmodeStatus = document.body.classList.contains("darkmode");
  darkmodeStatus ? toDarkmode("dark", "light") : toDarkmode("light", "dark");
  localStorage.setItem("movieWatchlistDarkmode", !darkmodeStatus);
  darkmodeSetting = !darkmodeStatus;
}

export function toDarkmode(changeFrom, changeTo) { 
  document.body.classList.toggle("darkmode");
  const toggleDarkmodeAddBtns = document.querySelectorAll(`img[src='./images/add-btn-icon-${changeFrom}.png']`);
  const toggleDarkmodeRemoveBtns = document.querySelectorAll(`img[src='./images/remove-btn-icon-${changeFrom}.png']`);
  toggleDarkmodeAddBtns.forEach(button => button.setAttribute("src", `./images/add-btn-icon-${changeTo}.png`));
  toggleDarkmodeRemoveBtns.forEach(button => button.setAttribute("src", `./images/remove-btn-icon-${changeTo}.png`));
  toggleDarkmodeBtn.textContent = `${changeFrom} mode`;
}

