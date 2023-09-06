const posts = [
    {
        name: "Vincent van Gogh",
        username: "vincey1853",
        location: "Zundert, Netherlands",
        avatar: "images/avatar-vangogh.jpg",
        post: "images/post-vangogh.jpg",
        comment: "just took a few mushrooms lol",
        likes: 21,
        isLiked: false
    },
    {
        name: "Gustave Courbet",
        username: "gus1819",
        location: "Ornans, France",
        avatar: "images/avatar-courbet.jpg",
        post: "images/post-courbet.jpg",
        comment: "i'm feelin a bit stressed tbh",
        likes: 4,
        isLiked: false
    },
        {
        name: "Joseph Ducreux",
        username: "jd1735",
        location: "Paris, France",
        avatar: "images/avatar-ducreux.jpg",
        post: "images/post-ducreux.jpg",
        comment: "gm friends! which coin are YOU stacking up today?? post below and WAGMI!",
        likes: 152,
        isLiked: false
    }
]
const mainEl = document.querySelector("main");

function getPostInfoHTML(post, index) {
    const {name, username, location, avatar, post: postImg, comment, likes} = post;
    return `
        <div class="post-info flex">
            <img class="img-resp img-avatar" src="${avatar}" alt="" />
            <div class="flex col center-v">
                <h2 class="text-bold">${name}</h2>
                <p>${location}</p>
            </div>
        </div>
        <div class="post-img">
            <img class="img-resp" src="${postImg}" alt="" data-index="${index}"/>
        </div>
        <div class="post-likes">
            <div class="post-likes-icons flex space-between">
                <img class="img-resp icon" src="images/icon-heart.png" alt="heart icon to like the post" data-type="like" data-index="${index}"/>
                <img class="img-resp icon" src="images/icon-comment.png" alt="dialogue bubble to leave a comment on the post" data-type="comment" data-index="${index}"/>
                <img class="img-resp icon" src="images/icon-dm.png" alt="paper airplane icon to send a direct message" data-type="message" data-index="${index}"/>
            </div>
            <p class="post-likes-count text-bold">${likes} likes</p>
        </div>
        <div class="post-comments">
            <p><span class="text-bold">${username}</span class="text-bold"> ${comment}</p>
        </div>
    `
}
function renderHTML() {
    mainEl.innerHTML = ""
    posts.forEach(function(post, index) {
        const section = document.createElement("section");
        section.classList.add("post-container")
        section.setAttribute("data-index", index)
        section.innerHTML = getPostInfoHTML(post, index)
        mainEl.append(section);
    })
    const likes = document.querySelectorAll('[data-type="like"]')
    likes.forEach(like => {
        like.addEventListener("dblclick", function() {
            handleLike(event, "add")
        })
        like.addEventListener("mousedown", function() {
            if (event.shiftKey) {
                handleLike(event, "subtract")
            }
        })
    })
    const comments = document.querySelectorAll('[data-type="comment"]')
    comments.forEach(comment => {
        comment.addEventListener("click", () => alert("This is just a placeholder for this project"), false);
    })
    const messages = document.querySelectorAll(`[data-type="message"]`)
    messages.forEach(message => {
      message.addEventListener("click", () => alert("This is just a placeholder for this project"), false)  
    })
    const allPostsImages = document.querySelectorAll(".post-img");
    allPostsImages.forEach(post => {
        post.addEventListener("dblclick", function() {
            handleLike(event, "add")
        })
        post.addEventListener("mousedown", function() {
            if (event.shiftKey) {
                handleLike(event, "subtract")
            }
        })
        post.addEventListener("", function() {})
    })
}
function handleLike(event, operation) {
    const index = event.target.dataset.index;
    let likes = posts[index].likes;
    if (operation === "add" && !posts[index].isLiked) {
        ++posts[index].likes;
        renderHTML();
        posts[index].isLiked = !posts[index].isLiked
    }
    if (operation === "subtract" && posts[index].isLiked) {
        --posts[index].likes;
        renderHTML();
        posts[index].isLiked = !posts[index].isLiked
    }
    
}
function handleComment() {
    
}
renderHTML()

/*
<section class="post-container">
    <div class="post-info flex">
        <img class="img-resp img-avatar" src="images/avatar-vangogh.jpg" alt="Van Gogh's youthful selfie" />
        <div class="flex col center-v">
            <h2>Vincent Van Gogh</h2>
            <p>Zudert, Netherlands</p>
        </div>
    </div>
    <div class="post-img">
        <img class="img-resp" src="images/post-vangogh.jpg" alt="Van Gogh's dour selfie" />
    </div>
    <div class="post-likes">
        <div class="post-likes-icons flex space-between">
            <img class="img-resp icon" src="images/icon-heart.png" alt="heart icon to like the post" />
            <img class="img-resp icon" src="images/icon-comment.png" alt="dialogue bubble to leave a comment on the post" />
            <img class="img-resp icon" src="images/icon-dm.png" alt="paper airplane icon to send a direct message" />
        </div>
        <p class="post-likes-count text-bold">21 likes</p>
    </div>
    <div class="post-comments">
        <p><span class="text-bold">vincey1853</span class="text-bold"> just took a few mushrooms lol</p>
    </div>
</section>
*/