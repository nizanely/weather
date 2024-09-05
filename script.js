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

        // קבלת קואורדינטות של העיר באמצעות Geoapify API
        const geoapifyApiKey = '7f79c9c3cb95451fb61e88d3050f825d';
        const geoapifyUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodedCity}&apiKey=${geoapifyApiKey}`;

        const geoResponse = await fetch(geoapifyUrl);
        const geoData = await geoResponse.json();

        if (geoData.features && geoData.features.length > 0) {
            const [lon, lat] = geoData.features[0].geometry.coordinates;
            displayMap(lat, lon); // הצגת המפה עם הקואורדינטות שהתקבלו
        } else {
            console.error("שגיאה: לא נמצאו קואורדינטות לעיר");
            document.getElementById('weatherResult').innerText += '\nשגיאה: לא נמצאו קואורדינטות לעיר';
        }

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

function displayMap(lat, lon) {
    const apiKey = '7f79c9c3cb95451fb61e88d3050f825d'; // מפתח ה-API שלך

    // יצירת מפה חדשה עם MapLibre GL JS
    const map = new maplibregl.Map({
        container: 'map', // ID של המיכל שבו המפה תוצג
        style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${apiKey}`, // סגנון המפה
        center: [lon, lat], // מרכז המפה בקואורדינטות
        zoom: 10 // זום התחלתי
    });

    // הוספת סמן למיקום העיר
    new maplibregl.Marker()
        .setLngLat([lon, lat])
        .addTo(map);
}
