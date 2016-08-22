//Define the selectedLat, and selectedLng arrays
selectedLat = [], selectedLng = [];

//Mapbox Access Token
L.mapbox.accessToken = 'pk.eyJ1IjoiaG9ja2V5ZHVjazMwIiwiYSI6InE4cmFHNlUifQ.X5m_TSatNjZs6Vc7B3_m2A';

//Basemap: Mapbox Emerald (Set at lower zooms)
var mbEmerald = L.tileLayer('https://api.mapbox.com/v4/mapbox.emerald/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaG9ja2V5ZHVjazMwIiwiYSI6InE4cmFHNlUifQ.X5m_TSatNjZs6Vc7B3_m2A', {
	minZoom: 2,
	maxZoom: 7,
	zIndex: 1,
	attribution: "&copy; <a href='https://www.mapbox.com/map-feedback/'>Mapbox</a>, <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>"
});

//Basemap: Mapbox Streets Satellite (Set at higher zooms)
var mbStreetSat = L.tileLayer('https://api.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaG9ja2V5ZHVjazMwIiwiYSI6InE4cmFHNlUifQ.X5m_TSatNjZs6Vc7B3_m2A', {
	minZoom: 8,
	maxZoom: 16,
	zIndex: 2,
	attribution: "&copy; <a href='https://www.mapbox.com/map-feedback/'>Mapbox</a>, <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>"
});

/* Polygon Mouseover Function */
function polygonMouseOver(e) {
	var layer = e.target;
		//Change the polygon style
		e.target.setStyle({
				weight: 4,
				color: '#67000D',
				fillOpacity: 1,
				fillOpacity: 0.7,
				dashArray: ''
		});
		//IE & Opera Browser Support
		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
		}
}

/* Reset Polygon Function */
function resetPolygon(e) {
	adventures.resetStyle(e.target); //Reset the polygon style
}

/* Zoom to Feature Function */
function zoomToFeature(e) {
	adventures.resetStyle(e.target);
	map.fitBounds(e.target.getBounds());
}

/* Adventures around the Globe */
var adventures = L.geoJson(null, {
	style: function (feature) {
		return {
			color: '#a50f15',
			fillColor: '#fc9272',
			dashArray: '3',
			weight: '3',
			opacity: 1
		};
  },
  onEachFeature: function (feature, layer) {
		layer.on({
				mouseover: polygonMouseOver,
				mouseout: resetPolygon,
				click: zoomToFeature
			});
    }
});
$.getJSON("data/adventures.json", function (data) {
  adventures.addData(data);
});

/* Cities Visited */
var visitedCities = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
	  return new L.CircleMarker(latlng, {
      	radius: 5,
      	fillOpacity: 0.85,
      	color: "#000",
      	clickable: false
      });
  },
  onEachFeature: function (feature, layer) {
	  //Popup
	  layer.bindLabel(
			  feature.properties.City, {
				  noHide: true,
					clickable: true
	  });
  }
});
$.getJSON("data/cities.json", function (data) {
  visitedCities.addData(data);
});

/* Points of Interest, or Major highlights */
var majorHighlights = L.geoJson(null, {
	pointToLayer: L.mapbox.marker.style, //Set point style
  onEachFeature: function (feature, layer) {
		if (feature.geometry.type === "LineString") { //Set line style
			layer.setStyle({
				'color': '#39B7CD',
				'opacity': '1'
      });
		}
		layer.on({
			click: hoverColor,
			mouseover: hoverColor,
			mouseout: resetColor,
			popupclose: resetColor
		});
		layer.options.riseOnHover = true; //Rise each feature on hover
		layer.options.title = feature.properties.Name; //Add a title on hover
		//Popup
		if (feature.properties.photoType === "Portrait") {
	  layer.bindPopup(
				"<b>" + feature.properties.Name + "</b> (<i><a class='linkZoomToLocation'>Zoom to location</a></i>) <br />" +
			  "<i>" + feature.properties.City + ", " + feature.properties.Region + "</i><br />" +
			  feature.properties.Comments + "<br />" +
			"<img src='photos/" + feature.properties.Image + ".JPG' width='200' height='250'></img><br />"
	   );
	 } else if (feature.properties.Image) {
	  layer.bindPopup(
				"<b>" + feature.properties.Name + "</b> (<i><a class='linkZoomToLocation'>Zoom to location</a></i>) <br />" +
			  "<i>" + feature.properties.City + ", " + feature.properties.Region + "</i><br />" +
			  feature.properties.Comments + "<br />" +
			"<img src='photos/" + feature.properties.Image + ".JPG' width='250' height='200'></img><br />"
	   );
	 } else {
		 layer.bindPopup(
				 "<b>" + feature.properties.Name + "</b> (<i><a class='linkZoomToLocation'>Zoom to location</a></i>) <br />" +
				 "<i>" + feature.properties.City + ", " + feature.properties.Region + "</i><br />" +
				 feature.properties.Comments + "<br />"
			);
	 } //End popup
  }
});
$.getJSON("data/highlights.json", function (data) {
	majorHighlights.addData(data);
});

//Change the POI color and size, based on user interaction.
//TODO: Refactor to clean this up.
//TODO: Get the marker-symbol to work with the original field (marker-symbol)
function hoverColor () {
	if (this instanceof L.Path) { //If the feature is a polyline:
		this.setStyle({
    	color: '#D73027',
			weight: '7'
		});
	} else { //Else, points:
		this.setIcon(L.mapbox.marker.icon({
			'marker-color': '#D73027',
			'marker-size': 'large',
			'marker-symbol': this.feature.properties.iconSymbol
		}));
	}
}

//Reset the POI color and size, based on user interaction.
//TODO: Refactor to clean this up.
//TODO: Get the marker-symbol to work with the original field (marker-symbol)
function resetColor () {
	if (this instanceof L.Path) { //If the feature is a polyline:
		this.setStyle({
			color: '#39B7CD',
			opacity: '1',
			weight: '5'
		});
	} else { //Else, points:
		this.setIcon(L.mapbox.marker.icon({
			'marker-color': '#39B7CD',
			'marker-size': 'medium',
		  'marker-symbol': this.feature.properties.iconSymbol
		}));
	}
}

/* MAP */
var map = L.map('map', {
  center: [0, 0],
  zoom: 2,
	zoomControl: false,
  layers: [mbEmerald, mbStreetSat, adventures],
	minZoom: 2,
	maxZoom: 16
});

//Add a zoom control with a home button
var zoomControlHome = L.Control.zoomHome({
	position: 'topright'
}).addTo(map);

/* COORDINATE HASH */
var hash = new L.Hash(map);

/* EVENT LISTENERS */
//Accessibility improvement to add an <alt> tag to the basemap tiles
//TODO: Add accessibility on map movement for tiles
$(document).on('ready', function(){
    addMapTileAttr('.leaflet-tile-pane img')
});

function addMapTileAttr(styleClass) {
    var selector = $(styleClass);
    selector.each(
    	function(index) { $(this).attr('alt',"Map tile image " + index); }
		);
}

// Add or remove layers based on the map zoom, after the zoom has completed.
map.on('zoomend', function () {
	/* Adventures layer */
	if (map.getZoom() > 4 && map.hasLayer(adventures)) { map.removeLayer(adventures); }
	if (map.getZoom() == 4 && map.hasLayer(adventures) == false) { map.addLayer(adventures); }
	/* Visited cities layer */
	if (map.getZoom() <= 4 && map.hasLayer(visitedCities)) { map.removeLayer(visitedCities); }
	if (map.getZoom() >= 5 && map.getZoom() < 7 && map.hasLayer(visitedCities) == false) { map.addLayer(visitedCities); }
  if (map.getZoom() >= 8 && map.hasLayer(visitedCities)) { map.removeLayer(visitedCities); }
	/* Major highlights layer */
	if (map.getZoom() < 6 && map.hasLayer(majorHighlights)) { map.removeLayer(majorHighlights); }
	if (map.getZoom() >= 6 && map.hasLayer(majorHighlights) == false) { map.addLayer(majorHighlights); }
});

// Add or remove layers when returning to the 'home' state
$('.leaflet-control-zoomhome-home').on('click', function(e) {
	if (map.hasLayer(adventures) == false) { map.addLayer(adventures); }
});

// Popup enhnacements once opened
map.on('popupopen', function(e) {
		//Center the map when pop-up is opened
    $(this).addClass("active");
		var projX = map.project(e.popup._latlng);
    	projX.y -= e.popup._container.clientHeight/2
	    	map.panTo(map.unproject(projX),{
					animate: true
				});
			//Set the lat/long from the pop-up to the selectedLat and selectedLng arrays (used in the zoomToLocation) pop-up.
			selectedLat = e.popup._latlng.lat;
			selectedLng = e.popup._latlng.lng;
});

/* Pop-up zoomToLocation Link: Grab the opened pop-up coordinates, and add them to the variables below. */
$('#map').on('click', '.linkZoomToLocation', function(e) {
	map.setView([selectedLat, selectedLng], 16); //[lat,lng], zoomLevel
	map.closePopup(); //Close the popup
});

/* Sidebar */
var sidebar = L.control.sidebar('sidebar').addTo(map);

sidebar.open('home'); // Open the Sidebar Home, by default

/* Sidebar Event Listeners */

// Alaska
$('#openAlaskaTabBtn, #openAlaskaTabBtn2').on('click', function(e) {
	sidebar.open('alaska');
});

$('#travelAlaskaBtn').on('click', function(e) {
	sidebar.close();
	map.setView([61.68, -149.05], 6);
});

// Italia
$('#openItaliaTabBtn, #openItaliaTabBtn2').on('click', function(e) {
	sidebar.open('italia');
});

$('#travelItaliaBtn').on('click', function(e) {
	sidebar.close();
	map.setView([43.08, 12.53], 7);
});
