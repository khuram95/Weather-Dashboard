// JavaScript file for Thomas' Weather Dashboard
// Varsity Tutor Session: Suggested approach to handle the array...

// Get references to HTML elements using their IDs
var inputEl = document.getElementById("search-input");
var buttonEl = document.getElementById("search-button");
var cityNameEl = document.getElementById("cityname");
var cityHistoryEl = document.getElementById("city-history");

var indexes = [0, 7, 15, 23, 31, 39];

// Set up arrays of references to HTML elements
var cityDayEls = [
  document.getElementById("cityday"),
  document.getElementById("cityday1"),
  document.getElementById("cityday2"),
  document.getElementById("cityday3"),
  document.getElementById("cityday4"),
  document.getElementById("cityday5"),
];

var temperatureEls = [
  document.getElementById("temp"),
  document.getElementById("temp1"),
  document.getElementById("temp2"),
  document.getElementById("temp3"),
  document.getElementById("temp4"),
  document.getElementById("temp5"),
];

var humidityEls = [
  document.getElementById("humid"),
  document.getElementById("humid1"),
  document.getElementById("humid2"),
  document.getElementById("humid3"),
  document.getElementById("humid4"),
  document.getElementById("humid5"),
];

var windSpeedEls = [
  document.getElementById("wind"),
  document.getElementById("wind1"),
  document.getElementById("wind2"),
  document.getElementById("wind3"),
  document.getElementById("wind4"),
  document.getElementById("wind5"),
];

var weatherIconEls = [
  document.getElementById("weather-icon"),
  document.getElementById("weather-icon1"),
  document.getElementById("weather-icon2"),
  document.getElementById("weather-icon3"),
  document.getElementById("weather-icon4"),
  document.getElementById("weather-icon5"),
];

// Get reference to HTML element where weather information will be displayed
var weatherDisplayEl = document.getElementById("displayweather");
var weatherIconEl = document.getElementById("weather-icon");

// Set API key and initialize empty arrays for cities, city history, and weather data
var apiKey = "4019261bd78cd50daccdfd0a8e4719ed";
var cities = [];
var cityHistory = [];
var temperatures = [6];
var humidities = [6];
var winds = [6];
var dates = [6];

// Function to get the latitude and longitude for a given city
function getLocation(city) {
  console.log("hello");
  var locationUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&appid=" +
    apiKey;
  // Fetch data from the API and return a JSON object
  fetch(locationUrl)
    .then(function (data) {
      return data.json();
    })
    .then(function (data) {
      console.log(data);
      console.log(data[0]);
      console.log(data[0].name);
      var lat = data[0].lat;
      var lon = data[0].lon;
      getWeather(lat, lon);
    });
}

// Function to get the weather data for a given latitude and longitude
function getWeather(lat, lon) {
  var weatherUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=metric" +
    "&lang=english" +
    "&appid=" +
    apiKey;
  fetch(weatherUrl)
    .then(function (data) {
      return data.json();
    })
    .then(function (data) {
      console.log(data);
      displayWeather(data);
    });
}

// Function to display weather data
function displayWeather(data) {
  console.log(data);
  // Extract the relevant weather data from the API response
  var city = data.city.name;
  cityHistoryEl.textContent = "";

  // Loop through the first 6 items in the API response and extract the temperature, humidity, wind speed, and date
  for (let i = 0; i < 6; i++) {
    temperatures[i] = data.list[indexes[i]].main.temp;
    humidities[i] = data.list[indexes[i]].main.humidity;
    winds[i] = data.list[indexes[i]].wind.speed;
    dates[i] = new Date(data.list[indexes[i]].dt * 1000);
  }

  // Add the first 5 items in the API response to the "cities" array
  for (let i = 0; i < 5; i++) {
    cities.push(data.list[i]);
  }

  // Update the DOM elements with the relevant weather data
  for (let j = 0; j < 6; j++) {
    temperatureEls[j].textContent = "Temperature: " + temperatures[j] + "°C";
    humidityEls[j].textContent = "Humidity: " + humidities[j] + "%";
    windSpeedEls[j].textContent = "Wind Speed: " + winds[j] + "KM/H";
    cityDayEls[j].textContent =
      "City Day: " + city + " " + dates[j].toLocaleDateString();
    weatherIconEls[j].setAttribute(
      "src",
      `https://openweathermap.org/img/w/${data.list[j].weather[0].icon}.png`
    );
  }
}

// Event listener for the search button
buttonEl.addEventListener("click", function () {
  var searchInput = inputEl.value;
  getLocation(searchInput);

  // Add the user's search input to the "cityHistory" array and update the city history on the page
  if (cityHistory.length < 3) {
    console.log(cityHistory);
    cityHistory.unshift(searchInput);
    console.log(cityHistory);
  } else {
    cityHistory.length = cityHistory.length - 1;
    cityHistory.unshift(searchInput);
  }

  printCityHistory();
  updateCityHistory(cityHistory);
});

// Retrieve city history from local storage, or initialize an empty array if not present
var cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];

// Function to print the city history on the page
function printCityHistory() {
  cityHistoryEl.innerHTML = "";
  console.log(cityHistoryEl);
  for (let i = 0; i < cityHistory.length; i++) {
    const list = document.createElement("li");
    list.setAttribute("id", cityHistory[i]);
    cityHistoryEl.appendChild(list);
    const container = document.getElementById(cityHistory[i]);
    const button = document.createElement("button");
    button.setAttribute("value", cityHistory[i]);
    button.textContent = cityHistory[i];
    container.appendChild(button);
    button.addEventListener("click", function (event) {
      const city = event.target.value;
      console.log(city);
      getLocation(city);
    });
  }
}

// Function to update the city history in local storage
function updateCityHistory(searchInput) {
  localStorage.setItem("cityHistory", JSON.stringify(searchInput));
  printCityHistory();
}

// Load city history on page load
printCityHistory();

// Thank you for viewing!
