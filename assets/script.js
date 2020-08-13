// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast
var prevSearched = [];

$(document).ready(function () {

    $('body').on('submit', function () {
        event.preventDefault();
        var lastSearch = $('#input-search-id').val();
        console.log(prevSearched);

        prevSearched.push(lastSearch);

        localStorage.setItem('lastSearch', lastSearch);
        localStorage.setItem('prevSearched', JSON.stringify(prevSearched));

        renderList();
    });

    function renderList() {
        $('#input-search-id').val('');
        $('#list-search-id').empty();

        if (localStorage.getItem('prevSearched')) {
            prevSearched = JSON.parse(localStorage.getItem('prevSearched'));
        };

        $.each(prevSearched, function(index, value) {
            var newListItem = $('<li>').addClass('list-group-item').text(value);
            $('#list-search-id').append(newListItem);
        });
        //search for lastSearch city and populate contents
    }
    renderList();

});