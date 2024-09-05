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
            throw new Error('לא נמצא מידע על העיר'); // שינוי הודעת השגיאה
        }

        // קריאה לנתונים מהשרת בפורמט JSON
        const data = await response.json();
        console.log("נתונים שהתקבלו:", data); // הדפסת הנתונים לבדיקה
        displayWeather(data);

    } catch (error) {
        console.error("שגיאה:", error);
        document.getElementById('weatherResult').innerText = `שגיאה: ${error.message}`; // הצגת השגיאה פעם אחת בלבד
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

    weatherContainer.innerHTML = `
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
