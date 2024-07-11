function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getWeather(lat, lon);
    getLocationName(lat, lon);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function getWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&current_weather=true`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const weather = data.current_weather;
            document.getElementById('temperature').innerText = `Temperature: ${weather.temperature}°C`;
            document.getElementById('description').innerText = `Weather Code: ${weather.weathercode}`;
            document.getElementById('rain').innerText = isRaining(weather.weathercode) ? "It's going to rain" : "No rain expected";
            document.getElementById('weather-info').classList.remove('d-none');
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again later.');
        });
}

function isRaining(weatherCode) {
    const rainCodes = [51, 53, 55, 61, 63, 65, 66, 67, 80, 81, 82];
    return rainCodes.includes(weatherCode);
}

function getLocationName(lat, lon) {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('location').innerText = `${data.locality}, ${data.principalSubdivision}, ${data.countryName}`;
        })
        .catch(error => {
            console.error('Error fetching location data:', error);
            alert('Error fetching location data. Please try again later.');
        });
}
