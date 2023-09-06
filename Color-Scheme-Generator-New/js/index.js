import { copyText, getRandomColor, setColorInputTitle, toggleDarkMode, unfocusElement } from "./utils.js";

export const btnToggleColorMode = document.querySelector("#btn-toggle-color-mode");
export const getColorInput = document.querySelector("#color-input");
const getColorSchemeBtn = document.querySelector("#get-color-scheme-btn");
const sectionColors = document.querySelector("#colors");
const apiBaseURL = `https://www.thecolorapi.com`
const apiPath = `/scheme`
let firstPageLoad = true;

/* Event Listeners */
btnToggleColorMode.addEventListener("click", toggleDarkMode);
getColorSchemeBtn.addEventListener("click", getColorScheme);
getColorInput.addEventListener("mouseenter", setColorInputTitle);
sectionColors.addEventListener("mouseenter", unfocusElement);

/* These Event Listeners trigger the copyText() function */
document.body.addEventListener("click", (e) => {
  if (e.target.dataset.color) { 
    copyText(e);
  };
});
document.body.addEventListener("keydown", (e) => {
  if (e.target.dataset.color && (e.key === "Enter" || e.key === " ")) { 
    copyText(e); 
  };
});

function getColorScheme(e, color="") {
  const getColorSchemeSelect = document.querySelector("#color-selector");
  const hexColor =  color ? color : getColorInput.value.substring(1);

  /* This sets the value of the Color Input to match the RGB of the randomly 
     chosen color on page load */
  color ? getColorInput.value = "#" + color : getColorInput.value = getColorInput.value;

  const apiScheme = getColorSchemeSelect.value;
  fetch(`${apiBaseURL}${apiPath}?hex=${hexColor}&mode=${apiScheme}&count=5`)
    .then(res => res.json())
    .then(data => {
      const { colors } = data;
      const colorList = colors.map(color => {
        return {hex: color.hex.value, name: color.name.value};
      });
      renderColorListHTML(colorList);
    })
}

function renderColorListHTML(param) {
  sectionColors.innerHTML = param.map(color => {
    const { hex, name } = color;
    return `
      <div class="colors__container" data-color="${hex}" tabindex="0">
        <div class="colors--bar" style="background:${hex}" data-color="${hex}">
          <p class="colors--name" data-color="${hex}">${name}</p>
        </div>
      <p class="colors--hex" data-color="${hex}">${hex}</p>
      </div>
    `
  }).join("");
  if (firstPageLoad) {
    handleFirstPageLoad();
  } else {
    document.querySelector(".colors__container").focus();
  }
}

function handleFirstPageLoad() {
  firstPageLoad = !firstPageLoad;
  document.querySelector("h1").focus();
}

getColorScheme("", getRandomColor());