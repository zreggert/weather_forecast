var today = moment();
$('.present-date').text(moment().format('LLLL'));
var prevSearches = JSON.parse(localStorage.getItem('searched-cities')) || [];

var dayOne = $('<h4></h4>').text(moment().add(1, 'days').format('L'));
$('#card1').append(dayOne);
var dayTwo = $('<h4></h4>').text(moment().add(2, 'days').format('L'));
$('#card2').append(dayTwo);
var dayThree = $('<h4></h4>').text(moment().add(3, 'days').format('L'));
$('#card3').append(dayThree);
var dayFour = $('<h4></h4>').text(moment().add(4, 'days').format('L'));
$('#card4').append(dayFour);
var dayFive = $('<h4></h4>').text(moment().add(5, 'days').format('L'));
$('#card5').append(dayFive);


$(document).ready(function() {

    //search button stores the searched city to the array of previously searched cities and stores that array to local storage
    $('.search-btn').click(function() {
        event.preventDefault();
        clearToday();
        var city = $('#city-search').val().trim();
        //console.log(inputCity);
        if (city == "") {
            return
        } else if (prevSearches.length >= 10) {
            prevSearches.shift();
            prevSearches.push(city);
        } else {
            prevSearches.push(city);
        }
        
        storingCities(city);
        getWeatherData(city);
        renderButtons(prevSearches);
    })

    function storingCities(city) {
        localStorage.setItem("searched-cities", JSON.stringify(city));
    }

    function clearToday() {
        $('.current-city').text("");
        $('#temp').text("");
        $('#humidity').text("");
        $('#wind').text("");
        $('#uv').text("");
    }

    //function for the first 2 api calls. the first call is to get lattitude and longitude of the searched city so the second can get the one call api to get the temperature, humidty, and wind speed
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
                getFiveDayForecast(cityData);
            })
        })
    }
    
    //function to populate data for the current city
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
    }

    function getFiveDayForecast(cityData) {
        for ( i = 0; i < 5; i++) {
            var futureTemp = $("<h4></h4>").text(cityData.daily[i].temp);
            var futureHum = $("<h4></h4>").text(cityData.daily[i].humidity);
            
            if ( i = 0) {
                $("#card1").append(futureTemp, futureHum)
            }
        }
    }

    function renderButtons(prevSearches) {
        $('.prev-search-list').empty();
        for (var i = 0; i < prevSearches.length; i++) {
            var cityButton = $('<a class="city-btn"></a>').text(prevSearches[i]);
            $('.prev-search-list').append(cityButton);
        }
    }
})




    






