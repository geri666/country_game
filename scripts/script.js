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
const MAPS_URL = "https://www.google.ch/maps/place/";
var myModal = document.getElementById("myModal");

$(document).ready(async function () {
  countries = await loadCountries();
  startGame();
});

async function loadCountries() {
  let response = await fetch("https://restcountries.com/v3.1/all");
  let data = await response.json();
  return data;
}

async function startGame() {
  guessesLeft = 5;
  hints.length = 0;
  resetLabels();

  currentCountry = countries[getRandomInt(countries.length)];
  minusHintPoint();
  document.getElementById("flagContainer").src = currentCountry.flags.svg; // ty wiz you're the best
  document.getElementById("scoreLbl").innerHTML = "score: " + score;
}

function handleUserGuess() {
  let userGuess = document.querySelector("#userInput").value.toLowerCase();
  if (
    userGuess == currentCountry.name.common.toLowerCase() ||
    userGuess == currentCountry.name.official.toLowerCase()
  ) {
    countryGuessed();
  } else if (guessesLeft == 1) {
    allGuessesUsed();
  } else {
    decreaseGuessesByOne();
  }
  document.getElementById("userInput").value = "";
}

function countryGuessed() {
  document.getElementById("afterGameTitle").innerHTML = "country guessed!";
  document.getElementById("afterGameMain").innerHTML =
    "it took you " +
    guessesLeft +
    " guesses to guess " +
    currentCountry.name.common.toLowerCase();
  document.getElementById("afterGameMain").innerHTML +=
    " <br> open with google maps:<br>" +
    "<a id='linkButBlack' href ='https://www.google.ch/maps/place/" +
    currentCountry.name.common +
    "' target='_blank'>https://www.google.ch/maps/place/" +
    currentCountry.name.common +
    "<a>";
  $("#myModal").modal("show");
  score = score + 100 * (guessesLeft + streak);
  streak++;
  startGame();
}

function allGuessesUsed() {
  streak = 0;
  score = 0;
  document.getElementById("afterGameTitle").innerHTML =
    "aw! you'll get it next time";
  document.getElementById("afterGameMain").innerHTML =
    "the country was " + currentCountry.name.common.toLowerCase();
  document.getElementById("afterGameMain").innerHTML +=
    " <br> open with google maps:<br>" +
    "<a id='linkButBlack' href ='https://www.google.ch/maps/place/" +
    currentCountry.name.common +
    "' target='_blank'>https://www.google.ch/maps/place/" +
    currentCountry.name.common +
    "<a>";
  $("#myModal").modal("show");
  startGame();
}

function decreaseGuessesByOne() {
  guessesLeft--;
  document.getElementById("guessesLeftLbl").innerHTML =
    "guesses left: " + guessesLeft;
}

async function newHint() { // maybe we can do this more efficiently we'll see idk
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

function fillCorrCountry() {
  document.getElementById("userInput").value = currentCountry.name.common;
}

function loadModalImage() {
  document.getElementById("modalImg").src = currentCountry.flags.svg;
}

async function getRegion() {
  return currentCountry.region;
}

async function getFirstLetter() {
  return currentCountry.name.common.charAt(0).toUpperCase();
}

async function getSubregion() {
  return currentCountry.subregion;
}

async function getShortForm() {
  return currentCountry.cioc;
}

function resetLabels() {
  document.getElementById("userInput").value = "";
  document.getElementById("guessesLeftLbl").innerHTML =
    "guesses left: " + guessesLeft;
  document.getElementById("hintOutput").value = "";
  document.getElementById("hintOutput").innerHTML = hints;
}

function minusHintPoint() {
  if (called == true) {
    score = score - 50;
    called = false;
  }
  if (called1 == true) {
    score = score - 50;
    called = false;
  }
  if (called2 == true) {
    score = score - 50;
    called = false;
  }
  if (called3 == true) {
    score = score - 50;
    called = false;
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
