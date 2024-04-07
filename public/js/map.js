//Environment variables can't be accessed directly here.
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style:"mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates, // starting position [longitude, latitude]
    zoom: 9 // starting zoom
});

// console.log(listing.geometry.coordinates);

const marker = new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset:25}).setHTML(
    `<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p>`
))
.addTo(map);