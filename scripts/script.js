var countries;
var currentCountry;
var guessesLeft;
var hints = [];
var score = 0;
var streak = 0;
var called = false;
var called1 = false;
var called2 = false;
var called3 = false;

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
  minusHintPoint();
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
      called = true;
      break;
    case 1:
      hints.push(" first letter: " + (await getFirstLetter()));
      called1 = true;
      break;
    case 2:
      hints.push(" subregion: " + (await getSubregion()));
      called2 = true;
      break;
    case 3:
      hints.push(" short form: " + (await getShortForm()));
      called3 = true;
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

function minusHintPoint(){
  if(called == true){
    score = score - 50;
    called = false;
  }
  if(called1 == true){
    score = score - 50;
    called = false;
  }
  if(called2 == true){
    score = score - 50;
    called = false;
  }
  if(called3 == true){
    score = score - 50;
    called = false;
  }

}