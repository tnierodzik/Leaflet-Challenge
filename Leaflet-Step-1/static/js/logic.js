console.log("hello")

// Creating map object
var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 8
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 550,
  maxZoom: 4,
  zoomOffset: -1,
  id: "mapbox/satellite-streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url, function(data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    style: function(feature) {
        return {
          radius: markerSize(feature.properties.mag),
          fillColor: colorScale(feature.properties.mag)
        }
    }
  }).addTo(myMap);
});


//  // Binding a pop-up to each layer
// function onEachFeature(feature, layer) {
//         layer.bindPopup("Zip Code: " + feature.properties.place + "<br>Median Household Income:<br>" +
//             "$" + feature.properties.MHI2016);
// }

//     // Create a new marker cluster group
//     var markers = L.markerClusterGroup();

//         for (var i = 0; i < response.length; i++) { 

//             var location = response.features[i];

//             if (location) {

//                 // Add a new marker to the cluster group and bind a pop-up
//                 markers.addLayer(L.marker([location.geometry.coordinates[1], location.geometry.coordinates[0]])
//                     .bindPopup(response[i].descriptor));  

//         }
//     }

//   // Add our marker cluster layer to the map
//   myMap.addLayer(markers);