function fillLocationFields(latlon) {
    let longitudeField = document.getElementById('longitude');
    longitudeField.innerText = latlon.lng;
    let latitudeField = document.getElementById('latitude');
    latitudeField.innerText = latlon.lat;
}

function parseLatlonToPointString(latlon) {
    return `Point(${latlon.lon} ${latlon.lat})`;
}