var lastSearch;
var prevSearched = [];
var currentDate = moment().format('MM/DD/YYYY');

var weatherEl = $('#weather-content-id');
var weather5Day = $('.five-day-forecast');
var weatherIconEl = $("#weather-content-icon-id");
var weatherCityEl = $("#weather-content-city-id");
var weatherTempEl = $('#weather-content-temp-id');
var weatherHumidEl = $('#weather-content-humidity-id');
var weatherWindEl = $('#weather-content-windspeed-id');
var weatherUvIndexEl = $('#weather-content-uvindex-id');

$(document).ready(function () {
    
    if (localStorage.getItem('lastSearch')) {
        prevSearched = JSON.parse(localStorage.getItem('prevSearched'));
        lastSearch = localStorage.getItem('lastSearch');
        getWeather(lastSearch);
    };

    //render the items on the list and the most recently searched term
    function renderList() {

        $('#input-search-id').val('');
        $('#list-search-id').empty();
        $("[class^='forecast-card']").empty();


        $.each(prevSearched, function (index, value) {
            var newListItem = $('<li>').addClass('list-group-item').text(value);
            $('#list-search-id').append(newListItem);
        });
    };

    //call the OpenWeather API and retrieve it's object
    function getWeather(city) {

        var APIkey = 'a41a22c92514a42b4ee583b6e06ed00d';
        var queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + APIkey;

        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            console.log(response);

            weatherEl.removeClass('d-none');
            weather5Day.removeClass('d-none');

            weatherIconEl.attr('src', 'http://openweathermap.org/img/wn/' + response.list[0].weather[0].icon + '.png');
            weatherCityEl.text(response.city.name + " (" + currentDate + ")");
            weatherTempEl.html("Temperature: " + Math.floor((response.list[0].main.temp - 273.15) * 9 / 5 + 32) + " &degF");
            weatherHumidEl.text("Humidity: " + response.list[0].main.humidity + "%");
            weatherWindEl.text("Wind Speed: " + response.list[0].wind.speed + " MPH");

            for (let i = 1; i < 6; i++) {
                var forecastCard = $('.forecast-card-' + i);
                
                var cardDate = moment().add(i, 'days').format('MM/DD/YYYY');

                var forecastDate = $('<h5>').text(cardDate);
                var forecastIcon = $('<img>').attr('src', 'http://openweathermap.org/img/wn/' + response.list[i].weather[0].icon + '.png');
                var forecastTemp = $('<p>').html("Temperature: " + Math.floor((response.list[i].main.temp - 273.15) * 9 / 5 + 32) + " &degF");
                var forecastHumid = $('<p>').text("Humidity: " + response.list[i].main.humidity + "%");

                forecastCard.append(forecastDate, forecastIcon, forecastTemp, forecastHumid);

            }

            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/uvi?lat=" + response.city.coord.lat + "&lon=" + response.city.coord.lon + "&appid=" + APIkey,
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

    $('#list-search-id').on('click', '.list-group-item', function () {
        getWeather($(this).text());
        lastSearch = $(this).text();
        localStorage.setItem('lastSearch', lastSearch);

        renderList();
    });

    renderList();

});