// Add an event listener to the form submission to handle it without reloading the page
document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();                                                                         // Prevent the default form submission behavior (which would reload the page)
    const zipCode = document.getElementById('zipCode').value;                                       // Get the value from the zip code input field
    const city = document.getElementById('city').value;                                             // Get the value from the city input field
    const state = document.getElementById('state').value;                                           // Get the value from the state input field

    if (zipCode) {                                                                                  // Check if the zip code is provided
        getWeatherDataByZip(zipCode);                                                               // Call the function to get weather data using the zip code
    } else if (city && state) {                                                                     // Check if both city and state are provided
        getCoordinates(city, state);                                                                // Call the function to get coordinates and then weather data using the city and state
    } else {
        alert('Please enter either a city and state, or a zip code.');                              // Alert the user if neither a zip code nor city/state are provided
    }
});

let isCelsius = false;                                                                              // Initialize a variable to track the temperature unit (false means Fahrenheit, true means Celsius)

// Asynchronous function to get the coordinates of a city and state
async function getCoordinates(city, state) {
    const apiKey = '2182ee4c84deb73b20b5a76e6d883b4d'; // API key for OpenWeatherMap
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=1&appid=${apiKey}`; // URL to fetch the coordinates

    try {
        const response = await fetch(url);                                                                      // Make the HTTP request to get the coordinates
        const data = await response.json();                                                                     // Parse the response as JSON

        if (data.length === 0) {                                                                                // Check if no data is returned
            alert('Error: Location not found.');                                                                // Alert the user if the location is not found
            return;                                                                                             // Exit the function
        }

        const { lat, lon } = data[0];                                                                           // Extract the latitude and longitude from the response
        getWeatherData(lat, lon);                                                                               // Call the function to get weather data using the coordinates
    } catch (error) {
        console.error('Error fetching location data:', error);                                                  // Log any errors to the console
        alert('Failed to fetch location data.');                                                                // Alert the user if there was an error fetching the location data
    }
}

// Asynchronous function to get the weather data using a zip code
async function getWeatherDataByZip(zipCode) {
    const apiKey = '2182ee4c84deb73b20b5a76e6d883b4d';                                                          // API key for OpenWeatherMap
    const units = isCelsius ? 'metric' : 'imperial';                                                            // Determine the units based on the isCelsius flag
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&units=${units}&appid=${apiKey}`; // URL to fetch current weather data
    const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipCode},us&units=${units}&appid=${apiKey}`; // URL to fetch forecast weather data

    try {
        // Fetch both current weather and forecast data concurrently
        const [currentResponse, forecastResponse] = await Promise.all([                                          // prmoise.all(), makes both requests concurrently returns a promise that resolves to an array of the resolved values of the promises passed
            fetch(currentWeatherUrl),
            fetch(forecastWeatherUrl)
        ]);

        const currentData = await currentResponse.json();                                                         // Parse the current weather response as JSON
        const forecastData = await forecastResponse.json();                                                       // Parse the forecast weather response as JSON

        if (currentData.cod !== 200) {                                                                              // Check if the API returned an error
            alert('Error: ' + currentData.message);                                                             // Alert the user if there was an error
            return;                                                                                                 // Exit the function
        }

        displayWeatherData(currentData, forecastData);                                                              // Call the function to display the weather data
    } catch (error) {
        console.error('Error fetching weather data:', error);                                                       // Log any errors to the console
        alert('Failed to fetch weather data.');                                                                     // Alert the user if there was an error fetching the weather data
    }
}

// Asynchronous function to get the weather data using coordinates
async function getWeatherData(lat, lon) {
    const apiKey = '2182ee4c84deb73b20b5a76e6d883b4d';                                                          // API key for OpenWeatherMap
    const units = isCelsius ? 'metric' : 'imperial';                                                            // Determine the units based on the isCelsius flag
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`; // URL to fetch current weather data
    const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`; // URL to fetch forecast weather data

    try {
        // Fetch both current weather and forecast data concurrently
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastWeatherUrl)
        ]);

        const currentData = await currentResponse.json();                                                           // Parse the current weather response as JSON
        const forecastData = await forecastResponse.json();                                                         // Parse the forecast weather response as JSON

        if (currentData.cod !== 200) {                                                                              // Check if the API returned an error
            alert('Error: ' + currentData.message);                                                                 // Alert the user if there was an error
            return;                                                                                                 // Exit the function
        }

        displayWeatherData(currentData, forecastData);                                                              // Call the function to display the weather data
    } catch (error) {
        console.error('Error fetching weather data:', error);                                                       // Log any errors to the console
        alert('Failed to fetch weather data.');                                                                     // Alert the user if there was an error fetching the weather data
    }
}

// Function to display the weather data on the page
function displayWeatherData(currentData, forecastData) {
    const currentDate = new Date().toLocaleDateString();                                                            // Get the current date
    const city = currentData.name;                                                                                  // Get the city name from the current weather data
    const temperature = currentData.main.temp;                                                                      // Get the current temperature
    const feelsLike = currentData.main.feels_like;                                                                  // Get the feels-like temperature
    const conditions = currentData.weather[0].description;                                                          // Get the weather conditions description
    const tempHigh = currentData.main.temp_max;                                                                     // Get the high temperature for the day
    const tempLow = currentData.main.temp_min;                                                                      // Get the low temperature for the day
    const icon = `http://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`;                          // Get the weather icon URL

    const tempUnit = isCelsius ? '°C' : '°F'; // Determine the temperature unit based on the isCelsius flag

    // Update the HTML elements with the current weather data
    if (document.getElementById('currentDate')) document.getElementById('currentDate').innerText = currentDate;
    if (document.getElementById('city')) document.getElementById('city').innerText = city;
    if (document.getElementById('temperature')) document.getElementById('temperature').innerText = temperature + tempUnit;
    if (document.getElementById('conditions')) document.getElementById('conditions').innerText = conditions;
    if (document.getElementById('weather-icon-now')) document.getElementById('weather-icon-now').src = icon;
    if (document.getElementById('weather-icon-conditions')) document.getElementById('weather-icon-conditions').src = icon;
    if (document.getElementById('wrapper-temp-high')) document.getElementById('wrapper-temp-high').innerText = tempHigh + tempUnit;
    if (document.getElementById('wrapper-temp-low')) document.getElementById('wrapper-temp-low').innerText = tempLow + tempUnit;
    if (document.getElementById('wrapper-feels-like')) document.getElementById('wrapper-feels-like').innerText = feelsLike + tempUnit;

    const main = currentData.weather[0].main;                                                                       // Get the main weather condition
    const description = currentData.weather[0].description;                                                         // Get the detailed description of the weather
    const temp = Math.round(currentData.main.temp);                                                                 // Get the current temperature rounded to the nearest degree
    const pressure = currentData.main.pressure;                                                                     // Get the atmospheric pressure
    const humidity = currentData.main.humidity;                                                                     // Get the humidity percentage

    // Update the HTML elements with the additional weather data
    if (document.getElementById("wrapper-description")) document.getElementById("wrapper-description").innerHTML = description;
    if (document.getElementById("wrapper-temp")) document.getElementById("wrapper-temp").innerHTML = temp + tempUnit;
    if (document.getElementById("wrapper-pressure")) document.getElementById("wrapper-pressure").innerHTML = pressure;
    if (document.getElementById("wrapper-humidity")) document.getElementById("wrapper-humidity").innerHTML = humidity + "%";
    if (document.getElementById("wrapper-name")) document.getElementById("wrapper-name").innerHTML = city;

    // Update the hourly forecast
    const hourlyForecastContainer = document.getElementById('hourly-forecast');
    hourlyForecastContainer.innerHTML = '';                                                                         // Clear previous hourly data
    forecastData.list.slice(0, 8).forEach((forecast, index) => {                                                    // Get the next 8 forecasts (representing 24 hours)
        const time = new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });   // Convert the forecast time to a readable format
        const temp = forecast.main.temp;                                                                            // Get the temperature for the forecast time
        const icon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;                         // Get the weather icon URL
        const description = forecast.weather[0].description;                                                        // Get the weather description

        const forecastItem = document.createElement('div');                                                         // Create a new div for the forecast item
        forecastItem.className = 'col-3';                                                                           // Add a class to the div
        forecastItem.innerHTML = `
            <strong class="d-block mb-2">${time}</strong>
            <img src="${icon}" alt="${description}" />
            <strong class="d-block">${temp}${tempUnit}</strong>
        `;                                                                                                          // Set the inner HTML of the div
        hourlyForecastContainer.appendChild(forecastItem);                                                          // Append the div to the hourly forecast container
    });

    // Update the 3-day forecast
    const fiveDayForecastContainer = document.getElementById('five-day-forecast');
    fiveDayForecastContainer.innerHTML = '';                                                                // Clear previous daily data
    const dailyData = {};                                                                                   // Create an object to store daily forecasts
    forecastData.list.forEach((forecast) => {                                                               // Iterate over all forecast items
        const date = new Date(forecast.dt * 1000).toLocaleDateString();                                     // Convert the forecast time to a readable date
        if (!dailyData[date]) {                                                                              // If there is no entry for this date yet
            dailyData[date] = [];                                                                           // Create an empty array for this date
        }
        dailyData[date].push(forecast);                                                                     // Add the forecast item to the array for this date
    });

    Object.keys(dailyData).slice(1, 4).forEach((date) => {                                                  // Iterate over the next 3 days (excluding today)
        const dayData = dailyData[date];                                                                        // Get the forecast items for this date
        const dayTemps = dayData.map(forecast => forecast.main.temp);                                            // Get the temperatures for this date
        const dayHigh = Math.max(...dayTemps);                                                                   // Get the highest temperature for this date
        const dayLow = Math.min(...dayTemps);                                                                    // Get the lowest temperature for this date
        const dayDescription = dayData[0].weather[0].description;                                                // Get the weather description for this date
        const dayIcon = `http://openweathermap.org/img/wn/${dayData[0].weather[0].icon}@2x.png`;                 // Get the weather icon URL for this date

        const forecastItem = document.createElement('div');                                                     // Create a new div for the forecast item
        forecastItem.className = 'row align-items-center';                                                      // Add a class to the div
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
        `; // Set the inner HTML of the div
        fiveDayForecastContainer.appendChild(forecastItem);                                                     // Append the div to the 5-day forecast container
    });

    // Update the background image based on the main weather condition
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

    // Update the background color based on the main weather condition
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

    document.body.style.backgroundColor = backgroundColor;                                                          // Set the background color of the body

    document.getElementById('weatherData').classList.remove('hidden');                                              // Unhide the weather data section
}

// Add an event listener to the button to toggle between Celsius and Fahrenheit
document.getElementById('unitToggleBtn').addEventListener('click', function() {
    isCelsius = !isCelsius;                                                                                         // Toggle the isCelsius flag
    const city = document.getElementById('city').value;                                                             // Get the city value
    const state = document.getElementById('state').value;                                                           // Get the state value
    const zipCode = document.getElementById('zipCode').value;                                                       // Get the zip code value

    if (zipCode) {                                                                                                  // If the zip code is provided
        getWeatherDataByZip(zipCode);                                                                               // Call the function to get weather data by zip code
    } else if (city && state) {                                                                                     // If both city and state are provided
        getCoordinates(city, state);                                                                                // Call the function to get coordinates and then weather data using city and state
    } else {
        getCoordinates('New York', 'NY');                                                                           // Default to New York City
    }
    this.textContent = isCelsius ? 'Switch to °F' : 'Switch to °C';                                                 // Update the button text
});

// Add an event listener to the document to load default weather data when the page loads
document.addEventListener('DOMContentLoaded', function() {
    getCoordinates('New York', 'NY');                                                                               // Default to New York City
});