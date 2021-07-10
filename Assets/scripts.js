var APIKey = "9848bfb6d8989dcb1be0073be9867f89";

var GlobalData;


//var currentDayUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`
//Seven Day API `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${APIKey}`

var searchInputEl = document.getElementById("userInput");
var searchButtonEl = document.getElementById("searchButton");

/*
We need:

An Event Listener to start a callback

That callback to trigger a search

The search to return results

The results build the data on the page

The search to get logged to search history in Local Storage

The search history to populate the search history list

The search history to have an event listener that can trigger a search.


*/
//event listener
searchButtonEl.addEventListener("click", startSearch);


function startSearch(event){
    event.preventDefault();
    var userInput = searchInputEl.value.trim();
    //handle no user input
    if(userInput === ""){
        alert("You have not input any destination!")
        return;
    }
    //update our search history
    updateLocalStorage(userInput);

    //perform the search
    searchAPI(userInput);
    searchInputEl.value = "";
    
}

function searchAPI(destination){
    var city = destination;
    var currentDayApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`;

    fetch(currentDayApiUrl)
    .then(function (response){
        if(response.ok){
            response.json()
            .then(function (data){
                var lat = data.coord.lat;
                var lon = data.coord.lon
                
                //in the API I could not find 1 data source that had everything I needed and had easy acccess.
                //Therefore I am pulling the latitude/longitude from the 1st dataset, and making a new fetch off that
                var sevenDayUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${APIKey}`
                fetch(sevenDayUrl)
                .then(function(response2){
                    response2.json()
                    .then(function (data2){
                        populateData(data2);
                    })
                })
            });

        //handle errrors
        } else{
            alert("Error: " + response.statusText);
        }
    })
}

function populateData (dataObject){
    var dataSet = dataObject;
    //select all spans and loop through them 
    var tempSpanEls = document.querySelectorAll(".temp");
    var windSpanEls = document.querySelectorAll(".wind");
    var humiditySpanEls = document.querySelectorAll(".humidity");
    var dateHeaderEls = document.querySelectorAll(".date");
    var uvIndexEl = document.querySelector("#uvIndex");
    

    for(var i =  0; i < 6; i++){
        //sort out the dates for the cards
        var headerDate = moment.unix(dataSet.daily[i].dt).format("DD/MM/YY");
        
        //add UV index for current day
        if(i === 0){
            uvIndexEl.textContent = dataSet.current.uvi 
        }

        //push content to the cards
        dateHeaderEls[i].textContent = headerDate; 
        tempSpanEls[i].textContent = dataSet.daily[i].temp.day + "°C";
        windSpanEls[i].textContent = dataSet.daily[i].wind_speed + "km/h";
        humiditySpanEls[i].textContent = dataSet.daily[i].humidity + "%";
    }
}

function updateLocalStorage(userInput){
    
    var city = {
        name: userInput
    };

    var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
        if(searchHistory === null){
            searchHistory = [];
            searchHistory.push(city);
        }
    searchHistory.unshift(city);

    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

}