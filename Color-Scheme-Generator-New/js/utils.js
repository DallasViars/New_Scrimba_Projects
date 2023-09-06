import { getColorInput, btnToggleColorMode } from "./index.js";

export function toggleDarkMode(e) {
  const btnToggleColorModeText = document.body.classList.contains("darkmode") ? "Dark mode" : "Light mode";
  btnToggleColorMode.textContent = btnToggleColorModeText;
  document.body.classList.toggle("darkmode");
}

export function getRandomColor() {
  const charSet = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"]
  return new Array(6).fill(0).map(char => charSet[randNum(0, charSet.length-1)]).join("");
}

export function randNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* This function sets the title attribute of the Color Input to enable
   the user to see the RGB hex value of the selected color */
export function setColorInputTitle(e) {
  getColorInput.setAttribute("title", getColorInput.value);
}

/* This function removes the focus from the currently focused element */
export function unfocusElement() {
  document.activeElement.blur();
}

export function copyText(e) {
  const copiedText = e.target.dataset.color;
  navigator.clipboard.writeText(copiedText);
  alert(`Copied ${copiedText}`);
}