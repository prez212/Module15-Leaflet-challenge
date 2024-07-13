// Initialize the map
let myMap = L.map("map", {center: [20, 0], zoom: 2});

// Add a tile layer (background map image) to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });

 // Function to determine marker color based on earthquake depth
 function markerColor(depth) {
    if (depth > 90) return "#CC0000";
    else if (depth > 70) return "#FF3333";
    else if (depth > 50) return "#FF6200";
    else if (depth > 30) return "#00F3FF";
    else if (depth > 10) return "1BFB00";
    else return "#00CC00";
}

// Function to create markers
function createMarkers(feature) {
    return L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "#000000",
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.8
    }).bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
}

  // Function to define radius of earthquake marker
  function getRadius(magnitude) {
    return magnitude * 4;
}

   // Parse JSON data to create map features
   L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: getRadius(feature.properties.mag),
            fillColor: markerColor(feature.geometry.coordinates[2]),
            color: "black",
            weight: 0.5,
            opacity: 1,
            fillOpacity: 0.5
        });
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
}).addTo(myMap);

   // Create a legend
   const legend = L.control({ position: "bottomright" });

   legend.onAdd = function() {
       const div = L.DomUtil.create("div", "legend");
       const grades = [0, 10, 30, 50, 70, 90];
       const colors = ["##00CC00", "#1BFB00", "#00F3FF", "#FF6200", "#FF3333", "#CC0000"];

       div.innerHTML = "<h4>Depth (km)</h4>";

       for (let i = 0; i < grades.length; i++) {
           div.innerHTML +=
               '<i style="background:' + colors[i] + '"></i> ' +
               grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
       }

       return div;
   };

   legend.addTo(map);