var countries;
var currentCountry;
var guessesLeft;
var score = 0;

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
  resetLabels();

  countries = await loadCountries(); // doesn't need to be called on new game tho ...
  currentCountry = countries[getRandomInt(countries.length)]; // loads new country

  document.getElementById("flagContainer").src = currentCountry.flags.png;
  console.log(currentCountry.name.common);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function guess() {
  let userGuess = document.querySelector("#userInput").value.toLowerCase();
  guessesLeft--;
  document.getElementById("guessesLeftLbl").innerHTML =
    "guesses left: " + guessesLeft;
  if (userGuess == currentCountry.name.common.toLowerCase()) {
    countryGuessed();
  } else if (guessesLeft == 0) {
    allGuessesUsed();
  }
  document.getElementById("userInput").value = "";
}

function countryGuessed() {
  alert(
    "congratulations! you guessed the country with " +
    guessesLeft +
    " guesses left."
  );
  
  score = score + 100 * (guessesLeft + 1);
  
  startGame();
}

function allGuessesUsed() {
  alert("all your guesses used, new game started");
  startGame();
}

async function getRegion() {
  let region = currentCountry.region;
  return region;
}

async function setHint() {
  var currentRegion = await getRegion();
  document.getElementById("hintlbl").innerHTML = "Region: " + currentRegion;
}

async function set2ndHint() {
  let name = currentCountry.name.common;
  document.getElementById("hintlbl2").innerHTML =
    "First letter: " + name.charAt(0);
}

function resetLabels() {
  document.getElementById("userInput").value = "";
  document.getElementById("guessesLeftLbl").innerHTML =
    "guesses left: " + guessesLeft;
  document.getElementById("hintlbl").innerHTML = "";
  document.getElementById("hintlbl2").innerHTML = "";
}
