import { blogData } from "./data.js";
const hero = document.querySelector(".hero");
const blogListEl = document.querySelector(".blog-list");


function getFileName() {
  return window.location.href.split("/").pop();
}


function getHeroIndexHTML() {
  return `
    <h1 class="hero-title index" data-id="0">My new journey as a bootcamp student.</h1>
    <p class="hero-date index" data-id="0">July 23, 2022</p>
    <p class="hero-blurb index" data-id="0">After several months of learning in the Frontend Developer Career Path, I've made the big jump over to the Bootcamp to get expert code reviews of my Solo Projects projects and meet like-minded peers.</p>
  `
}
function renderHeroIndex() {
  hero.classList.remove(...hero.classList);
  hero.classList.add("hero", "index")
  hero.dataset.id = "0";
  hero.innerHTML = getHeroIndexHTML();
}


function getBodyHTML(body) {
  let html = ``;
  for (let blog of body) {
    const { paragraphTitle, paragraphBody } = blog;
    html += `
      <h2>${paragraphTitle}</h2>
      <p class="hero-body">${paragraphBody}</p>
    `
  }
  return html;
}


function getHeroBlogHTML(num=0) {
  const { id, date, title, blurb, body } = blogData.blogs[num];
  return `
      <h1 class="hero-title wide">${title}</h1>
      <p class="hero-date wide">${date}</p>
      <p class="hero-blurb wide">${blurb}</p>
      <div class="hero-img-container" data-id="${id}"></div>
    <div class="hero-body-container wide" tabindex="0">
      ${getBodyHTML(body)}
    </div>
    
  `
}
function renderHeroBlog(num=0) {
  delete hero.dataset.id;
  hero.classList.remove(...hero.classList);
  hero.classList.add("hero", "blog")
  hero.innerHTML = getHeroBlogHTML(num);
  hero.focus();
  setHeroBlogImage(num);
  renderBlogList()
}


function setHeroBlogImage(num) {
  const heroImgContainer = document.querySelector(".hero-img-container");
  const { image, alt } = blogData.blogs[num];
  heroImgContainer.style.backgroundImage = `url("${image}"`;
  heroImgContainer.setAttribute("aria-label", alt);
  heroImgContainer.setAttribute("role", "img");
}


function getHeroAboutMeHTML() {
  const { pfp, alt, title, intro, body } = blogData.aboutMe;
  return `
    <div class="hero-info-container" tabindex="0">
      <h1 class="hero-title about-me wide">${title}</h1>
      <img class="img about-me-img" src="${pfp}" alt="${alt}" />
      <p class="hero-blurb wide">${intro}</p>
    </div>
    <div class="hero-body-container wide" tabindex="0">
      ${getBodyHTML(body)}
    </div>
  `  
}
function renderHeroAboutMe() {
  hero.classList.remove(...hero.classList);
  hero.classList.add("hero", "blog")
  hero.innerHTML = getHeroAboutMeHTML();
}


function getBlogListHTML(count=3, viewMore=false) {

  const blogID = document.querySelector(".hero-img-container")?.dataset.id ?? 0;

  if (viewMore) { 
    count += 3
  }
  
  if (blogID <= count) { 
    count++
  }

  if (count >= blogData.blogs.length) { 
    count = blogData.blogs.length
  }

  let blogsToDisplay = blogData.blogs.slice(0, count)

  const hideRecentPosts = !hero.classList.contains("blog") 
  const hideViewMore = (count >= blogData.blogs.length);

  let html = `<p class="blog-recent ${hideRecentPosts ? 'hide' : ''}" tabindex="0">Recent posts</p>`
  
  html += blogsToDisplay.map(blog => {
    const { id, image, alt, date, title, blurb } = blog;

    if (id === Number(blogID)) { return };

    return `
      <div class="blog-link" data-id="${id}" role="button" tabindex="0">
        <div class="blog-container" data-id="${id}" >
          <h3 class="blog-title" data-id="${id}" >${title}</h2>
          <p class="blog-date" data-id="${id}" >${date}</p>
          <p class="blog-blurb" data-id="${id}" >${blurb}</p>
          <img class="img blog-img" src="${image}" data-id="${id}" alt="${alt}"/>
        </div>
      </div>
    `
  }).join("");
  html += `<button class="btn btn-view-more ${hideViewMore ? 'hide' : ''}">View More</button>`
  return html;
}
function renderBlogList(count=3, viewMore=false) {
  blogListEl.innerHTML = getBlogListHTML(count, viewMore);
  activateEventListeners();
}


function activateEventListeners() {
  document.addEventListener("click", renderHeroBlogEvent)
  document.addEventListener("keyup", renderHeroBlogEvent)
  document.addEventListener("click", viewMoreEvent)
  document.addEventListener("keyup", viewMoreEvent)
}


function renderHeroBlogEvent(e) {

  if (e.key === " ") { e.preventDefault() }

  if (e.target.dataset.id) {
    if ((e.key === "Enter" || e.key === " ") || e.type === "click") {
      renderHeroBlog(e.target.dataset.id);
      window.scroll(0,0);
    }
  }
}


function viewMoreEvent(e) {
  if (e.key === " ") { e.preventDefault() }

  if (e.target.classList.contains("btn-view-more")) {
    if ((e.key === "Enter" || e.key === " ") || e.type === "click") {
      const blogCountShown = document.querySelectorAll(".blog-link").length;
      renderBlogList(blogCountShown, true)
      const blogLinks = document.querySelectorAll(".blog-link")
      const scrollToElement = blogLinks[blogLinks.length - 3];
      scrollToElement.scrollIntoView(true);
    }
  }
}

//Determines whether to render index.html's or about-me.html's content
switch (getFileName()) {
  case "about-me.html":
    renderHeroAboutMe();
    renderBlogList(3, false);

    break;
  default:
    renderHeroIndex();
    renderBlogList(6, false);
}

