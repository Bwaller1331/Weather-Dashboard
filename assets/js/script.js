var cities = [];

var cityFormEl=document.querySelector("#city-search-form");
var cityInEl=document.querySelector("#city");
var citySearchInEl = document.querySelector("#searched-city");
var prevSearchButtonEl = document.querySelector("#prev-search-buttons");
var weatherContEl=document.querySelector("#current-weather-container");
var forecastHead = document.querySelector("#forecast");
var forecastContEl = document.querySelector("#fiveday-container");

//Search button function 
var formSubmit = function(event){
    event.preventDefault();
    var city = cityInEl.value.trim();
    if(city){
        getCityWeather(city);
        get5Day(city);
        cities.unshift({city});
        cityInEl.value = "";
    } else{
        alert("Please enter a City");
    }
    saveSearch();
    prevSearch(city);
}
//saves city to local storage
var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};
//gets the city weather info from the api
var getCityWeather = function(city){
    var apiKey = "844421298d794574c100e3409cee0499"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

var displayWeather = function(weather, searchCity){
// Clears any old content

    weatherContEl.textContent= "";  
   citySearchInEl.textContent=searchCity;

//Create Image element from api
var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    citySearchInEl.appendChild(weatherIcon);

//Create the Date Element
var currDate = document.createElement("div")
    currDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    citySearchInEl.appendChild(currDate);

//create div for humidity info
var humidityEl = document.createElement("div");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item";

//Div for temp info
var temperatureEl = document.createElement("div");
   temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
   temperatureEl.classList = "list-group-item"
  
//Div for wind data
var windSpeedEl = document.createElement("div");
   windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeedEl.classList = "list-group-item"

//Append to their respective containers
weatherContEl.appendChild(humidityEl);
weatherContEl.appendChild(temperatureEl);
weatherContEl.appendChild(windSpeedEl);

//requesting the forcast form the api

 //variables for the api search
        var lat = weather.coord.lat;
        var lon = weather.coord.lon;
        getUvIndex(lat,lon)
}
var get5Day = function(city){
    var apiKey = "844421298d794574c100e3409cee0499"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
        });
    });
};

//creating the forcast display
var display5Day = function(weather){
    forecastContEl.textContent = ""
    forecastHead.textContent = "5-Day Forecast:";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
        
       
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";
       

     //create an image element
     var weatherIcon = document.createElement("img")
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  
    
     //create date element
     var forecastDate = document.createElement("h5")
        forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
        forecastDate.classList = "card-header text-center"
        forecastEl.appendChild(forecastDate);

     //Div for temp 
     var forecastTempEl=document.createElement("div");
        forecastTempEl.classList = "card-body text-center";
        forecastTempEl.textContent = dailyForecast.main.temp + " °F";

     //Create div for forecast humidity
     var forecastHumEl=document.createElement("div");
        forecastHumEl.classList = "card-body text-center";
        forecastHumEl.textContent = dailyForecast.main.humidity + "  %";
        forecastEl.appendChild(forecastHumEl);

     //append all to the card
        forecastContEl.appendChild(forecastEl);
        forecastEl.appendChild(weatherIcon);
       }
  }  


  //Search api for uv index values
    var getUvIndex = function(lat,lon){
        var apiKey = "844421298d794574c100e3409cee0499"
        var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
        fetch(apiURL)
        .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
           });
    });
}

  //Div for UV index
  var displayUvIndex = function(index){
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexVal = document.createElement("div")
    uvIndexVal.textContent = index.value

//Determining which color the uv index should be
    if(index.value <=2){
        uvIndexValue.classList = "favorable"
    }else if(index.value >2 && index.value<=8){
        uvIndexVal.classList = "moderate "
    }
    else if(index.value >8){
        uvIndexVal.classList = "severe"
    };

    uvIndexEl.appendChild(uvIndexVal);

    //Append index to current weather
    weatherContEl.appendChild(uvIndexEl);
}
var prevSearch = function(prevSearch){
 
    prevSearchEl = document.createElement("button");
    prevSearchEl.textContent = prevSearch;
    prevSearchEl.classList = "d-flex w-100 btn-light border p-2";
    prevSearchEl.setAttribute("data-city",prevSearch)
    prevSearchEl.setAttribute("type", "submit");

    prevSearchButtonEl.prepend(prevSearchEl);
}


var prevSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}

// Previous search functions

cityFormEl.addEventListener("submit", formSubmit);
prevSearchButtonEl.addEventListener("click", prevSearchHandler);