var $origin = $('#origin');
var $destination = $('#destination');
var $start = $('#start');
var $days = $('#days');
var $daysAdd = $('#days-add');
var $daysSub = $('#days-sub');
var $results = $('#results');
var $resultsBadge = $('#results-badge');

function formatDate (date) {
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  return day + '/' + month + '/' + year;
}

function updateResults(response) {
  var flights = response.data;

  $results.html('');
  $resultsBadge.html(flights.length);

  for (var i = 0; i < flights.length; i++) {
    var flight = flights[i];

    var from = flight.cityFrom;
    var to = flight.cityTo;
    var duration = flight.fly_duration;
    var price = flight.price;
    var distance = flight.distance;

    var $flight = $('<div/>')
      .addClass('col-lg-3 col-md-4 col-sm-6')
      .html(
        '<article class="flight">'
        + '<h3><span>' + from + '</span> ' + to + '</h3>'
        + '<small>' + duration + ', ' + distance + 'km</small><br/>'
        + '<var class="price badge badge-primary">' + price + 'EUR</var>'
        + '</article>'
      );

    $results.append($flight);
  }
}

function fetchResults () {
  $results.html('<div class="col"><p class="loading">Fetching results</p></div>');
  $resultsBadge.html('...');

  var origin = $origin.val();
  var destination = $destination.val();
  var start = parseInt($start.val());
  var days = parseInt($days.val());

  var dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() + start);

  var dateTo = new Date();
  dateTo.setDate(dateFrom.getDate() + days);

  $.ajax({
    url: 'https://api.skypicker.com/flights',
    data: {
      v: 2,
      locale: 'en',
      flyFrom: origin,
      to: destination,
      dateFrom: formatDate(dateFrom),
      dateTo: formatDate(dateTo),
    },
  }).done(updateResults);
}

$daysAdd.click(function () {
  var value = parseInt($days.val());
  $days.val(value + 1);

  fetchResults();
});

$daysSub.click(function () {
  var value = parseInt($days.val());

  if (value > 0) {
    $days.val(value - 1);
  }

  fetchResults();
});

$origin.change(fetchResults);
$destination.change(fetchResults);
$start.change(fetchResults);
$days.keydown(fetchResults);

fetchResults();
