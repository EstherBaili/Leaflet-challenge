function createMap(earthquakeList) {

  // Create the tile layers that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors,\
     <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
    });
  
  // Create a baseMaps object to hold the lightmap and the street map layer
  var baseMaps = {
    "Street Map": streetmap,
    "Satellite": satellitemap,
    "Light Map": lightmap 
  };

  // Create an overlayMaps object to hold the earthquakes layer
  var overlayMaps= {
    "Earthquakes": earthquakeList
  };

  // Create the map object with options
  var myMap = L.map("map-id", {
    center: [38.0998, -98.1586],
    zoom: 5,
    layers: [streetmap, earthquakeList]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
    
  //create legend bar, also need to update the css file
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var groups = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
    var keys = ["#bfff00","#ffbf00","#ff4000","#ff00bf","#bf00ff","#140114"];
  
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < groups.length; i++) {
      div.innerHTML +=
        '<p style="margin-left: 15px">' + '<i style="background:' + keys[i] + ' "></i>' + '&nbsp;&nbsp;' + groups[i]+ '<\p>';
    }
  
    return div;
    
  };
  
  //Add the legend by default
  legend.addTo(myMap)

}

 function createMarkers(response) {
   // checking the format of earthquakes
   //console.log("createMarkers");
   //console.log(response);
   // the console log shows information we need is saved in features.property.mag and features.geometry.coordinates 
   
   // Pull the earthquakes off response
   var earthquake = response.features;
   //console.log(earthquake);
   
   //new array to hold the earthquake records 
   var earthquakeList = [];
   
   // create loop to add earthquake records to the list
   for (var i = 0; i < earthquake.length; i++) {

    LatLong = [earthquake[i].geometry.coordinates[1],earthquake[i].geometry.coordinates[0]]
    properties = earthquake[i].properties;
    
    //assign colour to different mags
    var color = "#1a0000";

    if (properties.mag < 1) {
      color = "#bfff00";
    }
    else if (properties.mag < 2) {
      color = "#ffbf00";
    }
    else if (properties.mag < 3) {
      color = "#ff4000";
    }
    else if (properties.mag < 4) {
      color = "#ff00bf";
    }
    else if (properties.mag < 5) {
      color = "#bf00ff";
    }
    else if (properties.mag > 5.01) {
      color = "#140114";
    }

    // Add circles to map
    var earthquakeMaker = L.circle(LatLong, {
      fillOpacity: 0.5,
      color: color,
      fillColor: color,
      // Adjust radius
      radius: (properties.mag * 20000)
    //}).bindPopup("<h1>" + properties.place + "</h1> <hr> <h3>Magnitud: " + properties.mag.toFixed(2) + "</h3>");
    }).bindPopup("<h1>" + properties.place + "</h1> <hr> <h3>Magnitud: " + properties.mag + "</h3>");
    //Add the cricle to the array
    earthquakeList.push(earthquakeMaker); 
    //console.log(earthquakeList)
  }

//Create the layer for the circles
createMap(L.layerGroup(earthquakeList));

}

 // Perform an API call to the USGS to get earthquakes. Call createMarkers when complete
 d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
