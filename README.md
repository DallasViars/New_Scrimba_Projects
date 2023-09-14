# Scrimba Projects

[Scrimba](https://www.scrimba.com/) is a learning platform that teaches Front End Web Development, among other things. The thing that sets it apart from the myriad other learning platforms out there is the ability to pause the instructional video and manipulate the code that is being taught so you can write code, see how it works in the mini-browser, save your work, then unpause and finish the lesson. In its Career Path there are a number of solo projects designed to put the skills taught in the lessons to the test. Each solo project gives you a design on Figma along with the objectives of the project. From there you are on your own to bring the project to life.

This is a repo containing the Scrimba Solo Projects I've done. I utilize a mobile-first approach for most projects prioritizing resposive design to ensure that users are able to use these projects regardless of which device they use. Additionally, I utilize tools such as the WAVE Evaluation tool, taba11y, NVDA screen reader, and Lighthouse to ensure each project's core functionality is available to users regardless of any limitations they may have.

<details>
  <summary>Movie Watchlist</summary>
  
  - [Movie Watchlist](https://dallasviars.github.io/New_Scrimba_Projects/Movie-Watchlist/)
  
  ### Project requirements: 
  - Contain two pages
    - index.html
      - Search page
      - Calls the OMDB API using title search
      - Displays search results 
    - watchlist.html
      - Displays movie data for movies saved using an "Add to watchlist" button
    - Button to "add to watchlist" to save data to local storage
  
  ### Skills used:
  - Asynchronous promises
  - Async / await
  - Multiple fetches from API
  - Error handling
  - Object destructuring
  - Nullish coalescing operator
  - HTML, CSS, and Javascript
  - Snackbar / Toast
  - Toggle Darkmode
  - localStorage & sessionStorage
  - Exporting Javascript as a Namespace
  - Testing through Accessibility tools such as the WAVE Evaluation Tool, taba11y, the NVDA screen reader, and Lighthouse
  
  ### Notes, thoughts, and methodology:

This was such a fun and educational project to work on. I really enjoyed reading through the API documentation and testing its functionality. Some of the things I learned while working on this project are: 

- Use of nullish coalescing operator: I had run into trouble with the saved watchlist trying to assign value to the currentWatchlist variable when the localStorage "watchlist" item didn't exist. Using the NCO here allowed me to account for the possibility of nullish values and offer an alternative value to the variable.
- Use of a Snackbar / Toast to convey unobtrusive information to the user

If I were to do this project again in the future I would explore the use of Partial Application Use to make the fetch calls more reusable.
  
</details>

<details>
  <summary> Color Scheme Generator </summary>
  
  - [Color Scheme Generator](https://dallasviars.github.io/New_Scrimba_Projects/Color-Scheme-Generator/)
  
  #### Project requirements: 
  - Use an `<input type="color">` element
  - Use `<select>` to choose a color scheme
  - Use fetch to retrieve color information from an API
  - Initiate the fetch by clicking a button
  - Display the scheme colors and hex values
  - Extra credit:
    - Display color name
    - Enable one-click copy for the hex value
  
  #### Skills used:
  - HTML, CSS, and Javascript
  - Asynchronous promises
  - Fetch data from an API
  - Use of ternary operator
  - Testing through Accessibility tools such as the WAVE Evaluation Tool, taba11y, the NVDA screen reader, and Lighthouse
  
  #### Notes, thoughts, and methodology:
The Color Scheme Generator project was a fun exercise in accessing an API using user-selected information. This project saw my first implementation of a Dark mode toggle.

My next updates on this project will be:
- Updating to use async/await
- Update copy notification to use a Snackbar instead of the .alert() method
- Update to use React

</details>

<details>
  <summary>Other projects</summary>

  - [We Are the Champions](https://dallasviars.github.io/New_Scrimba_Projects/We-Are-The-Champions/)
     - An app using Firebase designed to allow you to cheer on your friends and colleagues by leaving notes celebrating their work.
  - [Tindog](https://dallasviars.github.io/New_Scrimba_Projects/Tindog/)
     - A Tinder clone for finding animal friends for your pets!
     - I've never used Tinder and since the Figma design only had a mobile layout I created a wider-screen option.
     - When I revisit this project I plan to use React and also implement sidebars listing the accepted/rejected matches
  - [Oldagram](https://dallasviars.github.io/New_Scrimba_Projects/Oldagram/)
       - An Instagram clone
       - Double clicking the main image or the heart icon increases the like count, Shift+click reduces the like count
  - [Learning Journal](https://dallasviars.github.io/New_Scrimba_Projects/Learning-Journal/)
       - An online journaling site demo
  - [Best Bank](https://dallasviars.github.io/New_Scrimba_Projects/Best-Bank/)
       - A simple Banking page
       - When I revisit this project I plan to add functionality to create transactions for the accounts

</details>

















