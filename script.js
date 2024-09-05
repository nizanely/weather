async function getWeather() {
    const city = document.getElementById('cityInput').value;
    const encodedCity = encodeURIComponent(city);
    const apiUrl = `https://weather-api99.p.rapidapi.com/weather?city=${encodedCity}&lang=he`; // שם הפרמטר עודכן ל-city

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'weather-api99.p.rapidapi.com',
                'X-RapidAPI-Key': 'ac3b6b8c63mshaec2dc8ad7fe68dp116517jsnc0d592f0888e',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        console.log("Response status:", response.status);
        console.log("Response text:", await response.text()); // הצג את התגובה המלאה מהשרת

        if (!response.ok) {
            throw new Error('שגיאה: לא נמצא מידע על העיר');
        }

        const data = await response.json();
        console.log("נתונים שהתקבלו:", data);
        displayWeather(data);
    } catch (error) {
        document.getElementById('weatherResult').innerText = `שגיאה: ${error.message}`;
    }
}
