document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const zipCode = document.getElementById('zipCode').value;
    getWeatherData(zipCode);
});

async function getWeatherData(zipCode) {
    const apiKey = '2182ee4c84deb73b20b5a76e6d883b4d'; // Replace with your actual API key
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&units=imperial&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            alert('Error: ' + data.message);
            return;
        }

        displayWeatherData(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data.');
    }
}

function displayWeatherData(data) {
    const currentDate = new Date().toLocaleDateString();
    const city = data.name;
    const temperature = data.main.temp;
    const conditions = data.weather[0].description;
    const tempHigh = data.main.temp_max;
    const tempLow = data.main.temp_min;
    const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    if (document.getElementById('currentDate')) document.getElementById('currentDate').innerText = currentDate;
    if (document.getElementById('city')) document.getElementById('city').innerText = city;
    if (document.getElementById('temperature')) document.getElementById('temperature').innerText = temperature;
    if (document.getElementById('conditions')) document.getElementById('conditions').innerText = conditions;
    if (document.getElementById('weather-icon-now')) document.getElementById('weather-icon-now').src = icon;
    if (document.getElementById('weather-icon-conditions')) document.getElementById('weather-icon-conditions').src = icon;
    if (document.getElementById('wrapper-temp-high')) document.getElementById('wrapper-temp-high').innerText = tempHigh;
    if (document.getElementById('wrapper-temp-low')) document.getElementById('wrapper-temp-low').innerText = tempLow;

    const main = data.weather[0].main;
    const description = data.weather[0].description;
    const temp = Math.round(data.main.temp);
    const pressure = data.main.pressure;
    const humidity = data.main.humidity;

    if (document.getElementById("wrapper-description")) document.getElementById("wrapper-description").innerHTML = description;
    if (document.getElementById("wrapper-temp")) document.getElementById("wrapper-temp").innerHTML = temp + "°F";
    if (document.getElementById("wrapper-pressure")) document.getElementById("wrapper-pressure").innerHTML = pressure;
    if (document.getElementById("wrapper-humidity")) document.getElementById("wrapper-humidity").innerHTML = humidity + "%";
    if (document.getElementById("wrapper-name")) document.getElementById("wrapper-name").innerHTML = city;

    // Clear previous hourly data
    if (document.getElementById("wrapper-hour-now")) document.getElementById("wrapper-hour-now").innerHTML = "";
    if (document.getElementById("wrapper-hour1")) document.getElementById("wrapper-hour1").innerHTML = "";
    if (document.getElementById("wrapper-hour2")) document.getElementById("wrapper-hour2").innerHTML = "";
    if (document.getElementById("wrapper-hour3")) document.getElementById("wrapper-hour3").innerHTML = "";
    if (document.getElementById("wrapper-hour4")) document.getElementById("wrapper-hour4").innerHTML = "";
    if (document.getElementById("wrapper-hour5")) document.getElementById("wrapper-hour5").innerHTML = "";

    // Clear previous time data
    if (document.getElementById("wrapper-time1")) document.getElementById("wrapper-time1").innerHTML = "";
    if (document.getElementById("wrapper-time2")) document.getElementById("wrapper-time2").innerHTML = "";
    if (document.getElementById("wrapper-time3")) document.getElementById("wrapper-time3").innerHTML = "";
    if (document.getElementById("wrapper-time4")) document.getElementById("wrapper-time4").innerHTML = "";
    if (document.getElementById("wrapper-time5")) document.getElementById("wrapper-time5").innerHTML = "";

    // Clear previous daily data
    if (document.getElementById("wrapper-forecast-temp-today")) document.getElementById("wrapper-forecast-temp-today").innerHTML = "";
    if (document.getElementById("wrapper-forecast-temp-tomorrow")) document.getElementById("wrapper-forecast-temp-tomorrow").innerHTML = "";
    if (document.getElementById("wrapper-forecast-temp-dAT")) document.getElementById("wrapper-forecast-temp-dAT").innerHTML = "";

    // Clear previous icons
    if (document.getElementById("wrapper-icon-today")) document.getElementById("wrapper-icon-today").src = "";
    if (document.getElementById("wrapper-icon-tomorrow")) document.getElementById("wrapper-icon-tomorrow").src = "";
    if (document.getElementById("wrapper-icon-dAT")) document.getElementById("wrapper-icon-dAT").src = "";

    // Backgrounds
    switch (main) {
        case "Snow":
            document.getElementById("wrapper-bg").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/snow.gif')";
            break;
        case "Clouds":
            document.getElementById("wrapper-bg").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/clouds.gif')";
            break;
        case "Fog":
            document.getElementById("wrapper-bg").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif')";
            break;
        case "Rain":
            document.getElementById("wrapper-bg").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/rain.gif')";
            break;
        case "Clear":
            document.getElementById("wrapper-bg").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif')";
            break;
        case "Thunderstorm":
            document.getElementById("wrapper-bg").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/thunderstorm.gif')";
            break;
        default:
            document.getElementById("wrapper-bg").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif')";
            break;
    }

    switch (main) {
        case "Snow":
            document.getElementById("headerwrapper").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/snow.gif')";
            break;
        case "Clouds":
            document.getElementById("headerwrapper").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/clouds.gif')";
            break;
        case "Fog":
            document.getElementById("headerwrapper").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif')";
            break;
        case "Rain":
            document.getElementById("headerwrapper").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/rain.gif')";
            break;
        case "Clear":
            document.getElementById("headerwrapper").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif')";
            break;
        case "Thunderstorm":
            document.getElementById("headerwrapper").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/thunderstorm.gif')";
            break;
        default:
            document.getElementById("headerwrapper").style.backgroundImage = "url('https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif')";
            break;
    }

    document.getElementById('weatherData').classList.remove('hidden');
}
