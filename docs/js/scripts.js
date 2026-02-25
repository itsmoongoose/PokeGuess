// Defining Variables
const mainContainer = document.querySelector("#main-container");
const formContainer = document.querySelector("#form-container");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const submitBtn = document.querySelector("#submit-btn");
const generateBtn = document.querySelector("#generate-btn");
let errorParagraph = "";
let errContent;
let newDiv;
let guessDiv;
let outputDisplayed = false;
let words;
let capitalizedWords;
let pokemonName = "";
let hideName;
let correctGuessCount = 0;
let incorrectGuessCount = 0;
let announcement;

// Function -- Error Message
function errorMessage() {
    errorParagraph = document.createElement("p");
    errorParagraph.textContent = errContent;
    errorParagraph.classList.add("error-paragraph");
    formContainer.appendChild(errorParagraph);
}

// Function -- Clear Error Message
function clearError() {
    errorParagraph.textContent = "";
}

// Function -- Capitalize Letters
function capitalizeWords() {
    const lowerCaseArray = words.split(" ");
    const upperCaseArray = lowerCaseArray.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    capitalizedWords = upperCaseArray.join(" ");
}

// Function -- Generate Random Pokemon
function generatePokemon() {
    const randomNum = Math.floor(Math.random() * 1025) + 1;
    pokemonName = randomNum;
}

// Function -- Create and Calculate Stats
function displayStats() {

    // Hide generate button
    generateBtn.classList.add("hidden");

    // Create Elements -- stats
    const announceDiv = document.createElement("div");
    announceDiv.classList.add("announce-div");
    const announceH2 = document.createElement("h2");
    announceH2.textContent = announcement;
    announceH2.classList.add("announce-h2");
    const announceP = document.createElement("p");
    announceP.textContent = `This Pokemon is ${pokemonName}.`
    announceP.classList.add("announce-paragraph");
    const statsMessage = document.createElement("p");
    statsMessage.textContent = `Correct Guesses: ${correctGuessCount} — Incorrect Guesses: ${incorrectGuessCount}`;
    statsMessage.classList.add("announce-paragraph");

    // Calculate success rate percentage
    let successRate = (correctGuessCount / (correctGuessCount + incorrectGuessCount)) * 100;
    successRate = Math.round(successRate * 100) / 100; // roundes number to nearest hundredth
    const statsPercent = document.createElement("p");
    statsPercent.textContent = `Success Rate: ${successRate}%`;
    statsPercent.classList.add("announce-percent");

    // Create Element -- replay button
    const replayBtn = document.createElement("button");
    replayBtn.textContent = "Play Again";
    replayBtn.classList.add("replay-btn");

    // Event Listener -- replay button
    replayBtn.addEventListener("click", (event) => {
        generatePokemon();
        mainContainer.removeChild(announceDiv);
        fetchData();
    });

    // Display created elements on page
    announceDiv.appendChild(announceH2);
    announceDiv.appendChild(announceP);
    announceDiv.appendChild(statsMessage);
    announceDiv.appendChild(statsPercent);
    announceDiv.appendChild(replayBtn);
    mainContainer.appendChild(announceDiv);
}

// Function -- Create guessDiv
function createGuessDiv() {
    guessDiv = document.createElement("div");

    // Create Element -- guess form
    const guessForm = document.createElement("form");
    guessForm.id = "guess-form";
    guessForm.action = "#";
    guessForm.method = "GET";
    guessForm.classList.add("search-form");
    guessDiv.appendChild(guessForm);

    // Create Element -- input field
    const guessInputField = document.createElement("input");
    guessInputField.type = "text";
    guessInputField.placeholder = "Which Pokemon is this?";
    guessInputField.classList.add("search-input");
    guessForm.appendChild(guessInputField);

    // Create Element -- submit button
    const guessSubmitBtn = document.createElement("input");
    guessSubmitBtn.type = "submit";
    guessSubmitBtn.value = "Submit";
    guessSubmitBtn.classList.add("submit-btn");
    guessForm.appendChild(guessSubmitBtn);

    // Add created elements to page
    mainContainer.appendChild(guessDiv);

    // Event Listener for guessForm
    guessForm.addEventListener("submit", (event) => {
        event.preventDefault();
        let pokemonGuess = guessInputField.value.trim();
        pokemonGuess = pokemonGuess.toLowerCase();

        // Clear main container divs
        mainContainer.removeChild(newDiv);
        mainContainer.removeChild(guessDiv);

        // Create Elements -- correct guess
        if (pokemonGuess == pokemonName) {
            correctGuessCount += 1;
            announcement = "Correct!";
            displayStats();

        // Create Elements -- incorrect guess
        } else {
            incorrectGuessCount += 1;
            announcement = "Incorrect!";
            displayStats();
        }
    });
}

// Function -- Fetch API Data
function fetchData() {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`).then(response => {
        clearError();
        if (response.status >= 200 && response.status <= 299) {
            if (newDiv) {
                newDiv.innerHTML = "";
                // newDiv.classList.remove("small-size");
            } else {
                newDiv = document.createElement("div");
                newDiv.classList.add("output-container");
            }
            response = response.json().then(pokemonData => {
                generateBtn.classList.remove("hidden");
                pokemonName = pokemonData.name;

                // Pokemon Sprite
                const newImg = document.createElement("img");
                newImg.src = pokemonData.sprites.front_default;

                // If sprite is found
                if (newImg.src.includes("PokeAPI")) {
                    newImg.title = `A photo of ${pokemonData.name}`;
                    newImg.alt = `A photo of the pokemon named ${pokemonData.name}`;
                    newImg.classList.add("pokemon-img");
                    const newFigure = document.createElement("figure");
                    newFigure.appendChild(newImg);
                    newDiv.appendChild(newFigure);

                // If sprite is not found
                } else {
                    newImg.src = "img/pokeball.png";
                    newImg.classList.add("placeholder-img");
                    newImg.title = `A photo of a Poke Ball`;
                    newImg.alt = `A photo of a Poke Ball`;
                    const newFigure = document.createElement("figure");
                    const newFigCaption = document.createElement("figcaption");
                    newFigCaption.textContent = `Uh oh! The ${pokemonData.name} image did not load correctly. Have a Poke Ball instead!`
                    newFigure.appendChild(newImg);
                    newFigure.appendChild(newFigCaption);
                    newDiv.appendChild(newFigure);
                }

                // Pokemon Name
                if (hideName == false) {
                    const newH2 = document.createElement("h2");
                    const displayName = pokemonData.name.toUpperCase();
                    newH2.textContent = displayName;
                    newH2.classList.add("pokemon-name");
                    newDiv.appendChild(newH2);
                }

                // Pokemon Height
                const heightH3 = document.createElement("h3");
                let pokemonHeight = pokemonData.height / 10 // converts height from decimetres to meteres
                pokemonHeight = Math.round(pokemonHeight * 100) / 100; // rounds to nearest hundredth
                heightH3.textContent = `Height: ${pokemonHeight} m — `;
                heightH3.classList.add("pokemon-height");
                newDiv.appendChild(heightH3);

                // Pokemon Weight
                const weightH3 = document.createElement("h3");
                let pokemonWeight = pokemonData.weight / 4.356 // converts weight from hectograms to pounds
                pokemonWeight = Math.round(pokemonWeight * 100) / 100; // rounds to nearest hundredth
                weightH3.textContent = `Weight: ${pokemonWeight} lbs`;
                weightH3.classList.add("pokemon-weight");
                newDiv.appendChild(weightH3);

                // Pokemon Base Experience
                const newH4 = document.createElement("h4");
                newH4.textContent = `Base Experience: ${pokemonData.base_experience}`;
                newH4.classList.add("pokemon-experience");
                newDiv.appendChild(newH4);

                // Pokemon Abilities
                const abilitiesH4 = document.createElement("h4");
                abilitiesH4.textContent = "Abilities: ";
                abilitiesH4.classList.add("abilities-text");
                newDiv.appendChild(abilitiesH4);
                const abilitiesList = document.createElement("ul");
                pokemonAbilityMap = pokemonData.abilities.map(abilities => abilities.ability.name); // creating new array of pokemon abilites
                for (ability of pokemonAbilityMap) {
                    const abilityEdited = ability.replace(/-/g, " ");

                    // Capitalize first letter of each word
                    words = abilityEdited;
                    capitalizeWords();

                    // Add ability to page
                    const abilitiesItem = document.createElement("li");
                    abilitiesItem.textContent = capitalizedWords;
                    abilitiesList.appendChild(abilitiesItem);
                    newDiv.appendChild(abilitiesList);
                }

                // Pokemon Types
                const typesH4 = document.createElement("h4");
                typesH4.textContent = "Type(s): ";
                typesH4.classList.add("types-text");
                newDiv.appendChild(typesH4);
                pokemonTypeMap = pokemonData.types.map(type => type.type.name); // creating new array of pokemon types
                for (type of pokemonTypeMap) {
                    const typeDiv = document.createElement("div");
                    typeDiv.classList.add("type-container");

                    // Create and add type icon
                    const typeImg = document.createElement("img");
                    typeImg.classList.add("type-image");
                    typeImg.src = `img/${type}-icon.png`;
                    typeDiv.appendChild(typeImg);

                    // Capitalize first letter
                    words = type;
                    capitalizeWords();

                    // Create and add type text
                    const typeParagraph = document.createElement("p");
                    typeParagraph.textContent = capitalizedWords;
                    typeParagraph.classList.add("pokemon-type");
                    typeDiv.appendChild(typeParagraph);
                    newDiv.appendChild(typeDiv);
                }
                mainContainer.appendChild(newDiv);

                // Create div for guess input form
                if (hideName == true) {
                    createGuessDiv();
                }
                outputDisplayed = true;
            });

        // If Statement -- if pokemon name doesn't exist in API
        } else if (response.status == 404) {
            if (newDiv) {
                newDiv.classList.add("small-size");
            }
            errContent = `Please enter a valid Pokemon name to continue.`;
            errorMessage();

        // If Statement -- handles all other error codes
        } else {
            if (newDiv) {
                newDiv.classList.add("small-size");
            }
            errContent = `There was an error with status ${response.status}. Please refresh the page and try again.`;
            errorMessage();
        }
    });
}

// Event Listener -- search form
if (searchForm != null) {
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        pokemonName = searchInput.value.trim();
        searchInput.value = "";
        hideName = false;

        // If Statement -- if input is empty
        if (!pokemonName) {

            // If Statement -- if pokemon already displayed, change main container size for scrollbar/overflow
            if (outputDisplayed == true) {
                newDiv.classList.add("small-size");
            }
            if (errorParagraph) { // if errorParagraph already exists, clear it before creating another
                clearError();
            }
            errContent = "Input must include at least one non-whitespace character.";
            errorMessage();
        } else {
            fetchData();
        };
    });
}

// Event Listener -- generate button
if (generateBtn != null) {
    generateBtn.addEventListener("click", (event) => {
        generatePokemon();
        hideName = true;
        if (guessDiv != null) { // checks if guess div is already displayed; removes if true
            mainContainer.removeChild(guessDiv);
        }
        fetchData();
    });
}