var countries;
var currentCountry;
var guessesLeft;
var hints = [];
var score = 0;
var streak = 0;

async function loadCountries() {
  let response = await fetch("https://restcountries.com/v3.1/all");
  let data = await response.json();
  return data;
}

$(document).ready(async function () {
  startGame();
});

async function startGame() {
  guessesLeft = 5;
  hints.length = 0;
  resetLabels();

  countries = await loadCountries(); // doesn't need to be called on new game tho ...
  currentCountry = countries[getRandomInt(countries.length)]; // loads new country

  document.getElementById("flagContainer").src = currentCountry.flags.png;
  document.getElementById("scoreLbl").innerHTML = "Score: " + score;
  console.log(currentCountry.name.common);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function guess() {
  let userGuess = document.querySelector("#userInput").value.toLowerCase();
  if (
    userGuess == currentCountry.name.common.toLowerCase() ||
    userGuess == currentCountry.name.official.toLowerCase()
  ) {
    countryGuessed();
  } else if (guessesLeft == 1) {
    allGuessesUsed();
    streak = 0;
    score = 0;
  }
  else {
    guessesLeft--;
    document.getElementById("guessesLeftLbl").innerHTML =
      "guesses left: " + guessesLeft;
  }
  document.getElementById("userInput").value = "";
}

function countryGuessed() {
  alert(
    "congratulations! you guessed the country with " +
    guessesLeft +
    " guesses left."
  );

  score = score + 100 * (guessesLeft + streak);
  streak++;

  startGame();
}

function allGuessesUsed() {
  alert("all your guesses used, new game started");
  startGame();
}

async function newHint() {
  switch (hints.length) {
    case 0:
      hints.push("region: " + (await getRegion()));
      break;
    case 1:
      hints.push(" first letter: " + (await getFirstLetter()));
      break;
    case 2:
      hints.push(" subregion: " + (await getSubregion()));
      break;
    case 3:
      hints.push(" short form: " + (await getShortForm()));
      break;
  }
  document.getElementById("hintOutput").innerHTML = hints;
}

function fillCorrCountry(){
  document.getElementById("userInput").value = currentCountry.name.common;
}

// hints
async function getRegion() {
  return currentCountry.region;
}

async function getFirstLetter() {
  return currentCountry.name.common.charAt(0).toUpperCase();
}

async function getSubregion() {
  return currentCountry.subregion;
}

async function getShortForm(){
  return currentCountry.cioc;
}

function resetLabels() {
  document.getElementById("userInput").value = "";
  document.getElementById("guessesLeftLbl").innerHTML =
    "guesses left: " + guessesLeft;
  document.getElementById("hintOutput").value = "";
  document.getElementById("hintOutput").innerHTML = hints;
}
