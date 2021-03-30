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
        console.log(city);
        if (city == "") {
            return
        } else if (prevSearches.length >= 10) {
            prevSearches.shift();
            prevSearches.push(city);
        } else {
            prevSearches.push(city);
        }
        
        console.log(prevSearches);
        storingCities(prevSearches);
        getWeatherData(city);
        renderButtons();
    })

    // storing an array to local storage
    function storingCities(prevSearches) {
        localStorage.setItem("searched-cities", JSON.stringify(prevSearches));
    }

    // clears data from previous searches
    function clearToday() {
        $('.current-city').text("");
        $('#temp').text("");
        $('#humidity').text("");
        $('#wind').text("");
        $('#uv').text("");
    }

    // //function for the first 2 api calls. the first call is to get lattitude and longitude of the searched city so the second can get the one call api to get the temperature, humidty, and wind speed
    function getWeatherData(city) {
        console.log(city);
        var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=260502960360e1be7ff30b2693e2aa94`
        
        fetch(currentWeatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var cityName = data.name;
            $('.current-city').append(cityName);
            var lat = data.coord.lat
            //console.log(lat);
            var lon = data.coord.lon
            //console.log(lon);

            var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=260502960360e1be7ff30b2693e2aa94&units=imperial`

            fetch(oneCallUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (cityData) {
                console.log(cityData)
                weatherReport(cityData);
            })
        })
    }
    
    // //function to populate data for the current city
    function weatherReport(cityData) {
        var cityTemp =  $('<p></p>').text(cityData.current.temp);
        console.log(cityTemp);
        $('#temp').append(cityTemp);
        var cityHum =  $('<p></p>').text(cityData.current.humidity);
        console.log(cityHum);
        $('#humidity').append(cityHum);
        var cityWind =  $('<p></p>').text(cityData.current.wind_speed);
        console.log(cityWind);
        $('#wind').append(cityWind);
        var uvIndex =  $('<p></p>').text(cityData.current.uvi);
        console.log(cityWind);
        $('#uv').append(uvIndex);
        getFiveDayForecast(cityData);
    }

    function getFiveDayForecast(cityData) {
        console.log(cityData);
        var cards = $('.weather-card').toArray();
        cards.forEach(element => {
            for ( i = 0; i < 5; i++) {
            var futureTemp = $("<h4></h4>").text(cityData.daily[i].temp);
            console.log(futureTemp);
            $(element).append(futureTemp)
            var futureHum = $("<h4></h4>").text(cityData.daily[i].humidity);
            console.log(futureHum);
            $(element).append(futureHum)
        }
        })
        // for ( i = 0; i < 5; i++) {
        //     var futureTemp = $("<h4></h4>").text(cityData.daily[i].temp);
        //     console.log(futureTemp)
        //     var futureHum = $("<h4></h4>").text(cityData.daily[i].humidity);
            
        //     if ( i = 0) {
        //         $("#card1").append(futureTemp, futureHum)
        //     }
        //}
    }
})