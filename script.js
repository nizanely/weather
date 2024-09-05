async function getWeather() {
    const city = document.getElementById('cityInput').value;
    const encodedCity = encodeURIComponent(city);
    const apiUrl = `https://weather-api99.p.rapidapi.com/weather?city=${encodedCity}&lang=he`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'weather-api99.p.rapidapi.com',
                'X-RapidAPI-Key': 'ac3b6b8c63mshaec2dc8ad7fe68dp116517jsnc0d592f0888e',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('לא נמצא מידע על העיר');
        }

        const data = await response.json();
        displayWeather(data);

        const lat = data.coord.lat;
        const lon = data.coord.lon;
        displayMap(lat, lon); // הצגת המפה עם הקואורדינטות שהתקבלו

    } catch (error) {
        console.error("שגיאה:", error);
        document.getElementById('weatherResult').innerText = error.message;
    }
}

function displayWeather(data) {
    const weatherContainer = document.getElementById('weatherResult');
    const temperature = data.main.temp - 273.15;
    const description = data.weather[0].description;
    const cityName = data.name;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const windDeg = data.wind.deg;
    const pressure = data.main.pressure;
    const visibility = data.visibility / 1000;

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('he-IL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = currentDate.toLocaleTimeString('he-IL');

    weatherContainer.innerHTML = `
        <p>מידע עדכני נכון ל- ${formattedDate} בשעה ${formattedTime}</p>
        <h3>מזג אוויר ב-${cityName}</h3>
        <p>טמפרטורה: ${temperature.toFixed(2)}°C</p>
        <p>תיאור: ${description}</p>
        <p>לחות: ${humidity}%</p>
        <p>מהירות רוח: ${windSpeed} מ/ש</p>
        <p>כיוון רוח: ${windDeg}°</p>
        <p>לחץ אוויר: ${pressure} hPa</p>
        <p>ראות: ${visibility.toFixed(1)} ק"מ</p>
    `;
}

function displayMap(lat, lon) {
    // יצירת מפה חדשה עם Leaflet
    const map = L.map('map').setView([lat, lon], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // הוספת סמן למיקום העיר
    L.marker([lat, lon]).addTo(map)
        .bindPopup('מיקום: ' + lat.toFixed(2) + ', ' + lon.toFixed(2))
        .openPopup();
}
