function createMap(response) {
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4
    });

    const streetmap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(myMap);

    response.forEach(data => {        
        if (data.geometry) {
            let coord = [data.geometry.coordinates[1], data.geometry.coordinates[0]]
            return L.circle(coord, {
                radius: data.properties.mag * 30000,
                color: "white",
                fillColor: chooseColor(data.properties.mag),
                fillOpacity: 0.75,
                weight: 0.5
            }).bindPopup("<h1>" + data.properties.title + "</h1> <hr> <h3>Magnitude: " + data.properties.mag + "</h3>").addTo(myMap);
        }
    })
    
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        const div = L.DomUtil.create("div", "info legend");
        mags = ["0-1","1-2","2-3","3-4","4-5","5-6","6-7",">7"]
        colors = [0.5,1.5,2.5,3.5,4.5,5.5,6.5,7.5]
        div.innerHTML += "<ul><strong>Magnitude</strong></ul>" + "<hr>";
        for (var i = 0; i < mags.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(colors[i]) + '"></i> ' +
                (mags[i] ? mags[i] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(myMap);
}

function chooseColor(magnitude) {
    // https://gka.github.io/palettes/#/9|s|00429d,96ffea,ffffe0|ffffe0,ff005e,93003a|1|1
    colorlist = ['#c80000', '#b051a2', '#b470b5', '#bc8cc0', '#c6a6c4', '#d2c0c5', '#dddbc2', '#e8f5bd'];
    return magnitude > 7 ? colorlist[0]:
        magnitude > 6 ? colorlist[1]:
            magnitude > 5 ? colorlist[2]:
                magnitude > 4 ? colorlist[3]:
                    magnitude > 3 ? colorlist[4]:
                        magnitude > 2 ? colorlist[5]:
                            magnitude > 1 ? colorlist[6]:
                            colorlist[7];
}

(async function () {
    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    await d3.json(url, function(parsedJSON){
        console.log(parsedJSON.features)
        createMap(parsedJSON.features)
    });
})()