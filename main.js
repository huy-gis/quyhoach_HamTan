
    /*===================================================
                      OSM  LAYER               
===================================================*/

var map = L.map('map').setView([10.680841708981015, 107.559497371343], 13);
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
osm.addTo(map);

/*===================================================
                      MARKER               
===================================================*/



var singleMarker = L.marker([28.25255,83.97669]);
singleMarker.addTo(map);
var popup = singleMarker.bindPopup('This is a popup')
popup.addTo(map);

/*===================================================
                     TILE LAYER               
===================================================*/

var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
subdomains: 'abcd',
	maxZoom: 19
});
CartoDB_DarkMatter.addTo(map);

// Google Map Layer

googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
 });
 googleStreets.addTo(map);

 // Satelite Layer
googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
   maxZoom: 20,
   subdomains:['mt0','mt1','mt2','mt3']
 });
googleSat.addTo(map);

var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
 attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
subdomains: 'abcd',
minZoom: 1,
maxZoom: 16,
ext: 'jpg'
});
Stamen_Watercolor.addTo(map);


/*===================================================
                      GEOJSON               
===================================================*/
var colorScale = {
    'rectangle': '#FFFF64',
    'pentagon': 'blue',
    'circle': 'green'
};
var nepalData = L.geoJSON(nepaldataa).addTo(map);

var pointdata = L.geoJSON(pointJSON,{
  
    style:function(feature){
        return {
            color:"black",
            dashArray: '10, 5'
        }
    }
}).addTo(map);

var linedata = L.geoJSON(lineJSON,{
    onEachFeature: function(feature,layer){
        layer.bindPopup('<b>[HT]</b><br><b>Mã loại đất: </b>' + feature.properties.MLD + '<br><b>Diện tích: </b>' + feature.properties.DT + ' <b>Hecta</b>')
    },
    style:function(feature){
        return {
            fillColor: colorstyle[feature.properties.MLD],
            fillOpacity:0.65 ,
            color: '#636363' ,
            
        }
    }
}).addTo(map);



var polygondata = L.geoJSON(polygonJSON,{
    onEachFeature: function(feature,layer){
        layer.bindPopup('<b class="qh-text">[QH]</b><br><b>Mã loại đất: </b>' + feature.properties.MLD + '<br><b>Diện tích: </b>' + feature.properties.DT + ' <b>Hecta</b>' +'<br><b>Tên công trình: </b>' + feature.properties.tenct)
        
        layer.on('mouseover', function(e) {
            // Thay đổi màu sắc khi rê chuột qua viền polygon
            layer.setStyle({
                color: 'yellow'
            });
        });
        
        layer.on('mouseout', function(e) {
            // Đặt lại màu sắc ban đầu khi rời chuột khỏi viền polygon
            layer.setStyle({
                color: 'red'
            });
        });
    },
    style:function(feature){
        return {
            fillColor: colorstyle[feature.properties.MLD],
            fillOpacity:0.65 ,
            color: 'red' ,
        }
    }
}).addTo(map);

pointdata.bringToFront();






/*===================================================
                      SEARCH layer CONTROL               
===================================================*/

var searchControl = new L.Control.Search({
    layer: polygondata,
    propertyName: 'tenct',
    marker: false,
    moveToLocation: function(latlng, title, map) {
        // move the map to the searched location
        map.setView(latlng, 16);
    }
});


searchControl.on('search:locationfound', function(e) {
        e.layer.setStyle({ // Change the style of the marker when it's found
color: 'green', // Màu đỏ cho đường viền
      dashArray: '10, 5', // Sọc đỏ
      fillColor: 'yellow', // Màu vàng cho màu nền
        });
      });


searchControl.addTo(map);

/*===================================================
                      LAYER CONTROL               
===================================================*/

var baseLayers = {
    "Satellite":googleSat,
    "Google Map":googleStreets,
    "Water Color":Stamen_Watercolor,
    "OpenStreetMap": osm,
};

var overlays = {
    "Ranh xã /thị trấn":pointdata,
    "Hiện Trạng":linedata,
    "Quy hoạch 30":polygondata
    
};

L.control.layers(baseLayers, overlays).addTo(map);


/*===================================================
                      SEARCH BUTTON               
===================================================*/

L.Control.geocoder().addTo(map);


/*===================================================
                      opacity control              
===================================================*/
var polygonSlider = L.control.slider(function(value) {
polygondata.setStyle({ opacity: value, fillOpacity: value });
}, {
id: "polygon-slider",
min: 0,
max: 1,
step: 0.1,
value: 1,
orientation: "vertical",
collapsed: true,
tooltip: true,
position: "bottomleft",
size: "200px",
title: "Điều chỉnh độ mờ lớp QH",
logo: "QH"
}).addTo(map);

var lineSlider = L.control.slider(function(value) {
linedata.setStyle({ opacity: value, fillOpacity: value });
}, {
id: "line-slider",
min: 0,
max: 1,
step: 0.1,
value: 1,
orientation: "vertical",
collapsed: true,
tooltip: true,
position: "bottomleft",
size: "200px",
title: "Điều chỉnh độ mờ lớp HT",
logo: "HT"
}).addTo(map);

