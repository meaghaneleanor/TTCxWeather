'use strict';

var app = {};

app.closeStreetCar = '';
app.goodPizza = '';
app.userLocation = '';
app.x = 43.6482172;
app.y = -79.39789979999999;
app.vehicleInfo = [];
app.longNames = [];

$(function () {
	app.init();
	$('#end').val('121 Major Street, Toronto');
});

app.init = function () {
	app.getGeolocation();

	$('form').on('submit', function (e) {
		e.preventDefault();
		console.log('yolo');
		app.start = app.userLocation;
		app.end = $('input#end').val();
		app.initMap();
		app.calculateAndDisplayRoute(app.directionsService, app.directionsDisplay);
		app.getNearestTTCTime();
	});
};

/////////////////////////
/////////TTC API/////////
/////////////////////////
app.getGeolocation = function () {

	//if geolocation is available, store longitude and latitutde co-ordinates to put into TTC Ajax call
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {

			app.x = position.coords.latitude;
			app.y = position.coords.longitude;
			app.userLocation = app.x + ', ' + app.y;

			$.ajax({
				url: 'http://myttc.ca/near/' + app.x + ',' + app.y + '.json',
				method: 'GET',
				dataType: 'jsonp'
			}).then(function (TTCinfo) {
				// console.log(TTCinfo.locations);
				// console.log(app.userLocation);
				// console.log(TTCinfo.locations[0].uri);
				// app.TTCinfo = TTCinfo.locations[0].uri;
				app.getTimeforTTC(TTCinfo.locations[0].uri);
				// console.log(TTCinfo.locations[0].uri);
			});
		});
		//if geolocation isn't available or the user doesn't accept
	} else {
			console.log('Nope!');
		};
};

app.getNearestTTCTime = function () {
	// app.bestTrain();
	app.vehicleInfo.forEach(function (val, i) {
		console.log();
	});
};

app.getTimeforTTC = function (newTTCinfo) {

	var TTCVehicleURL = 'http://myttc.ca/vehicles/near/' + newTTCinfo + '.json';
	console.log(TTCVehicleURL);
	$.ajax({
		url: TTCVehicleURL,
		method: 'GET',
		dataType: 'jsonp'
	}).then(function (vehicleInfo) {
		vehicleInfo.vehicles.forEach(function (val, i) {
			app.vehicleInfo.push(val);
		});
	});
};

app.getTrain = function (v) {

	var item = $('table.adp-directions tr:nth-child(2) td div')[0];
	var pizza = $(item).find('span:last-child').text();

	if (pizza.length > 0) {
		var splitPizza = pizza.split('- ');
		app.goodPizza = splitPizza[1];
	}

	for (var i = 0; i < app.longNames.length; i++) {
		if (app.longNames[i] == app.goodPizza) {
			console.log("this is the streetcar we want " + app.longNames[i]);
			app.closeStreetCar = app.longNames[i];
		}
	}
};

app.bestTrain = function () {
	app.vehicleInfo.forEach(function (val, i) {
		var preLongName = val.long_name;
		var split = preLongName.split('To');
		var finalLongName = split.join('Towards');
		app.longNames.push(finalLongName);
	});
	app.getTrain();
};

//////////////////////////
////////GOOGLE MAPS///////
//////////////////////////
app.initMap = function () {
	app.directionsService = new google.maps.DirectionsService();
	app.directionsDisplay = new google.maps.DirectionsRenderer();
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 17,
		center: { lat: app.x, lng: app.y }
	});

	app.directionsDisplay.setMap(map);
	app.directionsDisplay.setPanel(document.getElementById('right-panel'));

	var control = document.getElementById('floating-panel');
	// control.style.display = 'block';
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
};

app.calculateAndDisplayRoute = function () {
	app.directionsService.route({
		origin: app.start,
		destination: app.end,
		travelMode: google.maps.TravelMode.TRANSIT
	}, function (response, status) {
		if (status === google.maps.DirectionsStatus.OK) {
			app.directionsDisplay.setDirections(response);
			//Call setInterval, store it in a var
			// it will return an id that we need to clear
			var interval = setInterval(function () {
				//If selector gets something
				if ($('.adp-directions').length > 0) {
					//Clear the interval
					clearInterval(interval);
					//get train
					app.getTrain();
				}
			}, 100);
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});
};

////////////////////////
///////WUNDERGROUND/////
////////////////////////

app.latitude = 43.7000;
app.longitude = -79.4000;

app.weatherKey = 'e4190875c1187be4';
app.weatherURL = 'http://api.wunderground.com/api/' + app.weatherKey + '/conditions/q/' + app.latitude + ',' + app.longitude + '.json';
app.getWeather = function () {
	$.ajax({
		url: app.weatherURL,
		method: 'GET',
		dataType: 'json'

	}).then(function (info) {
		// console.log(info);
	});
};

// Updated upstream

app.getWeather();

// Stashed changes

/////////////////////PSUEDO CODE/////////////////////

// Collect user's starting location using geolocation

// Display the current weather conditions

// Change the css of the logo icon to correspond with the weather conditions 

// Collect the user's desired destination

//TTC - using the "name" from the first ajax call pass it into a second to get "vehicles near name" - take the velocity and distance and figure out how far away the streetcar is

// Display how long it will take to get them from point a - b if they walk and if they take the TTC

// from what the user selects (walking or ttc) store selected travel mode in a variable to be passed through google for the route map (conditional statements)

// WALKING - display a route map with detailed directions getting them from a - b

// TTC - display a route map

// Give the user the option to change their mind and view directions/ route of the other travel mode
//# sourceMappingURL=main.js.map
