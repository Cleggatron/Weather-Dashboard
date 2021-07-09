var APIKey = "9848bfb6d8989dcb1be0073be9867f89";

//var currentDayForecast = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`
//var sevenDayForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${APIKey}`

var searchButtonEl = document.getElementById("searchButton");
var searchCityFieldEl = document.getElementById("userInput");

function queryApiCurrentDay(searchInput) {
    if(searchInput === ""){
        alert("You have not entered a destination!")
        return;
    }

    var city = searchInput;
    var currentDayForecastUrl =`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`
   
    fetch(currentDayForecastUrl)
    .then(function(response){
        return response.json();
    })
    .then(function (data){
        return data;
    })
}



searchButtonEl.addEventListener("click", searchAPI);
