import { accounts } from "./data.js";

function renderPage(id=1) {
  if (document.querySelector(".container")) {
    document.querySelector(".container").remove();
  }
  const container = document.createElement("div");
  container.classList.add("container");

  const main = document.createElement("main");
  main.classList.add("flex", "col", "wide100", "aicenter");
  main.append(
    getMainAccountListHTML(),
    getMainAccountsBargraphHTML(id) ?? ""
  );

  container.append(
    getHeaderHTML(), 
    getNavbarHTML(), 
    getButtonHTML(), 
    main
  );

  document.querySelector("body").prepend(container);

  activateHamburgerMenu();
  activateMainAccounts();
  handleScreenSize();
  if (accounts[id-1].spendings.length) { setBargraphWidths() }
  document.querySelector(`[data-id="${id}"`).focus();
}
function getHeaderHTML() {
  const header = document.createElement("header");
  header.classList.add("flex");
  header.innerHTML = `<img class="header--img__logo resp-img" src="./bestbank_logo.png" alt="Best Bank Logo" />`
  return header;
}
function getNavbarHTML() {
  const navbar = document.createElement("div");
  navbar.classList.add("container");
  navbar.innerHTML = `
    <nav class="navbar">
      <div class="hamburger-menu" tabindex="0" aria-label=”Open the navigation menu”>
        <div class="line line-1" aria-hidden="true"></div>
        <div class="line line-2" aria-hidden="true"></div>
        <div class="line line-3" aria-hidden="true"></div>
      </div>
      <ul class="nav-list">
        <li class="nav-item">
          <a href="#" class="nav-link">Home</a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link">Payments</a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link">Savings</a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link">Financing</a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link">Stocks</a>
        </li>
      </ul>
    </nav>
  `
  return navbar;
}
function getButtonHTML() {
  const btnContainer = document.createElement("div");
  btnContainer.classList.add("btn__container", "flex", "col", "wide100", "aicenter");
  btnContainer.innerHTML = `
    <button class="btn">Pay</button>
    <button class="btn">Transfer</button>
  `
  return btnContainer;
}
function getMainAccountListHTML() {
  const section = document.createElement("section");
  section.classList.add("main--accounts", "flex", "col", "aistart");

  const h2 = document.createElement("h2");
  h2.innerHTML = `Accounts`
  section.append(h2);

  accounts.forEach(account => {
    const {id, title, balance} = account;

    const mainAccountsAccount = document.createElement("div");

    const pTitle = document.createElement("p");
    pTitle.innerText = title;

    const pBalance = document.createElement("p");
    pBalance.innerText = `$${balance}`

    mainAccountsAccount.classList.add("main--accounts__account", "flex", "col", "aicenter", "wide100")
    mainAccountsAccount.append(pTitle, pBalance);
    mainAccountsAccount.setAttribute("data-id", id)
    mainAccountsAccount.setAttribute("tabindex", 0)
    pTitle.setAttribute("data-id", id);
    pBalance.setAttribute("data-id", id)
    section.append(mainAccountsAccount);
  })
  return section; 
}
function getMainAccountsBargraphHTML(id=1) {
  const accountSpending = accounts
    .filter(item => id == item.id ? item : "" )[0].spendings
    .sort((a, b) => b.spent - a.spent);

  const section = document.createElement("section");
  section.classList.add("main--accounts", "main--accounts__detail-list", "flex", "col", "aistart");
  const h2 = document.createElement("h2");
  h2.innerHTML = `Spendings`
  section.append(h2);

  if (!accountSpending.length) { 
    const pEmpty = document.createElement("p");
    pEmpty.innerText = "No transactions found";
    section.append(pEmpty);
    return section
  }

  accountSpending.forEach(account => {
    const {category, spent} = account;
    const mainAccountsBargraph = document.createElement("div");
    mainAccountsBargraph.classList.add("main--accounts__bargraph", "flex", "row", "wide100")
    mainAccountsBargraph.setAttribute("tabindex", 0);
    const pCategory = document.createElement("p");
    pCategory.classList.add("main--accounts__details");
    pCategory.innerText = category;

    const pSpent = document.createElement("p");
    pSpent.classList.add("main--accounts__details");
    pSpent.innerText = `$${spent}`;

    mainAccountsBargraph.append(pCategory, pSpent);
    section.append(mainAccountsBargraph);
  });
  return section;
}
function activateHamburgerMenu() {
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const navbar = document.querySelector('.navbar');
  hamburgerMenu.addEventListener("click", () => {
    navbar.classList.toggle("change")
  })
  hamburgerMenu.addEventListener("keyup", e => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      navbar.classList.toggle("change")
    }
  })
  hamburgerMenu.addEventListener("keydown", e => {
    if (e.key === " ") { e.preventDefault() }
  })
}
function activateMainAccounts() {
  const mainAccounts = document.querySelectorAll(".main--accounts__account");
  mainAccounts.forEach(account => {
    account.addEventListener("click", e => {
      const id = e.target.dataset.id;
      renderPage(id);
    }, true)
    account.addEventListener("keyup", e => {
      if (e.key === " " || e.key === "Enter") {
        const id = e.target.dataset.id;
        renderPage(id);
      }
    })
  })
}
function setBargraphWidths() {
  const bargraphs = document.querySelectorAll(".main--accounts__bargraph")
  if (bargraphs[0] === undefined) { return }
  const longBargraphWidth = bargraphs[0].offsetWidth ?? false;
  const longBargraphValue = Number(bargraphs[0].lastChild.innerText.slice(1));
  bargraphs.forEach(bargraph => {
    const body = document.querySelector("body");
    if (!longBargraphWidth
      || window.innerWidth < "500" 
      || (window.innerWidth > "675" && window.innerWidth < "860") 
      ) { 
        bargraph.classList = ['main--accounts__bargraph flex row wide100'];
    } else if (bargraph !== bargraphs[0]) {
      const bargraphValue = Number(bargraph.lastChild.innerText.slice(1));
      const bargraphPercent = Number((bargraphValue / longBargraphValue)*100).toFixed(0);
      if (bargraphPercent >= 70) { bargraph.classList.add("wide90"); }
      else if (bargraphPercent >= 50) { bargraph.classList.add("wide80"); }
      else if (bargraphPercent >= 30) { bargraph.classList.add("wide70"); }
      else { bargraph.classList.add("wide60"); }
    }
  });
}

function handleScreenSize() {
  const container = document.querySelector(".container")
  const useLargerScreen = document.querySelector("#use-larger-screen");
  if (window.innerWidth < "320") {
    container.classList.add("hidden")
    useLargerScreen.classList.remove("hidden")
  } else {
    useLargerScreen.classList.add("hidden")
    container.classList.remove("hidden");
  }
}

window.addEventListener("resize", () => {
  setBargraphWidths();
  handleScreenSize()
}) 
renderPage()
