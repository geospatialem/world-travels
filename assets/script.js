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
	maxZoom: 20,
	zIndex: 2,
	attribution: "&copy; <a href='https://www.mapbox.com/map-feedback/'>Mapbox</a>, <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>"
});

//Adventures around the Globe
var adventures = L.geoJson(null, {
	//TODO: Create an awesome style
	style: function (feature) {
		return {
			color: '#a50f15',
			opacity: 1
		};
  },
  onEachFeature: function (feature, layer) {
      layer.bindPopup(
				"<p><b>" + feature.properties.Adventure + "</b></p>" +
				"<i>" + feature.properties.Visited + "</i>&#58; " + feature.properties.Description + "<br />" +
				"<a class='zoomToFeature'>Take me there!</a>"
			);
    }
});
$.getJSON("data/adventures.json", function (data) {
  adventures.addData(data);
});

//Cities Visited
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

//Points of Interest, or Major highlights
var majorHighlights = L.geoJson(null, {
	  pointToLayer: L.mapbox.marker.style,
  onEachFeature: function (feature, layer) {
		layer.options.riseOnHover = true; //Rise each feature on hover
		layer.options.title = feature.properties.Name; //Add a title on hover
		//Popup
		if (feature.properties.Image) {
	  layer.bindPopup(
			  "<b>" + feature.properties.Name + "</b><br />" +
			  "<i>" + feature.properties.City + ", " + feature.properties.Region + "</i><br />" +
			  feature.properties.Comments + "<br />" +
			"<img src='photos/" + feature.properties.Image + ".JPG' width='250' height='200'></img><br />"
	   );
	 } else {
		 layer.bindPopup(
				 "<b>" + feature.properties.Name + "</b><br />" +
				 "<i>" + feature.properties.City + ", " + feature.properties.Region + "</i><br />" +
				 feature.properties.Comments + "<br />"
			);
	 } //End popup
  }
});
$.getJSON("data/highlights.json", function (data) {
	majorHighlights.addData(data);
});

//Define the map
var map = L.map('map', {
  center: [0, 0],
  zoom: 2,
  layers: [mbEmerald, mbStreetSat, adventures]
});

// Control button zoom: Alaska
var alaskaButton = L.easyButton('fa-anchor', function(control){
	map.setView([61.68, -149.05], 6);
	this.disable(); //Disables the button on click
}).addTo(map);

// Control button zoom: Italy
var italyButton = L.easyButton('fa-university', function(control){
	map.setView([43.08, 12.53], 7);
	this.disable(); //Disables the button on click
}).addTo(map);

/******************************/
/****** EVENT LISTENERS ******/
/****************************/
// Add or remove layers based on the map zoom, after the zoom has completed.
map.on('zoomend', function () {
	/* Adventures layer */
	if (map.getZoom() > 2 && map.hasLayer(adventures)) { map.removeLayer(adventures); }
	/* Visited cities layer */
	if (map.getZoom() > 7 && map.hasLayer(visitedCities)) { map.removeLayer(visitedCities); }
	if (map.getZoom() <= 7 && map.hasLayer(visitedCities) == false) { map.addLayer(visitedCities); }
	/* Major highlights layer */
	if (map.getZoom() < 6 && map.hasLayer(majorHighlights)) { map.removeLayer(majorHighlights); }
	if (map.getZoom() >= 6 && map.hasLayer(majorHighlights) == false) { map.addLayer(majorHighlights); }
});

// Re-enable the buttons on move.
map.on('move', function(e) {
	alaskaButton.enable();
	italyButton.enable();
});

//Create a zoom to feature on click via the pop-up window
$('#map').on('click', '.zoomToFeature', function(e, layer) {
		map.closePopup(); //Close the popup dialog
		//TODO: On click, zoom to the respective area
		alert('Feature coming soon! In the meantime, try out the buttons in the upper left hand corner.');
		//map.setView([61.68, -149.05], 6); //Alaska
		//map.setView([43.08, 12.53], 7); //Italy
});
