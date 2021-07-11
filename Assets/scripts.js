var APIKey = "9848bfb6d8989dcb1be0073be9867f89";
var searchInputEl = document.getElementById("userInput");
var searchButtonEl = document.getElementById("searchButton");
var searchHistoryListEl = document.getElementById("searchHistorySection");

//begins our search
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
    updateSearchHistoryEl();
    //perform the search
    searchAPI(userInput);
    searchInputEl.value = "";
    
}

//start our query
function searchAPI(destination){
    var city = destination;
    var cityNameEL = document.getElementById("CityName");
    cityNameEL.textContent = city;

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

//updates our cards with content
function populateData (dataObject){
    var dataSet = dataObject;
    //select all spans and loop through them 
    var tempSpanEls = document.querySelectorAll(".temp");
    var windSpanEls = document.querySelectorAll(".wind");
    var humiditySpanEls = document.querySelectorAll(".humidity");
    var dateHeaderEls = document.querySelectorAll(".date");
    var weatherIconEls = document.querySelectorAll(".weatherIcon")
    var uvIndexEl = document.querySelector("#uvIndex");
    

    for(var i =  0; i < 6; i++){
        //sort out the dates for the cards
        var headerDate = moment.unix(dataSet.daily[i].dt).format("DD/MM/YY");
        
        //add UV index for current day
        if(i === 0){
            uvIndexEl.textContent = dataSet.daily[i].uvi 
        }

        //push content to the cards
        dateHeaderEls[i].textContent = headerDate; 
        tempSpanEls[i].textContent = dataSet.daily[i].temp.day + "°C";
        windSpanEls[i].textContent = dataSet.daily[i].wind_speed + "km/h";
        humiditySpanEls[i].textContent = dataSet.daily[i].humidity + "%";

        var icon = dataSet.daily[i].weather[0].icon;
        var iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        weatherIconEls[i].setAttribute("src" , iconUrl)


    }
}

//saves events to local storage
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

//fills in the search history
function updateSearchHistoryEl(){
    
    //remove existing list content
    var searchHistoryEl = document.querySelector("#searchHistory");
    while(searchHistoryEl.firstChild){
        searchHistoryEl.removeChild(searchHistoryEl.firstChild)
    }

    var searchHistoryItems = JSON.parse(localStorage.getItem("searchHistory"));
    //if we have no search history
    if(searchHistoryItems === null){
        return;
    }

    for(i = 0; i < searchHistoryItems.length; i++){
        var liEl = document.createElement("li");
        liEl.innerHTML = searchHistoryItems[i].name;
        searchHistoryEl.appendChild(liEl);
    }

}

function searchHistoryClick(event){
    event.preventDefault();
    
    var target= event.target;

    console.log("click");
    console.log(event.target);
    console.log(target);

    if(target.matches("li")){
        searchAPI(target.textContent)
    }

}

//search button event listener
searchButtonEl.addEventListener("click", startSearch);

//search history event listener
searchHistoryListEl.addEventListener("click", searchHistoryClick)


//populate our search history
updateSearchHistoryEl();
