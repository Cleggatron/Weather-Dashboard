var APIKey = "9848bfb6d8989dcb1be0073be9867f89";


var currentDayUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`
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
    var city = searchInputEl.value.trim();
    //handle no user input
    if(city === ""){
        alert("You have not input any destination!")
        return;
    }

    searchAPI(city);
    //update search hstory here
    searchInputEl.value = "";
}