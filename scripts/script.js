var countries;
var currentCountry;

async function loadCountries() {
  let response = await fetch("https://restcountries.com/v3.1/all");
  let data = await response.json();
  return data;
}

$(document).ready(async function () {
  countries = await loadCountries();
  currentCountry = countries[getRandomInt(countries.length)];

  document.getElementById("flagContainer").src = currentCountry.flags.png;
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


async function getRegion(){
  let region = currentCountry.region;
  return region;
}

async function setHint(){
  var currentRegion = await getRegion();
    document.getElementById("hintlbl").innerHTML= currentRegion ;


}
