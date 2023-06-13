mapboxgl.accessToken = accesstoken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: camp.geometry.coordinates, // starting position [lng, lat]
  zoom: 6, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(camp.geometry.coordinates)
    .addTo(map);