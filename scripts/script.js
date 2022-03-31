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
var countriesArr = [];
const countryListElement = document.querySelector("#country-list");
const countryInputElement = document.querySelector("#userInput");
const MAPS_URL = "https://www.google.ch/maps/place/";
var myModal = document.getElementById("myModal");

$(document).ready(async function () {
  countries = await loadCountries();
  loadAutocomplete();
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
  document.getElementById("flagContainer").src = currentCountry.flags.svg;
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
  /*
    document.getElementById("afterGameMain").innerHTML +=
    " <br> open with google maps:<br>" +
    "<a id='linkButBlack' href ='https://www.google.ch/maps/place/" +
    currentCountry.name.common +
    "' target='_blank'>https://www.google.ch/maps/place/" +
    currentCountry.name.common +
    "<a>"; 
    */
  $("#myModal").modal("show");
  score = score + 100 * (guessesLeft + streak);
  streak++;
  showMap();
  startGame();
}

function allGuessesUsed() {
  streak = 0;
  score = 0;
  document.getElementById("afterGameTitle").innerHTML =
    "aw! you'll get it next time";
  document.getElementById("afterGameMain").innerHTML =
    "the country was " + currentCountry.name.common.toLowerCase();
  /*
    document.getElementById("afterGameMain").innerHTML +=
    " <br> open with google maps:<br>" +
    "<a id='linkButBlack' href ='https://www.google.ch/maps/place/" +
    currentCountry.name.common +
    "' target='_blank'>https://www.google.ch/maps/place/" +
    currentCountry.name.common +
    "<a>";
    */
  $("#myModal").modal("show");
  showMap();
  startGame();
}

function decreaseGuessesByOne() {
  guessesLeft--;
  document.getElementById("guessesLeftLbl").innerHTML =
    "guesses left: " + guessesLeft;
}

async function newHint() {
  // maybe we can do this more efficiently we'll see idk
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

function showMap() {
  // ty! https://stackoverflow.com/a/36801105
  var country = currentCountry.name.common;
  var embed =
    "<iframe width='300' height='400px' frameborder='0'scrolling='no' marginheight='0' marginwidth='0'src='https://maps.google.com/maps?&amp;q=" +
    encodeURIComponent(country) +
    "&amp;output=embed'></iframe>";

  $("#place").html(embed);
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


function loadAutocomplete() {
  fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then((data) => {
      countriesArr = data.map((x) => x.name.common);
      countriesArr.sort();
      loadList(countriesArr, countryListElement);
      fillTextField();
    });
}

function loadList(data, element) {
  if (data) {
    element.innerHTML = "";
    let innerElement = "";
    data.forEach((item) => {
      innerElement += `
        <li>${item}</li>
        `;
    });
    element.innerHTML = innerElement;
  }

}


function filterList(data, inputText) {
  return data.filter((x) => x.toLowerCase().includes(inputText.toLowerCase()));

}

countryInputElement.addEventListener("input", function () {
  const filteredData = filterList(countriesArr, countryInputElement.value);
  loadList(filteredData, countryListElement);
});


function fillTextField() {
  $('#country-list').click(function () {
    var listItems = document.querySelectorAll("ul li");

    listItems.forEach(function (item) {
      item.onclick = function (e) {
        document.getElementById("userInput").value = this.innerText;
      }
    });
  });
}
