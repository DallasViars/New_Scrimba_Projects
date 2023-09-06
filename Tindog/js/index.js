import { dogs } from "./data.js";
import { getNextProfile } from "./utils.js";

// Global Variable Declarations
export let profileList
let firstPageLoad, currentProfile, prevProfiles, isWaiting

function resetApp(e) {
  profileList = dogs.map((dog, index) => index)
  currentProfile = getNextProfile();
  prevProfiles = [];
  firstPageLoad = true;
  displayProfile(currentProfile);
}
resetApp();
displayProfile(currentProfile);


function displayProfile(dog = 0) {
  const container = document.querySelector(".container");
  container.innerHTML = currentProfile.getProfileHTML();

  const profileImg = document.querySelector(".profile-img");  
  firstPageLoad ? firstPageLoad = false : profileImg.focus();
  setTimeout(activateEventListeners, 1000);
  profileImg.style.opacity = "1";
}

function getSummaryHTML(likedProfiles) {
  let html = `
    <div class="summary">
      <h2 class="summary-txt">Summary of likes</h2>
      <div class="likes-container">
  `;

  if (likedProfiles.length <= 0) {
    html += `<p class="no-matches">Oops, looks like there are no matches</p>`
  } else {
    html += likedProfiles.map(dog => {
      const { name, avatar, credit, verticalFaceThumbnail } = dog;
      return `
      <a href="${credit ? credit : '#'}">
        <img class="img-thumb" src="${avatar}" alt="${name}'s profile picture" style="object-position: center ${verticalFaceThumbnail}"  />
        <p>${name}</p>
      </a>
      `
    }).join("");
  }
  html += `
      </div>
      <button class="btn-reset">RESET</button>
    </div>
  `
  return html;
}

function displaySummary() {
  const likedProfiles = prevProfiles.filter(dog => {
    return dog.hasBeenLiked
  })
  const container = document.querySelector(".container");
  container.innerHTML = getSummaryHTML(likedProfiles);
  activateResetBtn();
}

function activateEventListeners() {
  const swipeBtns = document.querySelectorAll(".btn-container")
  swipeBtns.forEach(button => button.addEventListener("click", handleSwipe));

  const profileImg = document.querySelector(".profile-img");
  profileImg.addEventListener("keydown", handleArrow);

  const profileInfo = document.querySelector(".profile-info");
  profileInfo.addEventListener("keydown", handleArrow);
}

function activateResetBtn() {
  const resetBtn = document.querySelector(".btn-reset");
  resetBtn.addEventListener("click", resetApp)
}

function handleSwipe(e, swipeAction = false) {
  if (isWaiting) { return };

  const userChoice = swipeAction ? swipeAction : e.target.dataset.swipe;
  let animation = "";
  isWaiting = true;
  // currentProfile.hasBeenSwiped = true;
  currentProfile.isSwiped();

  if (userChoice === "like") {
    // currentProfile.hasBeenLiked = true;
    currentProfile.isLiked();
    animation = "swipe-animation-accept"
  } else {
    animation = "swipe-animation-reject"
  }

  currentProfile.updateBadge();  

  prevProfiles.push(currentProfile);

  const profileImg = document.querySelector(".profile-img");
  profileImg.classList.add(animation);

  if (profileList.length > 0) {
    setTimeout(function() {
      currentProfile = getNextProfile();
      profileImg.classList.remove(animation);
      displayProfile(currentProfile);
      isWaiting = false;
    }, 1500);
  } else {
    setTimeout(function() {
      displaySummary();
      isWaiting = false;
    }, 1500);
  }   
}

function handleArrow(e) {
  if (e.key === "ArrowLeft") {
    handleSwipe(e, "nope")
    e.target.focus();
  } else if (e.key === "ArrowRight") {
    handleSwipe(e, "like")
    e.target.focus();
  }
}



