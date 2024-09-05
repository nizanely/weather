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

        console.log("Response status:", response.status);

        if (!response.ok) {
            throw new Error('לא נמצא מידע על העיר');
        }

        const data = await response.json();
        console.log("נתונים שהתקבלו:", data);
        displayWeather(data);
        displayMap(data.coord.lat, data.coord.lon); // הצגת המפה עם נתוני קואורדינטות

    } catch (error) {
        console.error("שגיאה:", error);
        document.getElementById('weatherResult').innerText = error.message;
    }
}

function displayWeather(data) {
    const weatherContainer = document.getElementById('weatherResult');
    const temperature = data.main.temp - 273.15; // המרה מקלווין לצלזיוס
    const description = data.weather[0].description;
    const cityName = data.name;
    const humidity = data.main.humidity; // לחות
    const windSpeed = data.wind.speed; // מהירות רוח
    const windDeg = data.wind.deg; // כיוון רוח
    const pressure = data.main.pressure; // לחץ אוויר
    const visibility = data.visibility / 1000; // ראות בק"מ

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

async function displayMap(lat, lon) {
    const mapContainer = document.getElementById('map');

    // ננקה את תוכן המפה הקודמת אם קיימת
    mapContainer.innerHTML = '';

    const mapOptions = {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'maps-for-app-and-website.p.rapidapi.com',
            'x-rapidapi-key': 'ac3b6b8c63mshaec2dc8ad7fe68dp116517jsnc0d592f0888e'
        }
    };

    try {
        const response = await fetch('https://maps-for-app-and-website.p.rapidapi.com/v1/styles/osm-carto/style.json', mapOptions);

        if (!response.ok) {
            throw new Error('שגיאה בטעינת המפה');
        }

        const mapData = await response.json();
        console.log("Map data received:", mapData);

        // יצירת המפה והגדרות ראשוניות
        window.map = L.map('map').setView([lat, lon], 10);

        // שימוש באריחים מהשירות החדש
        L.tileLayer(mapData.tiles[0], {
            maxZoom: 19,
            attribution: mapData.attribution
        }).addTo(window.map);

        // הוספת סמן למיקום העיר
        L.marker([lat, lon]).addTo(window.map)
            .bindPopup('מיקום: ' + lat.toFixed(2) + ', ' + lon.toFixed(2))
            .openPopup();
    } catch (error) {
        console.error("שגיאה בטעינת המפה:", error);
        mapContainer.innerText = `שגיאה בטעינת המפה: ${error.message}`;
    }
}
