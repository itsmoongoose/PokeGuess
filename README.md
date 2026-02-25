## __PokeGuess__
### __Project Description__
__*Scope and Functionality*__ - This website has 2 main features, both of which fetch data from a [public Pokemon API](https://pokeapi.co/) and display the result on the page:

__1. Pokemon Guessing Game__\
When the generate button is pressed, a random Pokemon will "spawn" and be displayed to the page. The object of the game is for the player to correctly guess the Pokemon. Though its name will be hidden, the following characteristics will be displayed to help the player narrow down their guess:
- Character Sprite
- Height
- Weight
- Base Experience
- Abilities
- Type Name(s) and Icon(s)

Once the player submits their guess, they will be shown the stats screen which displays whether their guess was correct or incorrect as well as a summary of their previous guesses.

Stats are reset each session; refreshing the page or viewing the Pokedex will clear any saved stats.

__2. Pokedex/Pokemon Dictionary__\
This page can be used to search a Pokemon by name. When the user enters a valid Pokemon name, the following will be displayed:
- Pokemon Name
- Character Sprite
- Height
- Weight
- Base Experience
- Abilities
- Type Name(s) and Icon(s)

__*Motivation*__ - This program allows me to demonstrate my knowledge of asynchronous programming with JavaScript and using API's.

### __Technology Stack__
- [PokeAPI](https://pokeapi.co/)
- git 2.49.0.windows.1
- GitHub
- Visual Studio Code

### __Known Bugs and Planned Features__
__*Bugs*__
- __ERR-GAM-001__ - Uncaught NotFoundError when the generate button is clicked back to back -- program should generate and display a new pokemon
- __ERR-DEX-001__ - Uncaught NotFoundError when searching the name of a Pokemon the second time -- program should remove the old Pokemon and display the newly searched one

__*Planned Features*__
- __FEAT-NEC-001__ - Optimize CSS styling for phone screens and tablet screens

### __Installation and Setup__

To view this website, just click [here](https://itsmoongoose.github.io/PokeGuess/).