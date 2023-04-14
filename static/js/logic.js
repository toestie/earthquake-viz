mapboxgl.accessToken = API_KEY;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-95.486052, 37.830348],
    zoom: 4
});

var layerId = 'light-v11';

map.addControl(new mapboxgl.NavigationControl());

function addEarthquakes() {
    // GeoJSON data by USGS
    map.addSource('earthquakes', {
        type: 'geojson',
        data: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson',
    });
    
    const mag1 = ['<', ['get', 'mag'], 1.5];
    const mag2 = ['all', ['>=', ['get', 'mag'], 1.5], ['<', ['get', 'mag'], 2.5]];
    const mag3 = ['all', ['>=', ['get', 'mag'], 2.5], ['<', ['get', 'mag'], 3.5]];
    const mag4 = ['all', ['>=', ['get', 'mag'], 3.5], ['<', ['get', 'mag'], 4.5]];
    const mag5 = ['all', ['>=', ['get', 'mag'], 4.5], ['<', ['get', 'mag'], 5.5]];
    const mag6 = ['all', ['>=', ['get', 'mag'], 5.5], ['<', ['get', 'mag'], 6.5]];

    // https://gka.github.io/palettes/#/9|s|00429d,96ffea,ffffe0|ffffe0,ff005e,93003a|1|1
    colorlist = ['#e31a1c', '#ee542c', '#f87b45', '#ff9e65', '#ffc08b', '#ffe0b4', '#ffffe0'];

    map.addLayer({
        'id': 'earthquakes-layer',
        'type': 'circle',
        'source': 'earthquakes',
        'paint': {
            "circle-radius": [
                "interpolate", ["linear"], ["zoom"],
                // when zoom is 0 (zoomed out)
                0, ["*", 0.5, ["get", "mag"]],
                // when zoom is 10 (zoomed in)
                10, ["*", 10, ["get", "mag"]]
            ],
            'circle-stroke-width': 0.5,
            'circle-color': ['case',
                mag1,
                colorlist[6],
                mag2,
                colorlist[5],
                mag3,
                colorlist[4],
                mag4,
                colorlist[3],
                mag5,
                colorlist[2],
                mag6,
                colorlist[1],
                colorlist[0]
            ],
            'circle-opacity': 0.75,
            'circle-stroke-color': 'red'
        }
    });

    // When clicking on earthquake node, popup displays some basic information
    map.on('click', 'earthquakes-layer', (e) => {
        // Copy coordinates array.
        const Emag = e.features[0].properties.mag;
        const Eplace = e.features[0].properties.place;
        const Ecoordinates = e.features[0].geometry.coordinates;
        const Edate = new Date(e.features[0].properties.time);
         
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - Ecoordinates[0]) > 180) {
        Ecoordinates[0] += e.lngLat.lng > Ecoordinates[0] ? 360 : -360;
        }
         
        const infobox = new mapboxgl.Popup()
        .setLngLat(Ecoordinates)
        .setHTML(
            "<h3>Magnitude: " + Emag + "</h3> <hr> " + Eplace + " on " + Edate
            )
        .addTo(map);
    });
}

map.on('load', () => {addEarthquakes()});

// map type switch panel
const layerList = document.getElementById('menu');
const inputs = layerList.getElementsByTagName('input');

for (const input of inputs) {
    input.onclick = (layer) => {
        layerId = layer.target.id;
        map.setStyle('mapbox://styles/mapbox/' + layerId);
    };
}


// makes sure elements persist when changing map style
map.on('style.load', () => {
    addEarthquakes();
    });

// Old Leaflet Code---------------------------------------------

// function createMap(response) {
//     var myMap = L.map("map", {
//         center: [37.09, -95.71],
//         zoom: 4
//     });

//     L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         maxZoom: 19,
//         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//     }).addTo(myMap);

//     response.forEach(data => {        
//         if (data.geometry) {
//             let coord = [data.geometry.coordinates[1], data.geometry.coordinates[0]]
//             return L.circle(coord, {
//                 radius: data.properties.mag * 25000,
//                 color: "red",
//                 fillColor: chooseColor(data.properties.mag),
//                 fillOpacity: 0.75,
//                 weight: 0.5
//             }).bindPopup("<h2>Magnitude: " + data.properties.mag + "</h2> <hr> <h3>" + data.properties.place + "</h3>").addTo(myMap);
//         }
//     })
    
//     const legend = L.control({ position: "bottomright" });
//     legend.onAdd = function() {
//         const div = L.DomUtil.create("div", "info legend");
//         mags = ["0-1","1-2","2-3","3-4","4-5","5-6","6-7",">7"]
//         colors = [0.5,1.5,2.5,3.5,4.5,5.5,6.5,7.5]
//         div.innerHTML += "<ul style='padding:0;''><strong>Magnitude</strong></ul>" + "<hr>";
//         for (var i = 0; i < mags.length; i++) {
//             div.innerHTML +=
//                 '<i style="background:' + chooseColor(colors[i]) + '"></i> ' +
//                 (mags[i] ? mags[i] + '<br>' : '+');
//         }
//         return div;
//     };

//     legend.addTo(myMap);
// }

// function chooseColor(magnitude) {
//     // https://gka.github.io/palettes/#/9|s|00429d,96ffea,ffffe0|ffffe0,ff005e,93003a|1|1
//     colorlist = ['#c80000', '#b051a2', '#b470b5', '#bc8cc0', '#c6a6c4', '#d2c0c5', '#dddbc2', '#e8f5bd'];
//     return magnitude > 7 ? colorlist[0]:
//         magnitude > 6 ? colorlist[1]:
//             magnitude > 5 ? colorlist[2]:
//                 magnitude > 4 ? colorlist[3]:
//                     magnitude > 3 ? colorlist[4]:
//                         magnitude > 2 ? colorlist[5]:
//                             magnitude > 1 ? colorlist[6]:
//                                 colorlist[7];
// }

// (async function () {
//     const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
//     await d3.json(url, function(parsedJSON){
//         console.log(parsedJSON.features)
//         createMap(parsedJSON.features)
//     });
// })()