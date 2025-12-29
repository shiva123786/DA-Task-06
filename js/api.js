const API_KEY = "cfb5c8ecc54c3224a4f4180d25494546";

/* CURRENT WEATHER */
export async function fetchCurrentWeather(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("City not found");

  const d = await res.json();
  return {
    city: d.name,
    temp: Math.round(d.main.temp),
    description: d.weather[0].description,
    humidity: d.main.humidity,
    wind: d.wind.speed,
    icon: d.weather[0].icon
  };
}

/* 5 DAY FORECAST */
export async function fetchForecast(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("Forecast error");

  const d = await res.json();

  return d.list.filter(x=>x.dt_txt.includes("12:00:00")).map(x=>({
    date: x.dt_txt.split(" ")[0],
    temp: Math.round(x.main.temp),
    description: x.weather[0].description,
    icon: x.weather[0].icon
  }));
}

/* GEO LOCATION */
export async function fetchWeatherByLocation(lat,lon){
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  if(!res.ok) throw new Error("Location error");

  const d = await res.json();
  return {
    city: d.name,
    temp: Math.round(d.main.temp),
    description: d.weather[0].description,
    humidity: d.main.humidity,
    wind: d.wind.speed,
    icon: d.weather[0].icon
  };
}
