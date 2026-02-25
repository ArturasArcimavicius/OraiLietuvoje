async function fetchAndGroupCities() {
    try {
        const response = await fetch('https://meteoapi.vercel.app/v1/places');
        const allCities = await response.json();
        
        const cities = allCities.filter(city => city.countryCode === 'LT');
        
        const grouped = {};
        cities.forEach(city => {
            const division = city.administrativeDivision || 'Nežinoma';
            if (!grouped[division]) {
                grouped[division] = [];
            }
            grouped[division].push(city);
        });
        

        const sortedDivisions = Object.keys(grouped).sort();
        
        displayGroupedCities(grouped, sortedDivisions);
    } catch (error) {
        console.error('Error fetching cities:', error);
        document.getElementById('citiesByMunicipality').innerHTML = 
            '<div class="alert alert-danger">Nepavyko įkelti miestų sąrašo</div>';
    }
}

function displayGroupedCities(grouped, divisions) {
    const container = document.getElementById('citiesByMunicipality');
    container.innerHTML = '';
    
    divisions.forEach(division => {
        const cities = grouped[division]
            .sort((a, b) => a.name.localeCompare(b.name));
        
        const divisionDiv = document.createElement('div');
        divisionDiv.className = 'mb-4';
        
        let citiesText = cities
            .map(city => `<div class="ps-3"><a href="city.html?code=${city.code}" class="text-decoration-none">• ${city.name}</a></div>`)
            .join('');
        
        divisionDiv.innerHTML = `
            <h4 class="mb-2 text-primary">${division}</h4>
            ${citiesText}
        `;
        
        container.appendChild(divisionDiv);
    });
}

fetchAndGroupCities();
