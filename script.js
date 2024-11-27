document.getElementById('weather-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('city').value;
    getWeather(city);
});

function getWeather(city) {
    const apiKey = 'cb315a015da8818cbc60ceb96ba9bb51'; // Replace with your OpenWeatherMap API key
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    fetch(geocodingUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Geocoding API response:', data); // Log the geocoding API response
            if (data.length > 0) {
                const { lat, lon } = data[0];
                fetchWeather(lat, lon, city);
            } else {
                document.getElementById('weather-result').innerHTML = `<p>City not found</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching geocoding data:', error);
            document.getElementById('weather-result').innerHTML = `<p>Error fetching geocoding data: ${error.message}</p>`;
        });
}

function fetchWeather(lat, lon, city) {
    const apiKey = 'cb315a015da8818cbc60ceb96ba9bb51'; // Replace with your OpenWeatherMap API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            const temp = data.main.temp;
            const description = data.weather[0].description;
            document.getElementById('weather-result').innerHTML = `
                <h2>Current Weather in ${city}</h2>
                <p>Temperature: ${temp} °C</p>
                <p>Weather: ${description}</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('weather-result').innerHTML = `<p>Error fetching weather data</p>`;
        });
}