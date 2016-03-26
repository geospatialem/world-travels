//Mapbox Access Token
L.mapbox.accessToken = 'pk.eyJ1IjoiaG9ja2V5ZHVjazMwIiwiYSI6InE4cmFHNlUifQ.X5m_TSatNjZs6Vc7B3_m2A';

//Basemap: Mapbox Emerald
var mbEmerald = L.tileLayer(
		'https://api.mapbox.com/v4/mapbox.emerald/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaG9ja2V5ZHVjazMwIiwiYSI6InE4cmFHNlUifQ.X5m_TSatNjZs6Vc7B3_m2A', {
			attribution: "&copy; <a href='https://www.mapbox.com/map-feedback/'>Mapbox</a>, <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>"
		});

//Basemap: Mapbox Streets Satellite
var mbStreetSat = L.tileLayer(
		'https://api.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaG9ja2V5ZHVjazMwIiwiYSI6InE4cmFHNlUifQ.X5m_TSatNjZs6Vc7B3_m2A', {
			attribution: "&copy; <a href='https://www.mapbox.com/map-feedback/'>Mapbox</a>, <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>"
		});

//Alaska Cities Visited
var alaskaCities = L.geoJson(null, {
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
				  noHide: true
	  });
  }
});
$.getJSON("data/cities.json", function (data) {
  alaskaCities.addData(data);
});

//Alaska Trip Highlight POI's
var alaskaHighlights = L.geoJson(null, {
	  pointToLayer: L.mapbox.marker.style,
  onEachFeature: function (feature, layer) {
		layer.options.riseOnHover = true; //Rise each feature on hover
		layer.options.title = feature.properties.Name; //Add a title on hover
		//Popup
		if (feature.properties.Image) {
	  layer.bindPopup(
			  "<b>" + feature.properties.Name + "</b><br />" +
			  "<i>" + feature.properties.City + ", AK </i><br />" +
			  feature.properties.Comments + "<br />" +
			"<img src='photos/" + feature.properties.Image + ".JPG' width='250' height='200'></img><br />"
	   );
	 } else {
		 layer.bindPopup(
				 "<b>" + feature.properties.Name + "</b><br />" +
				 "<i>" + feature.properties.City + ", AK </i><br />" +
				 feature.properties.Comments + "<br />"
			);
	 }
  }
});
$.getJSON("data/highlights.json", function (data) {
	alaskaHighlights.addData(data);
});

//Define the map
var map = L.map('map', {
  center: [64.20, -149.49],
  zoom: 5,
  layers: [mbEmerald, alaskaCities, alaskaHighlights]
});

//Legend: Define Basemap and Overlay Layers
var baseMaps = {
		"Streets": mbEmerald,
		"Satellite": mbStreetSat
};

var overlayMaps = {
		"Cities": alaskaCities,
		"Trip Highlights": alaskaHighlights
};

//Collapse the legend
if (document.body.clientWidth <= 767) {
	isCollapsed = true;
} else {
	isCollapsed = false;
}

//Legend: Add the Control to the map (Basemap and Overlay layers)
L.control.layers(baseMaps, overlayMaps, {
	collapsed: isCollapsed
}).addTo(map);
