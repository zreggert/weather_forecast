var today = moment();
$('.presentDate').text(moment().format('LLLL'));


function getApi() {
    var city = $('#city-search').val();
    var requestCityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8e6bbaa303018ff985f1c5b1e722b099`;
    console.log(city);
    fetch(requestCityUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (cityData) {
        console.log(cityData)
        var cityName = $('<h2></h2>').text(cityData.name);
        $('.currentCity').append(cityName);
    })

}



$(document).ready(function() {
    $('.searchBtn').click(function() {
        event.preventDefault();
        let inputElement = $('#city-search').val();
        console.log(inputElement);
        var prevSearch = $('<li></li>').text(inputElement);
        $('.prevSearchList').append(prevSearch);
        getApi();
    })
})

