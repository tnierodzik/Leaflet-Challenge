// URL for Earthquake Data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// URL for Tectonic Plate Data
var tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// Create Function for colour Scale
function getColor(d) {
  return  d > 10000 ? '#BD0026' :
          d > 90    ? '#E31A1C' :
          d > 70    ? '#FC4E2A' :
          d > 50    ? '#FD8D3C' :
          d > 30    ? '#FEB24C' :
          d > 10    ? '#FED976' :
                      '#1a9850';    
}

function createFeatures(earthquakeData) {

// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + (feature.properties.type).toUpperCase() +
      "</h3><hr><p><a>Time: </a>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p><a>Location: </a>" + feature.properties.place + "</p>" +
      "</h3><hr><p><a>Magnitude: </a>" + feature.properties.mag + "</p>");
  }

// Create a GeoJSON layer containing the features array on the earthquakeData object
// Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var style = {
      radius: 3*(feature.properties.mag),
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "Black",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
      };
      return L.circleMarker(latlng, style);
  }
  });

// Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

// Define Dark Map layer
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
  });

// Define Light Map layer
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });
  
// Define Satellite Map layer
  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-streets-v11",
    accessToken: API_KEY
  });

// Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap,
    "Satellite" : satellitemap
  };

  // Define layer for the tectonic plates
  var tectonicPlates = new L.LayerGroup();

// Create overlay object to hold our layers
  var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plates": tectonicPlates
  };

// Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      36.756107, -1.030593
    ],
    zoom: 2,
    layers: [darkmap, earthquakes, tectonicPlates]
  });

// Add Fault lines data
    d3.json(tectonicPlatesURL, function(plateData) {
      
// Adding our geoJSON data, along with style information, to the tectonicplates

      L.geoJson(plateData, {
        color: "#4292c6",
        weight: 3,
        dashArray: "5 5"
      })
      .addTo(tectonicPlates);
  });

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var leg = L.DomUtil.create('leg', 'info legend'),
        colourscale = [-10,10,30,50,70,90],
        labels = [];

// loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < colourscale.length; i++) {
        leg.innerHTML +=
            '<i style="background:' + getColor(colourscale[i] + 1) + '"></i> ' +
            colourscale[i] + (colourscale[i + 1] ? '&ndash;' + colourscale[i + 1] + '<br>' : '+');
    }

    return leg;
};

legend.addTo(myMap);

}