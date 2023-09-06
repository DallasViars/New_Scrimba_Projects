import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, set, get, child} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = { databaseURL: "https://endorsements-85a19-default-rtdb.firebaseio.com/" }
const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsList = ref(database, "endorsements")

const mainEl = document.querySelector("main");
const inputsEl = document.querySelector(".inputs-area");
const endorsementsAreaEl = document.querySelector(".endorsements-area");
const inputTextarea = document.querySelector(".input-textarea");
const inputFrom = document.querySelector(".input-from");
const inputTo = document.querySelector(".input-to");
const inputBtn = document.querySelector(".input-btn");

const welcomeMessageID = "-NUy5YmyKWBxrnFnekaJ"

function getEndorsementInfo() {
    const endorsement = inputTextarea.value;
    const endorsementFrom = inputFrom.value ? inputFrom.value : "Anonymous";
    const endorsementTo = inputTo.value ? inputFrom.value : "Anonymous";
    const endorsementTime = new Date().toString(); //Firebase would not store the Date info without it being converted to a String first
    return { endorsement, endorsementTime, endorsementFrom, endorsementTo, likes: 0 }
}
inputBtn.addEventListener("click", addEndorsementToDB); 

function addEndorsementToDB() {
    const item = getEndorsementInfo();
    if (!item.endorsement) {
        inputTextarea.setAttribute("placeholder", "Endorsement message may not be left blank.")
        inputTextarea.classList.add("error-msg");
        inputTextarea.addEventListener("keyup", () => {
            if (inputTextarea.value) {
                inputTextarea.classList.remove("error-msg");
                inputTextarea.setAttribute("placeholder", "Write your endorsement here");
            }
        })
        return;
    };
    push(endorsementsList, item);
    clearInputFields();
    inputTextarea.focus();
}

function clearInputFields() {
    inputTextarea.value = "";
    inputFrom.value = "";
    inputTo.value = "";
}

onValue(endorsementsList, function(snapshot){
    if (snapshot.exists()) {
        endorsementsAreaEl.innerHTML = "";
        let index = 6;
        for (let item of Object.entries(snapshot.val())) {
            const [DBID, endorsementInfo] = item;
            publishEndorsement(DBID, endorsementInfo, index)
            index++;
        }   
    } else {
        endorsementsAreaEl.innerHTML = "No endorsements just yet..."
    }
})

function getEndorsementHTML(item) {
    const { endorsement, endorsementTime, endorsementTo, endorsementFrom, likes } = item;
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const time = new Date(endorsementTime).toLocaleTimeString("en-us", options).replace(/(\d{4}),/, `$1 @ `).replace(/(\d{1,2}:\d{1,2}):\d{1,2}/, ` $1`)
    return `
        <p class="endorsement-to bold">To: ${endorsementTo}</p>
        <p class="endorsement-time">${time}</p>
        <p class="endorsement-message">${endorsement}</p>
        <p class="endorsement-from bold">From: ${endorsementFrom}</p>   
        <p class="likes">❤️ ${likes}</p>`
}

function publishEndorsement(DBID, endorsementInfo, index) {
    const html = getEndorsementHTML(endorsementInfo);
    const endorsementEl = document.createElement("div");
    endorsementEl.setAttribute("tabindex", index)
    endorsementEl.innerHTML = html;
    if (DBID === welcomeMessageID) {
        endorsementEl.style.order = "-1"; //This ensures that the welcome message is always the first message displayed
    }
    endorsementsAreaEl.prepend(endorsementEl);
    endorsementEl.classList.add("endorsement");
    
    //Prevents the right-click context menu from being accessed in an endorsement element
    endorsementEl.addEventListener("contextmenu", e => e.preventDefault());

    //Event listeners for deleting endorsements
    endorsementEl.addEventListener("dblclick", () => removeEndorsement(DBID, endorsementEl))
    endorsementEl.addEventListener("keyup", (e) => {
        if (e.key === " ") { 
            removeEndorsement(DBID, endorsementEl)
         } 
    })
    
    //Event listener for adding/removing likes
    endorsementEl.lastChild.addEventListener("mousedown", () => {
        const primaryMouseBtn = 1; //used to increment likes
        const secondaryMouseBtn = 2; //used to decrement likes
        if (event.buttons === primaryMouseBtn) {
            updateLikes(DBID, endorsementInfo, 1)
        }
        if (event.buttons === secondaryMouseBtn) {
            updateLikes(DBID, endorsementInfo, 0)
        }
   })
}

function removeEndorsement(DBID, endorsementEl) {
    // const welcomeMessageID = "-NUy5YmyKWBxrnFnekaJ"
    if (Object.values(endorsementEl.lastChild.classList).includes("modal")) return;
    if (DBID === welcomeMessageID) {
        alert("Sorry, but this one may not be deleted.")
        return;
    }
    const modal = document.createElement("div");
    modal.classList.add("modal")
    modal.innerHTML = `
        <p>Are you sure you wish to delete this endorsement?</p>
        <button class="btn modal-btn modal-btn-cancel">CANCEL</button>
        <button class="btn modal-btn modal-btn-delete">DELETE</button>
    `
    endorsementEl.append(modal);
    const modalBtns = document.querySelectorAll(".modal-btn")
    modalBtns.forEach(button => {
        button.addEventListener("click", function() {
            if (button.textContent === "DELETE") {
                const exactLocationInDB = ref(database, `endorsements/${DBID}`) 
                remove(exactLocationInDB);
            } else {
                modal.remove();
            }
        })
    })
    document.querySelector(".modal-btn-cancel").focus();
    
}

function updateLikes(DBID, endorsementInfo, add) {
    let userLikesData = JSON.parse(localStorage.getItem("userLikes")) ?? [];
    const index = userLikesData.indexOf(DBID)

    if (add && index >= 0) { return; } //User has already liked endorsement and tried to like it again
    if (!add && index < 0) { return; } //User has not already liked endorsement and tried to remove a like
    if (index < 0) {
        userLikesData.push(DBID);
    } else {
        userLikesData.splice(index, 1);
    }

    //Adding or removing a session like to userLikesData
    const dbRef = ref(getDatabase())
    const updateEndorsementLikes = get(child(dbRef, `endorsements/${DBID}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const { likes } = snapshot.val();
            const db = getDatabase();
            set(ref(db, `endorsements/${DBID}`), 
                {...snapshot.val(), likes: add ? likes + 1 : likes <= 1 ? 0 : likes-1}
            )
        }
    })
    localStorage.setItem("userLikes", JSON.stringify(userLikesData));
}
