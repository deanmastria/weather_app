document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const zipCode = document.getElementById('zipCode').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;

    if (zipCode) {
        getWeatherDataByZip(zipCode);
    } else if (city && state) {
        getCoordinates(city, state);
    } else {
        alert('Please enter either a city and state, or a zip code.');
    }
});

let isCelsius = false;

async function getCoordinates(city, state) {
    const apiKey = '2182ee4c84deb73b20b5a76e6d883b4d'; 
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=1&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.length === 0) {
            alert('Error: Location not found.');
            return;
        }

        const { lat, lon } = data[0];
        getWeatherData(lat, lon);
    } catch (error) {
        console.error('Error fetching location data:', error);
        alert('Failed to fetch location data.');
    }
}

async function getWeatherDataByZip(zipCode) {
    const apiKey = '2182ee4c84deb73b20b5a76e6d883b4d'; 
    const units = isCelsius ? 'metric' : 'imperial';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&units=${units}&appid=${apiKey}`;
    const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipCode},us&units=${units}&appid=${apiKey}`;

    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastWeatherUrl)
        ]);

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        if (currentData.cod !== 200) {
            alert('Error: ' + currentData.message);
            return;
        }

        displayWeatherData(currentData, forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data.');
    }
}

async function getWeatherData(lat, lon) {
    const apiKey = '2182ee4c84deb73b20b5a76e6d883b4d'; 
    const units = isCelsius ? 'metric' : 'imperial';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastWeatherUrl)
        ]);

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        if (currentData.cod !== 200) {
            alert('Error: ' + currentData.message);
            return;
        }

        displayWeatherData(currentData, forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data.');
    }
}

function displayWeatherData(currentData, forecastData) {
    const currentDate = new Date().toLocaleDateString();
    const city = currentData.name;
    const temperature = currentData.main.temp;
    const feelsLike = currentData.main.feels_like;
    const conditions = currentData.weather[0].description;
    const tempHigh = currentData.main.temp_max;
    const tempLow = currentData.main.temp_min;
    const icon = `http://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`;

    const tempUnit = isCelsius ? '°C' : '°F';

    if (document.getElementById('currentDate')) document.getElementById('currentDate').innerText = currentDate;
    if (document.getElementById('city')) document.getElementById('city').innerText = city;
    if (document.getElementById('temperature')) document.getElementById('temperature').innerText = temperature + tempUnit;
    if (document.getElementById('conditions')) document.getElementById('conditions').innerText = conditions;
    if (document.getElementById('weather-icon-now')) document.getElementById('weather-icon-now').src = icon;
    if (document.getElementById('weather-icon-conditions')) document.getElementById('weather-icon-conditions').src = icon;
    if (document.getElementById('wrapper-temp-high')) document.getElementById('wrapper-temp-high').innerText = tempHigh + tempUnit;
    if (document.getElementById('wrapper-temp-low')) document.getElementById('wrapper-temp-low').innerText = tempLow + tempUnit;
    if (document.getElementById('wrapper-feels-like')) document.getElementById('wrapper-feels-like').innerText = feelsLike + tempUnit;

    const main = currentData.weather[0].main;
    const description = currentData.weather[0].description;
    const temp = Math.round(currentData.main.temp);
    const pressure = currentData.main.pressure;
    const humidity = currentData.main.humidity;

    if (document.getElementById("wrapper-description")) document.getElementById("wrapper-description").innerHTML = description;
    if (document.getElementById("wrapper-temp")) document.getElementById("wrapper-temp").innerHTML = temp + tempUnit;
    if (document.getElementById("wrapper-pressure")) document.getElementById("wrapper-pressure").innerHTML = pressure;
    if (document.getElementById("wrapper-humidity")) document.getElementById("wrapper-humidity").innerHTML = humidity + "%";
    if (document.getElementById("wrapper-name")) document.getElementById("wrapper-name").innerHTML = city;

    // hourly forecast
    const hourlyForecastContainer = document.getElementById('hourly-forecast');
    hourlyForecastContainer.innerHTML = ''; 
    forecastData.list.slice(0, 8).forEach((forecast, index) => {
        const time = new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const temp = forecast.main.temp;
        const icon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
        const description = forecast.weather[0].description;

        const forecastItem = document.createElement('div');
        forecastItem.className = 'col-3';
        forecastItem.innerHTML = `
            <strong class="d-block mb-2">${time}</strong>
            <img src="${icon}" alt="${description}" />
            <strong class="d-block">${temp}${tempUnit}</strong>
        `;
        hourlyForecastContainer.appendChild(forecastItem);
    });

    // 5-day forecast
    const fiveDayForecastContainer = document.getElementById('five-day-forecast');
    fiveDayForecastContainer.innerHTML = ''; 
    const dailyData = {};
    forecastData.list.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        if (!dailyData[date]) {
            dailyData[date] = [];
        }
        dailyData[date].push(forecast);
    });

    Object.keys(dailyData).slice(1, 4).forEach((date) => {
        const dayData = dailyData[date];
        const dayTemps = dayData.map(forecast => forecast.main.temp);
        const dayHigh = Math.max(...dayTemps);
        const dayLow = Math.min(...dayTemps);
        const dayDescription = dayData[0].weather[0].description;
        const dayIcon = `http://openweathermap.org/img/wn/${dayData[0].weather[0].icon}@2x.png`;

        const forecastItem = document.createElement('div');
        forecastItem.className = 'row align-items-center';
        forecastItem.innerHTML = `
            <div class="col-lg-6">
                <strong>${date}</strong>
            </div>
            <div class="col-lg-2 text-center">
                <img src="${dayIcon}" class="w-100" alt="${dayDescription}" />
            </div>
            <div class="col-lg-4 text-end">
                <span>${dayDescription} - High: ${dayHigh}${tempUnit}, Low: ${dayLow}${tempUnit}</span>
            </div>
        `;
        fiveDayForecastContainer.appendChild(forecastItem);
    });

    // Backgrounds
    switch (main) {
        case "Snow":
            document.getElementById("wrapper-bg").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/snow.gif')";
            document.getElementById("headerwrapper").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/snow.gif')";
            break;
        case "Clouds":
            document.getElementById("wrapper-bg").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/clouds.gif')";
            document.getElementById("headerwrapper").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/clouds.gif')";
            break;
        case "Fog":
            document.getElementById("wrapper-bg").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif')";
            document.getElementById("headerwrapper").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif')";
            break;
        case "Rain":
            document.getElementById("wrapper-bg").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/rain.gif')";
            document.getElementById("headerwrapper").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/rain.gif')";
            break;
        case "Clear":
            document.getElementById("wrapper-bg").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif')";
            document.getElementById("headerwrapper").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif')";
            break;
        case "Thunderstorm":
            document.getElementById("wrapper-bg").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/thunderstorm.gif')";
            document.getElementById("headerwrapper").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/thunderstorm.gif')";
            break;
        default:
            document.getElementById("wrapper-bg").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif')";
            document.getElementById("headerwrapper").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif')";
            break;
    }

    let backgroundColor;
    switch (main) {
        case "Snow":
            backgroundColor = "#ffffff";
            document.body.style.backgroundImage = "linear-gradient(135deg, #ffffff 0%, #a1c4fd 100%)";
            break;
        case "Clouds":
            backgroundColor = "#808080";
            document.body.style.backgroundImage = "linear-gradient(135deg, #808080 0%, #d3d3d3 100%)";
            break;
        case "Fog":
            backgroundColor = "#D3D3D3";
            document.body.style.backgroundImage = "linear-gradient(135deg, #D3D3D3 0%, #ffffff 100%)";
            break;
        case "Rain":
            backgroundColor = "#0000ff";
            document.body.style.backgroundImage = "linear-gradient(135deg, #0000ff 0%, #87cefa 100%)";
            break;
        case "Clear":
            backgroundColor = "#87ceeb";
            document.body.style.backgroundImage = "linear-gradient(135deg, #87ceeb 0%, #ffffff 100%)";
            break;
        case "Thunderstorm":
            backgroundColor = "#1b03a3";
            document.body.style.backgroundImage = "linear-gradient(135deg, #1b03a3 0%, #654ea3 100%)";
            break;
        default:
            backgroundColor = "#58c0eb";
            document.body.style.backgroundImage = "linear-gradient(135deg, #58c0eb 0%, #ffffff 100%)";
            break;
    }

    document.body.style.backgroundColor = backgroundColor;

    document.getElementById('weatherData').classList.remove('hidden');
}

document.getElementById('unitToggleBtn').addEventListener('click', function() {
    isCelsius = !isCelsius;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zipCode = document.getElementById('zipCode').value;

    if (zipCode) {
        getWeatherDataByZip(zipCode);
    } else if (city && state) {
        getCoordinates(city, state);
    } else {
        // Default to New York City 
        getCoordinates('New York', 'NY');
    }
    this.textContent = isCelsius ? 'Switch to °F' : 'Switch to °C';
});

document.addEventListener('DOMContentLoaded', function() {
    // Default to New York City
    getCoordinates('New York', 'NY');
});
