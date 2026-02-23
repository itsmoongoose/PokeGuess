// Defining Variables
const mainContainer = document.querySelector("#main-container");
const formContainer = document.querySelector("#form-container");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const submitBtn = document.querySelector("#submit-btn");
let errorParagraph = "";
let errContent;
let newDiv;
let outputDisplayed = false;
let words;
let capitalizedWords;

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

// Event Listener -- search form
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const pokemonName = searchInput.value.trim();
    searchInput.value = "";

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

        // Fetch data
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`).then(response => {
            clearError();
            if (response.status >= 200 && response.status <= 299) {
                if (newDiv) {
                    newDiv.innerHTML = "";
                    newDiv.classList.remove("small-size");
                } else {
                    newDiv = document.createElement("div");
                    newDiv.classList.add("output-container");
                }
                response = response.json().then(pokemonData => {

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
                    const newH2 = document.createElement("h2");
                    const displayName = pokemonData.name.toUpperCase();
                    newH2.textContent = displayName;
                    newH2.classList.add("pokemon-name");
                    newDiv.appendChild(newH2);

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
    };
});