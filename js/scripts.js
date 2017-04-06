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


//set up styles for poverty choropleth

function getColor(d) {
	return 	d > 46 ?	'#BD0026' :
			d > 34 ? 	'#F03B20' :
			d > 24 ?	'#FD8D3C' :
			d > 14 ? 	'#FECC5C' :
						'#FFFFB2';
}

function style(feature){
	return{
		fillColor: getColor(feature.properties.PercPov),
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7
	};
}

//add poverty choropleth to map
var poverty = L.geoJson(neighborhoods, {style: style}).addTo(map);


//set up styles for nonwhite choropleth

function getColor2(d) {
	return 	d > 85 ?	'#006D2C' :
			d > 64.5 ? 	'#2CA25F' :
			d > 41.5 ?	'#66C2A4' :
			d > 21 ? 	'#B2E2E2' :
						'#EDF8FB';
}

function style2(feature){
	return{
		fillColor: getColor2(feature.properties.PercNW),
		weight: 1,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7
	};
}

//add poverty choropleth to map
var nonwhite = L.geoJson(neighborhoods, {style: style2}).addTo(map);

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
        //radius: getRadius(feature),
        radius: 3,
        fillColor: "deepskyblue",
        color: "gray",
        weight: 2,
        opacity: .05,
        fillOpacity: 0.8,
        z: 1
      };

      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
//}).bindPopup(function (layer) {
//    return (' Total number of docks in kiosk: ' + layer.feature.properties.totalDocks +
//    		' Docks currently available: ' + layer.feature.properties.docksAvailable + 
//     		' Bikes currently available: ' + layer.feature.properties.bikesAvailable);  
}).addTo(map);

//define base and overlay layers for control

var baseLayers = {
	"Neighborhoods - percent in poverty": poverty,
	"Neighborhoods - percent not white": nonwhite
};

var overlays = {
	"Half Mile Walking Buffer": bufferOutline,
	"Indego Kiosks": stationMarkers
};
//add control to map
L.control.layers(baseLayers,overlays,{
	collapsed:false,
	position:'bottomright'
}).addTo(map);


// Set up an invisible neighborhoods layer.  
//   This will allow users to click on neighborhoods for info
var neighborhoodinfo = L.geoJson(neighborhoods, {
	opacity: 0,
	fillOpacity: 0
}).addTo(map);
