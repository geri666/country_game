var countries;
var currentCountry;
var guessesLeft;

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
  document.getElementById("userInput").value = "";

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

  if (userGuess == currentCountry.name.common.toLowerCase()) {
    countryGuessed();
  } else {
    guessesLeft--;
  }
  document.getElementById("userInput").value = "";
}

function countryGuessed(){
    console.log("congratulations! you guessed the country with " + guessesLeft + " guesses left.");
    startGame();

}

async function getRegion(){
  let region = currentCountry.region;
  return region;
}

async function setHint(){
  var currentRegion = await getRegion();
    document.getElementById("hintlbl").innerHTML= currentRegion();

}

