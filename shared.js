function fillLocationFields(latlon) {
    let longitudeField = document.getElementById('longitude');
    longitudeField.innerText = latlon.lng;
    let latitudeField = document.getElementById('latitude');
    latitudeField.innerText = latlon.lat;
}

function parseLatlonToPointString(latlon) {
    return `Point(${latlon.lon} ${latlon.lat})`;
}

function fillItemsInput() {
    const form = document.getElementById('new_survivor_form');
    const water = document.getElementById('water').value;
    const food = document.getElementById('food').value;
    const medication = document.getElementById('medication').value;
    const ammunition = document.getElementById('ammunition').value;
    const items = "Water:"+water+";Food:"+food+";Medicine:"+medication+";Ammunition:"+ammunition;
    form.elements.namedItem('items').value = items;
    const lat = document.getElementById('latitude').innerText;
    const lon = document.getElementById('longitude').innerText;
    form.elements.namedItem('person[lonlat]').value = parseLatlonToPointString({lat, lon});
    return true;
}