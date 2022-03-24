async function loadCountries() {
  let response = await fetch("https://restcountries.com/v3.1/all");
  let data = await response.json();
  return data;
}

$(document).ready(function () {
    let countries = loadCountries();
    console.log(countries);
});
