import { fetchCurrentWeather, fetchForecast, fetchWeatherByLocation } from "./api.js";
import { savePreferences, loadPreferences } from "./storage.js";

/* DOM */
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const loading = document.getElementById("loading");
const errorMsg = document.getElementById("errorMsg");
const weatherCard = document.getElementById("weatherCard");
const cityName = document.getElementById("cityName");
const description = document.getElementById("description");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const weatherIcon = document.getElementById("weatherIcon");
const forecastGrid = document.getElementById("forecast");
const forecastTitle = document.getElementById("forecastTitle");
const favoritesDiv = document.getElementById("favorites");

/* Preferences */
let prefs = loadPreferences();
let currentCity = prefs.defaultCity || "London";

/* UI */
const showLoading = () => loading.classList.remove("hidden");
const hideLoading = () => loading.classList.add("hidden");
const showError = msg => {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
};
const clearError = () => errorMsg.classList.add("hidden");

/* Render Current */
function renderCurrent(data){
  weatherCard.classList.remove("hidden");
  cityName.textContent = data.city;
  description.textContent = data.description;
  temperature.textContent = data.temp;
  humidity.textContent = data.humidity;
  windSpeed.textContent = data.wind;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
}

/* Render Forecast */
function renderForecast(days){
  forecastTitle.classList.remove("hidden");
  forecastGrid.innerHTML = "";

  days.forEach(d=>{
    forecastGrid.innerHTML += `
      <div class="forecast-card">
        <p>${d.date}</p>
        <img src="https://openweathermap.org/img/wn/${d.icon}.png">
        <h3>${d.temp}°C</h3>
        <small>${d.description}</small>
      </div>`;
  });
}

/* Favorites */
function renderFavorites(){
  favoritesDiv.innerHTML="";
  prefs.favorites.forEach(city=>{
    const btn=document.createElement("button");
    btn.textContent=city;
    btn.onclick=()=>loadWeather(city);
    favoritesDiv.appendChild(btn);
  });
}

/* Main Loader */
async function loadWeather(city){
  try{
    clearError();
    showLoading();

    const weather = await fetchCurrentWeather(city);
    const forecast = await fetchForecast(city);

    renderCurrent(weather);
    renderForecast(forecast);

    currentCity = city;
    prefs.defaultCity = city;
    savePreferences(prefs);

    if(!prefs.favorites.includes(city)){
      prefs.favorites.push(city);
      savePreferences(prefs);
      renderFavorites();
    }

  }catch(err){
    showError("City not found!");
  }finally{
    hideLoading();
  }
}

/* Events */
searchBtn.onclick = () => cityInput.value && loadWeather(cityInput.value.trim());
cityInput.onkeypress = e => e.key==="Enter" && searchBtn.click();

/* Location */
locationBtn.onclick = ()=>{
  navigator.geolocation.getCurrentPosition(async pos=>{
    showLoading();
    const data = await fetchWeatherByLocation(pos.coords.latitude,pos.coords.longitude);
    renderCurrent(data);
    hideLoading();
  });
};

/* Init */
renderFavorites();
loadWeather(currentCity);
