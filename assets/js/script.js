const CurrentResults = document.getElementById('result-content');
const ForecastResults = document.getElementById('forecast-content');
const searchForm = document.getElementById('search-form');
const previousSearches = document.getElementById('previous-searches');


//Displays both the current weather and the 5 day forecast
function printResults(currentData, forecastData) {

    const cityName = currentData.name;
    const currentTemperature = currentData.main.temp;
    const currentWindSpeed = currentData.wind.speed;
    const currentHumidity = currentData.main.humidity;
//Creates the card and inputs the correct values
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
    //This filters each result so that it only gives the values for the next day
    const forecasts = forecastData.list.filter((item, index) => index % 8 === 0);

    forecasts.forEach(forecast => {
        //converts the timestamp to a readable date
        const forecastDate = new Date(forecast.dt * 1000);
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
//fetches data using the api key and city name input
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
// Adds the previous searches as buttons underneath the search button
function displayPreviousSearch() {
    let storedSearches = localStorage.getItem('searches');
    previousSearches.innerHTML = ''
    if (storedSearches) {
        searches = JSON.parse(storedSearches);
        const searchArr = Array.from(searches)
        searchArr.forEach(search => {
            const previousSearch = document.createElement('button');
            previousSearch.textContent = search;
            previousSearch.style.margin = '10px';
            previousSearch.addEventListener('click', function() {
                fetchData(search)
            });
            previousSearches.appendChild(previousSearch);
        })
    } else {
        searches = [];
    }
}

function saveSearch(search) {
    let searches = JSON.parse(localStorage.getItem('searches') || '[]');
    searches.push(search);
    localStorage.setItem('searches', JSON.stringify(searches));
}
//Runs these functions with the search input on button submit
searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const searchInputVal = document.getElementById("search-input").value.trim();
    if (searchInputVal) {
        saveSearch(searchInputVal);
        fetchData(searchInputVal);
        displayPreviousSearch(searchInputVal);
    } else {
        console.log("invalid city")
    }
});
//displays the previous searches from local storage on page load
window.addEventListener('load', displayPreviousSearch)