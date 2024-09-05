async function getWeather() {
    const city = document.getElementById('cityInput').value;
    const apiKey = '04a4dd25e843f19915602ed7afff24c6'; // החלף כאן במפתח ה-API שלך
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=he`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('שגיאה: לא נמצא מידע על העיר');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        document.getElementById('weatherResult').innerText = error.message;
    }
}

function displayWeather(data) {
    const weatherContainer = document.getElementById('weatherResult');
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const cityName = data.name;

    weatherContainer.innerHTML = `
        <h3>מזג אוויר ב-${cityName}</h3>
        <p>טמפרטורה: ${temperature}°C</p>
        <p>תיאור: ${description}</p>
    `;
}
