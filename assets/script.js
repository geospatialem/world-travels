//Basemap: CartoDB
var cartoBasemap = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19
});

//Alaska Cities Visited
var alaskaCities = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
	  return new L.CircleMarker(latlng, {
      	radius: 5, 
      	fillOpacity: 0.85,
      	color: "#000"
      });
  },
  onEachFeature: function (feature, layer) {
	  //Popup
	  layer.bindPopup(
			  "<b>" + feature.properties.City + "</b><br />" +
			  "Days: " + feature.properties.Days + "<br />" +
			  "Nights: " + feature.properties.Nights
	   );
  }
});
$.getJSON("data/cities.json", function (data) {
  alaskaCities.addData(data);
});

//Alaska Trip Highlight POI's
var alaskaHighlights = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
	  return new L.Marker(latlng, {
		  title: feature.properties.Name
	  });
  },
  onEachFeature: function (feature, layer) {
	  //Popup
	  layer.bindPopup(
			  "<b>" + feature.properties.Name + "</b><br />" + 
			  "<i>" + feature.properties.City + ", AK </i><br />" +
			  feature.properties.Comments
	   );
  }
});
$.getJSON("data/highlights.json", function (data) {
  alaskaHighlights.addData(data);
});

//Define the map
var map = L.map('map', {
  center: [64.20, -149.49],
  zoom: 5,
  layers: [cartoBasemap, alaskaCities, alaskaHighlights]
});
//Zoom to the GeoJSON on load
map.on("layeradd", function (e) { 
	map.fitBounds(alaskaCities);
});
