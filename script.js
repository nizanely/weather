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

        // בדוק אם התגובה אינה מוצלחת (לא תקינה)
        if (!response.ok) {
            throw new Error('שגיאה: לא נמצא מידע על העיר');
        }

        // קרא את התגובה כ-JSON פעם אחת בלבד
        const data = await response.json();
        console.log("נתונים שהתקבלו:", data); // הדפסת הנתונים לבדיקה
        displayWeather(data);

    } catch (error) {
        console.error("שגיאה:", error);
        document.getElementById('weatherResult').innerText = `שגיאה: ${error.message}`;
    }
}

function displayWeather(data) {
    const weatherContainer = document.getElementById('weatherResult');
    const temperature = data.main.temp - 273.15; // להמיר מקלווין לצלזיוס
    const description = data.weather[0].description;
    const cityName = data.name;

    weatherContainer.innerHTML = `
        <h3>מזג אוויר ב-${cityName}</h3>
        <p>טמפרטורה: ${temperature.toFixed(2)}°C</p>
        <p>תיאור: ${description}</p>
    `;
}
