async function fetchCities() {
    try {
        const cities = [
            { code: 'vilnius', name: 'Vilnius' },
            { code: 'kaunas', name: 'Kaunas' },
            { code: 'klaipeda', name: 'Klaipėda' }
        ];
        displayForecasts(cities);
    } catch (error) {
        console.error('Error fetching cities:', error);
    }
}

async function displayForecasts(cities) {
    const forecastsContainer = document.getElementById('cityForecasts');
    for (const city of cities) {
        try {
            const forecastResponse = await fetch(`https://meteoapi.vercel.app/v1/places/${city.code}/forecasts/long-term`);
            const forecast = await forecastResponse.json();
            
        
            const firstForecast = forecast.forecastTimestamps[0];
            const temp = firstForecast.airTemperature;
            const feelsLike = firstForecast.feelsLikeTemperature;
            const windSpeed = firstForecast.windSpeed;
            const windDirection = firstForecast.windDirection;
            const cloudCover = firstForecast.cloudCover;
            const conditionCode = firstForecast.conditionCode;
            
            const cityDiv = document.createElement('div');
            cityDiv.className = 'col-md-4';
            cityDiv.innerHTML = `
                <div class="card">
                    <div class="card-header h5">${city.name}</div>
                    <div class="card-body p-3">
                        <p><strong>Oro temperatura:</strong></p>
                        <p>Dabarties: ${temp}°C</p>
                        <p>Juntamoji: ${feelsLike}°C</p>
                        <p><strong>Vėjas:</strong> ${windSpeed} m/s, ${windDirection}°</p>
                        <p><strong>Debesuotumas:</strong> ${cloudCover}%</p>
                        <p><strong>Sąlygos:</strong> ${conditionCode}</p>
                    </div>
                </div>
            `;
            forecastsContainer.appendChild(cityDiv);
        } catch (error) {
            console.error(`Error fetching forecast for ${city.name}:`, error);
        }
    }
}

fetchCities();