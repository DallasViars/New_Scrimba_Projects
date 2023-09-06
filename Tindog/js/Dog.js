// import { dogs } from "./data.js";
// import { getNextProfile } from "./utils.js"

export class Dog {
  constructor(data) {
    Object.assign(this, data)
  }
  
  getProfileHTML() {
    const { name, avatar, age, bio, verticalFace } = this;
    return `
      <img id="profile" class="img profile-img" style="object-position: center ${verticalFace ? verticalFace : 0}" src="${avatar}" alt="${name}'s profile picture" tabindex="0" />
      <img class="img badge hidden" src="" alt="Like/Nope badge" tabindex="0" />
      <div class="profile-info" tabindex="0">
        <h2>${name}, ${age}</h2>
        <p>${bio}</p>
      </div>
      <div class="buttons">
          <button class="btn-container" data-swipe="nope">
              <img class="btn-img" src="./images/icon-cross.png" alt="Reject profile" data-swipe="nope" />
          </button>
          <button class="btn-container" data-swipe="like">
              <img class="btn-img" src="./images/icon-heart.png" alt="Like profile" data-swipe="like" />
          </button>
      </div>
    `
  }

  isSwiped() {
    this.hasBeenSwiped = true;
  }
  
  isLiked() {
    this.hasBeenLiked = true;
  }

  updateBadge() {
    let badgeImg, badgeAlt; 
    if (this.hasBeenLiked) {
      badgeImg = `./images/badge-like.png`
      badgeAlt = `Liked ${this.name}'s profile`
    } else {
      badgeImg = `./images/badge-nope.png`
      badgeAlt = `Rejected ${this.name}'s profile`
    } 
    let badgeEl = document.querySelector(".badge");
    badgeEl.setAttribute("src", badgeImg);
    badgeEl.setAttribute("alt", badgeAlt);
    badgeEl.classList.remove("hidden");
    badgeEl.focus();
  }
}

