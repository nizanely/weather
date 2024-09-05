async function getWeather() {
    const city = document.getElementById('cityInput').value;
    const apiUrl = `https://YOUR_RAPIDAPI_HOST/weather?q=${city}&lang=he`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'weather-api99.p.rapidapi.com',
                'X-RapidAPI-Key': 'ac3b6b8c63mshaec2dc8ad7fe68dp116517jsnc0d592f0888e'
            }
        });
        
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
