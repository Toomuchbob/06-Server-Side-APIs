// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity

var lastSearch;
var prevSearched = [];
var currentDate = moment().format('MM/DD/YYYY');

var weatherEl = $('#weather-content-id');
var weatherIconEl  = $("#weather-content-icon-id");
var weatherCityEl  = $("#weather-content-city-id");
var weatherTempEl  = $('#weather-content-temp-id');
var weatherHumidEl = $('#weather-content-humidity-id');
var weatherWindEl  = $('#weather-content-windspeed-id');
var weatherUvIndexEl = $('#weather-content-uvindex-id');

$(document).ready(function () {

    //render the items on the list and the most recently searched term
    function renderList() {

        $('#input-search-id').val('');
        $('#list-search-id').empty();

        if (localStorage.getItem('lastSearch')) {
            prevSearched = JSON.parse(localStorage.getItem('prevSearched'));
            lastSearch = localStorage.getItem('lastSearch');
            getWeather(lastSearch);
        };

        $.each(prevSearched, function (index, value) {
            var newListItem = $('<li>').addClass('list-group-item').text(value);
            $('#list-search-id').append(newListItem);
        });
    };

    //call the OpenWeather API and retrieve it's object
    function getWeather(city) {

        var APIkey = 'a41a22c92514a42b4ee583b6e06ed00d';
        var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIkey;

        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {

            weatherEl.removeClass('d-none');

            weatherIconEl.attr('src', 'http://openweathermap.org/img/wn/' + response.weather[0].icon + '.png');
            weatherCityEl.text(response.name + " (" + currentDate + ")");
            weatherTempEl.html("Temperature: " + Math.floor((response.main.temp - 273.15) * 9 / 5 + 32) + " &degF");
            weatherHumidEl.text("Humidity: " + response.main.humidity + "%");
            weatherWindEl.text("Wind Speed: " + response.wind.speed + " MPH");

            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=" + APIkey,
                method: 'GET'
            }).then(function (uvResponse) {

                var uvIndex = uvResponse.value;
                $('#weather-content-uvindex-span-id').text(uvIndex);

                if (uvIndex < 3) {
                    weatherUvIndexEl.addClass('bg-success');
                } else if (uvIndex > 5) {
                    weatherUvIndexEl.addClass('bg-danger');
                } else {
                    weatherUvIndexEl.addClass('bg-warning');
                };

            });
        });

    };

    //when the search term is submitted
    $('body').on('submit', function () {
        event.preventDefault();
        lastSearch = $('#input-search-id').val();

        getWeather(lastSearch);

        if (prevSearched.indexOf(lastSearch) === -1) {
            prevSearched.push(lastSearch);

            localStorage.setItem('lastSearch', lastSearch);
            localStorage.setItem('prevSearched', JSON.stringify(prevSearched));
        };

        renderList();
    });

    $('#list-search-id').on('click', '.list-group-item', function() {
        getWeather($(this).text());
        lastSearch = $(this).text();
        localStorage.setItem('lastSearch', lastSearch);
    });

    renderList();

});