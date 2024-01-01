// const campSites = require("../../models/campSites");
const camps = JSON.parse(camp);
mapboxgl.accessToken = MapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: camps.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(camps.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${camps.title}</h3><p>${camps.location}</p>`
            )
    )
    .addTo(map)