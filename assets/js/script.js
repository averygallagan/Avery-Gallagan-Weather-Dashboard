const CurrentResults = document.getElementById('result-content');
const ForecastResults = document.getElementById('forecast-content')
const searchForm = document.getElementById('search-form');


function printResults(currentData, forecastData) {


    // const currentCard = document.createElement('div')
    // currentCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

    // const currentBody = document.createElement('div');
    // currentBody.classList.add('card-body');
    // currentCard.append(currentBody);

    const cityName = currentData.name;
    const currentTemperature = currentData.main.temp;
    const currentWindSpeed = currentData.wind.speed;
    const currentHumidity = currentData.main.humidity;

    const currentWeatherHtml = `
        <div class="border border-dark text-center">  
            <h2>Current Weather in ${cityName}</h2>
            <p><strong>Temperature:</strong> ${currentTemperature} °F</p>
            <p><strong>Wind Speed:</strong> ${currentWindSpeed} mph</p>
            <p><strong>Humidity:</strong> ${currentHumidity} %</p>
        </div>
    `;

    CurrentResults.innerHTML = currentWeatherHtml;

    let forecastWeatherHtml = '';
    const forecasts = forecastData.list.filter((item, index) => index % 8 === 0);

    forecasts.forEach(forecast => {
        const forecastDate = new Date(forecast.dt * 1000); // Convert timestamp to date object
        const forecastTemperature = forecast.main.temp;
        const forecastWindSpeed = forecast.wind.speed;
        const forecastHumidity = forecast.main.humidity;

        forecastWeatherHtml += `
            <div class="forecast-box bg-primary rounded border border-dark">
                <p><strong>Date:</strong> ${forecastDate.toLocaleDateString()}</p>
                <p><strong>Temperature:</strong> ${forecastTemperature} °F</p>
                <p><strong>Wind Speed:</strong> ${forecastWindSpeed} mph</p>
                <p><strong>Humidity:</strong> ${forecastHumidity} %</p>
            </div>
        `;
        });
        ForecastResults.innerHTML = forecastWeatherHtml;
    
}   

function fetchForecast(city) {
    const api = "e034ad9e95bdcc3034f0a5bcff8dab6e";
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${api}`;

    return fetch(forecastUrl)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .catch(function (error) {
            console.error(error);
        });
}

function fetchData(city) {
    const api= "e034ad9e95bdcc3034f0a5bcff8dab6e"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${api}`;

    fetch(url)
       .then(function (response) {
          if (!response.ok) {
            throw response.json();
          }
          return response.json();
       })
       .then(function (currentData) {
        console.log(currentData);
        return fetchForecast(city)
            .then(function (forecastData) {
                console.log(forecastData);
                printResults(currentData, forecastData);
            });
       })
       .catch(function (error) {
          console.error(error);
       }); 

}




searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const searchInputVal = document.getElementById("search-input").value.trim();
    if (searchInputVal) {
        fetchData(searchInputVal);
    } else {
        console.log("invalid city")
    }
});
