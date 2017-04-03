//instantiate map into container with set view
var map = L.map('mapcontainer', {
	scrollWheelZoom: false,
}).setView([40.007960, -75.125049], 11);
//add carto light basemap
//var layer =  
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
      }).addTo(map);

var neighborhoods = L.geoJson(neighborhoods, {
	style: function getColor (feature) {
		if (feature.properties.PercPov > 40) return 'red';
		if (feature.properties.PercPov > 0) return 'blue';

		//return d > 40 ? 'orange' :
		//				'blue';
		function style(feature) {
			return {
				fillColor: getColor(feature.properties.PercPov),
				weight: 1
			};
		}
	}
}).addTo(map);

var bufferOutline = L.geoJson(buffer).addTo(map);

var stationMarkers = L.geoJson(stations, {
    pointToLayer: function (feature, latlng) {


    //create dynamic circle marker radius based on the number of docks at a station
      function getRadius(feature) {
        if (feature.properties.totalDocks > 20) return 10;
        if (feature.properties.totalDocks > 15) return 7.5;
        if (feature.properties.totalDocks > 10) return 5;
        if (feature.properties.totalDocks > 5) return 2.5;
        if (feature.properties.totalDocks > 0) return 1;
      }

      var geojsonMarkerOptions = {
        radius: getRadius(feature),
        //radius: 10,
        fillColor: "deepskyblue",
        color: "gray",
        weight: 2,
        opacity: .05,
        fillOpacity: 0.8
      };

      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).bindPopup(function (layer) {
    return (' Total number of docks in kiosk: ' + layer.feature.properties.totalDocks +
     		' Docks currently available: ' + layer.feature.properties.docksAvailable + 
     		' Bikes currently available: ' + layer.feature.properties.bikesAvailable);  
}).addTo(map);