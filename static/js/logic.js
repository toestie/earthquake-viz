var map = L.map('map').setView([37.09, -95.71], 5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// function createMap(response) {
//     const streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//             attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//             maxZoom: 18,
//             id: "mapbox.streets",
//             accessToken: API_KEY
//     });

//     const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//             attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//             maxZoom: 18,
//             id: "mapbox.dark",
//             accessToken: API_KEY
//     });

//     const baseMaps = {
//             "Street Map": streetmap,
//             "Dark Map": darkmap
//     };

//     const myMap = L.map("map", {
//         center: [37.09, -95.71],
//         zoom: 5,
//         layers: streetmap
//     });

//     response.forEach(data => {        
//         if (data.geometry) {
//             let coord = [data.geometry.coordinates[1], data.geometry.coordinates[0]]
//             return L.circle(coord, {
//                 radius: data.properties.mag * 30000,
//                 color: "white",
//                 fillColor: chooseColor(data.properties.mag),
//                 fillOpacity: 0.75,
//                 weight: 0.5
//             }).bindPopup("<h1>" + data.properties.title + "</h1> <hr> <h3>Magnitude: " + data.properties.mag + "</h3>").addTo(myMap);
//         }
//     })
    
//     const legend = L.control({ position: "bottomright" });
//     legend.onAdd = function() {
//         const div = L.DomUtil.create("div", "info legend");
//         mags = ["0-1","1-2","2-3","3-4","4-5","5-6","6-7",">7"]
//         colors = [0.5,1.5,2.5,3.5,4.5,5.5,6.5,7.5]
//         div.innerHTML += "<ul><strong>Magnitude</strong></ul>" + "<hr>";
//         for (var i = 0; i < mags.length; i++) {
//             div.innerHTML +=
//                 '<i style="background:' + chooseColor(colors[i]) + '"></i> ' +
//                 (mags[i] ? mags[i] + '<br>' : '+');
//         }
//         return div;
//     };
//     L.control.layers(baseMaps).addTo(myMap);

//     legend.addTo(myMap);
// }

// function chooseColor(magnitude) {
//     // https://gka.github.io/palettes/#/9|s|00429d,96ffea,ffffe0|ffffe0,ff005e,93003a|1|1
//     return magnitude > 7 ? '#94003a':
//     magnitude > 6 ? '#a63a4a':
//         magnitude > 5 ? '#b85d5b':
//             magnitude > 4 ? '#c87e6e':
//                 magnitude > 3 ? '#d89e83':
//                     magnitude > 2 ? '#e7be9a':
//                         magnitude > 1 ? '#f4dfb5':
//                         '#ffffe0';
// }

// (async function () {
//     const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
//     await d3.json(url, function(parsedJSON){
//         console.log(parsedJSON.features)
//         createMap(parsedJSON.features)
//     });
// })()