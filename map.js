// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 2); // Default coordinates (London)

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Add a weather layer from OpenWeatherMap
const apiKey = 'cb315a015da8818cbc60ceb96ba9bb51'; // Replace with your OpenWeatherMap API key
const weatherLayer = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
    attribution: '&copy; OpenWeatherMap'
});

weatherLayer.addTo(map);

// Add event listener to the search form
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('city').value;
    getCityCoordinates(city);
});

function getCityCoordinates(city) {
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
                map.flyTo([lat, lon], 10); // Use flyTo for smoother transitions and better centering
                addMarker(lat, lon, city);
            } else {
                alert('City not found');
            }
        })
        .catch(error => {
            console.error('Error fetching geocoding data:', error);
            alert(`Error fetching geocoding data: ${error.message}`);
        });
}

function addMarker(lat, lon, city) {
    const marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(`<b>${city}</b><br>Loading weather...`).openPopup();

    // Fetch weather data for the marker
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            const temp = data.main.temp;
            const description = data.weather[0].description;
            marker.setPopupContent(`<b>${city}</b><br>Temperature: ${temp} °C<br>Weather: ${description}`);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            marker.setPopupContent(`<b>${city}</b><br>Error fetching weather data`);
        });
}