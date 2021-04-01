var today = moment();
$('.present-date').text(moment().format('LLLL'));
var prevSearches = JSON.parse(localStorage.getItem('searched-cities')) || [];

var dayOne = $('<h4 class="date"></h4>').text(moment().add(1, 'days').format('L'));
$('#card1').prepend(dayOne);
var dayTwo = $('<h4 class="date"></h4>').text(moment().add(2, 'days').format('L'));
$('#card2').prepend(dayTwo);
var dayThree = $('<h4 class="date"></h4>').text(moment().add(3, 'days').format('L'));
$('#card3').prepend(dayThree);
var dayFour = $('<h4 class="date"></h4>').text(moment().add(4, 'days').format('L'));
$('#card4').prepend(dayFour);
var dayFive = $('<h4 class="date"></h4>').text(moment().add(5, 'days').format('L'));
$('#card5').prepend(dayFive);


renderButtons();

function renderButtons() {
    $('.prev-search-list').empty();
    for (var i = 0; i < prevSearches.length; i++) {
        var cityButton = $('<button class="city-btn"></button>').text(prevSearches[i]);
        $('.prev-search-list').append(cityButton);
    }
}


$(document).ready(function() {

    
    //search button stores the searched city to the array of previously searched cities and stores that array to local storage
    $('.search-btn').click(function(event) {
        event.preventDefault();
        clearToday();
        var city = $('#city-search').val().trim();
        if (city == "") {
            return
        } else if (prevSearches.includes(city)) {
            renderButtons();
        } else if (prevSearches.length >= 10) {
            prevSearches.shift();
            prevSearches.push(city);
        } else {
            prevSearches.push(city);
        }
        
        console.log(prevSearches);
        storingCities(prevSearches);
        getWeatherData(city);   
    })

    $('.city-btn').click(function(event) {
        clearToday();
        event.preventDefault();
        var city = $(this).text();
        getWeatherData(city);
    })

    // storing an array to local storage
    function storingCities(prevSearches) {
        localStorage.setItem("searched-cities", JSON.stringify(prevSearches));
        renderButtons();
    }

    // clears data from previous searches
    function clearToday() {
        $('.current-city').text("");
        $('#temp').text("");
        $('#humidity').text("");
        $('#wind').text("");
        $('#uv').text("");
        $('.fore-temp').text('');
        $('.fore-humidity').text('');
        $('.icon').attr("src", "");
        $('#uv').removeClass();
    }

    // //function for the first 2 api calls. the first call is to get lattitude and longitude of the searched city so the second can get the one call api to get the temperature, humidty, and wind speed
    function getWeatherData(city) {
        var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=260502960360e1be7ff30b2693e2aa94`
        
        fetch(currentWeatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var cityName = data.name;
            var weatherIcon = data.weather[0].icon;
            $('.current-city').append(cityName);
            $(".todaysWeatherIcon").attr("src", `http://openweathermap.org/img/wn/${weatherIcon}.png`);
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            
            var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=260502960360e1be7ff30b2693e2aa94&units=imperial`

            fetch(oneCallUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (cityData) {
                console.log(cityData);
                weatherReport(cityData);
                getFiveDayForecast(cityData);
            })
        })
    }
    
    // //function to populate data for the current city
    function weatherReport(cityData) {
        var cityTemp =  $('<p></p>').text(cityData.current.temp);
        $('#temp').append(cityTemp);
        var cityHum =  $('<p></p>').text(cityData.current.humidity);
        $('#humidity').append(cityHum);
        var cityWind =  $('<p></p>').text(cityData.current.wind_speed);
        $('#wind').append(cityWind);
        var uvIndex =  $('<p></p>').text(cityData.current.uvi);
        $('#uv').append(uvIndex);

        if (uvIndex <= 3) {
            $('#uv').addClass('favorable');
        } else if (uvIndex > 3 && uvIndex < 6)  {
            $('#uv').addClass('moderate');
        } else {
            $('#uv').addClass('severe');
        }
    }

    function getFiveDayForecast(cityData) {
        console.log(cityData);
        var futureTemp = [];
        var futureHum = [];
        var iconArr = [];
        for ( var i = 0; i < 5; i++) {
            futureTemp.push(cityData.daily[i].temp.day);
            futureHum.push(cityData.daily[i].humidity);
            iconArr.push(cityData.daily[i].weather[0].icon);
        }
        var icons = $('.icon').toArray();
        var foreTemps = $('.fore-temp').toArray();
        var foreHum = $('.fore-humidity').toArray();
        for ( var i = 0; i < 5; i++) {
            icons[i].setAttribute("src", `http://openweathermap.org/img/wn/${iconArr[i]}.png`);
            foreTemps[i].append(futureTemp[i]);
            foreHum[i].append(futureHum[i]);
        }
    }
})