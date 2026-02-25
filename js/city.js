function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function loadCityInfo() {
    const cityCode = getQueryParam('code');
    
    if (!cityCode) {
        document.getElementById('cityInfo').innerHTML = '<div class="alert alert-danger">Miesto kodas nenurodytas</div>';
        return;
    }
    
    try {
        // Fetch city information
        const cityResponse = await fetch(`https://meteoapi.vercel.app/v1/places/${cityCode}`);
        const city = await cityResponse.json();
        
        // Fetch city forecast
        const forecastResponse = await fetch(`https://meteoapi.vercel.app/v1/places/${cityCode}/forecasts/long-term`);
        const forecast = await forecastResponse.json();
        
        displayCityInfo(city);
        displayCityForecast(forecast);
    } catch (error) {
        console.error('Error loading city info:', error);
        document.getElementById('cityInfo').innerHTML = '<div class="alert alert-danger">Nepavyko įkelti miesto informacijos</div>';
    }
}

function displayCityInfo(city) {
    const container = document.getElementById('cityInfo');
    
    container.innerHTML = `
        <div class="mb-4">
            <a href="miestai.html" class="btn btn-secondary btn-sm mb-3">← Atgal į miestus</a>
            <h1>${city.name}</h1>
            
            <div class="row mt-4">
                <div class="col-md-6">
                    <h5>Pagrindinė informacija</h5>
                    <p><strong>Kodas:</strong> ${city.code}</p>
                    <p><strong>Šalis:</strong> ${city.country}</p>
                    <p><strong>Šalies kodas:</strong> ${city.countryCode}</p>
                    <p><strong>Savivaldybė:</strong> ${city.administrativeDivision}</p>
                </div>
                <div class="col-md-6">
                    <h5>Geografinės koordinatės (WGS 84)</h5>
                    <p><strong>Platuma:</strong> ${city.coordinates.latitude.toFixed(6)}°</p>
                    <p><strong>Ilguma:</strong> ${city.coordinates.longitude.toFixed(6)}°</p>
                </div>
            </div>
        </div>
        <hr>
    `;
}

function displayCityForecast(forecast) {
    const container = document.getElementById('cityForecast');
    const place = forecast.place;
    
    // Get next 5 forecasts
    const upcomingForecasts = forecast.forecastTimestamps.slice(0, 5);
    
    let forecastHTML = `
        <h3>Artimiausia prognozė</h3>
        <div class="row g-3">
    `;
    
    upcomingForecasts.forEach(f => {
        const time = new Date(f.forecastTimeUtc).toLocaleString('lt-LT');
        forecastHTML += `
            <div class="col-md-4">
                <div class="p-3 bg-white rounded border">
                    <p class="text-muted small">${time}</p>
                    <p class="h5">${f.airTemperature}°C</p>
                    <p class="small">${getWeatherDescription(f.conditionCode)}</p>
                    <p class="small text-muted">Vėjas: ${f.windSpeed} m/s</p>
                </div>
            </div>
        `;
    });
    
    forecastHTML += `
        </div>
    `;
    
    container.innerHTML = forecastHTML;
}

function getWeatherDescription(code) {
    const descriptions = {
        'clear': 'Giedra',
        'partly-cloudy': 'Mažai debesuota',
        'cloudy-with-sunny-intervals': 'Debesuota su pragiedruliais',
        'cloudy': 'Debesuota',
        'light-rain': 'Nedidelis lietus',
        'rain': 'Lietus',
        'heavy-rain': 'Smarkus lietus',
        'thunder': 'Perkūnija',
        'isolated-thunderstorms': 'Trumpas lietus su perkūnija',
        'thunderstorms': 'Lietus su perkūnija',
        'heavy-rain-with-thunderstorms': 'Smarkus lietus su perkūnija',
        'light-sleet': 'Nedidelė šlapdriba',
        'sleet': 'Šlapdriba',
        'freezing-rain': 'Lijundra',
        'hail': 'Kruša',
        'light-snow': 'Nedidelis sniegas',
        'snow': 'Sniegas',
        'heavy-snow': 'Smarkus sniegas',
        'fog': 'Rūkas',
        'null': 'Nenustatytos'
    };
    
    return descriptions[code] || code;
}


loadCityInfo();
