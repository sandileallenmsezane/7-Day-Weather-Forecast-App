document.addEventListener("DOMContentLoaded", () => {
  const citySelect = document.getElementById("citySelect");
  const getWeatherBtn = document.getElementById("getWeatherBtn");
  const forecastContainer = document.getElementById("forecastContainer");

  // Load CSV and populate dropdown
  fetch("city_coordinates.csv")
    .then(res => res.text())
    .then(data => {
      const rows = data.trim().split("\n").slice(1); // Skip header
      citySelect.innerHTML = '<option value="">Select a city</option>';

      rows.forEach(row => {
        const [lat, lon, city, country] = row.split(",");
        const option = document.createElement("option");
        option.value = `${lat},${lon}`;  
        option.textContent = `${city}, ${country}`;  
        citySelect.appendChild(option);

      });
    });

  const loader = document.getElementById("loader");

  getWeatherBtn.addEventListener("click", () => {
    const selected = citySelect.value;
    if (!selected) return alert("Please select a city.");

    const [lat, lon] = selected.split(",");
    const url = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;

    // Show loader and clear previous results
    loader.style.display = "block";
    forecastContainer.innerHTML = "";

    fetch(url)
      .then(res => res.json())
      .then(data => {
        loader.style.display = "none"; // Hide loader
        displayForecast(data.dataseries); // Display cards
      })
      .catch(err => {
        loader.style.display = "none";
        forecastContainer.innerHTML = "<p>Error fetching weather data.</p>";
        console.error(err);
      });
  });


  function displayForecast(series) {
    forecastContainer.innerHTML = "";

    const iconMap = {
      clearday: "clear.png",
      clearnight: "clearnight.png",
      clearday: "clearday.png",
      cloudy: "cloudy.png",
      cloudyday: "cloudy.png",
      cloudynight: "cloudy.png",
      ishowernight: "showers.png",
      ishowerday: "showers.png",
      lightsnowday: "lightsnowday.png",
      lightsnownight: "lightsnownight.png",
      lightrainday: "lightrainday.png",
      lightrainnight: "lightrainnight.png",
      rain: "rain.png",
      snow: "snow.png",
      fog: "fog.png",
      humid: "humid.png",
      oshowerday: "showers.png",
      oshowernight: "showers.png",
      pcloudy: "pcloudyday.png",
      pcloudyday: "pcloudyday.png",
      pcloudynight: "pcloudynight.png",
      mcloudy: "mcloudy.png",
      mcloudyday: "mcloudyday.png",
      mcloudynight: "mcloudynight.png",
      ts: "tstorm.png",
      tsrain: "tsrain.png",
      windy: "windy.png",
    };

    const weatherNames = {
      clear: "Clear",
      clearday: "Clear (Day)",
      clearnight: "Clear (Night)",
      cloudy: "Cloudy",
      cloudyday: "Cloudy (Day)",
      cloudynight: "Cloudy (Night)",
      lightsnowday: "Light Snow (Day)",
      lightsnownight: "Light Snow (Night)",
      lightrainday: "Light Rain (Day)",
      lightrainnight: "Light Rain (Night)",
      rain: "Rain",
      snow: "Snow",
      fog: "Fog",
      ishowerday: "Isolated Showers (Day)",
      oshowerday: "Scattered Showers (Night)",
      ishowernight: "Isolated Showers(Day)",
      oshowernight: "Scattered Showers (Night)",
      pcloudy: "Partly Cloudy",
      pcloudyday: "Partly Cloudy (Day)",
      pcloudynight: "Partly Cloudy (Night)",
      mcloudy: "Mostly Cloudy",
      mcloudyday: "Mostly Cloudy (Day)",
      mcloudynight: "Mostly Cloudy (Night)",
      ts: "Thunderstorm",
      tsrain: "Thunderstorm + Rain",
      windy: "Wind"
    };

    const daily = series.filter(item => item.timepoint % 24 === 12).slice(0, 7);

    daily.forEach(day => {
      const card = document.createElement("div");
      card.className = "card";

      const date = new Date();
      date.setDate(date.getDate() + daily.indexOf(day));
      const dateStr = date.toDateString();

      const weather = day.weather;
      const temp2m = day.temp2m;
      const imgSrc = `image2/${iconMap[weather] || "default.png"}`;
      const weatherLabel = weatherNames[weather] || weather;

      card.innerHTML = `
        <h4>${dateStr}</h4>
        <img src="${imgSrc}" alt="${weather}">
        <p>${weatherLabel}</p>
        <p>Temp: ${temp2m}°C</p>
      `;
      forecastContainer.appendChild(card);
    });
  }


});
