function fillLocationFields(latlon) {
    const longitudeField = document.getElementById('longitude');
    longitudeField.innerText = latlon.lng;
    const latitudeField = document.getElementById('latitude');
    latitudeField.innerText = latlon.lat;
}

function convertLatlonToPointString(latlon) {
    return `Point(${latlon.lon} ${latlon.lat})`;
}

function validateLocationFieldNotEmpty() {
    const lat = document.getElementById('latitude').innerText;
    const lon = document.getElementById('longitude').innerText;

    return !(lat === '' && lon === '');
}

function onSubmitNewSurvivor(event) {

    if (validateLocationFieldNotEmpty()) {

        showLoadingIcon();
        const myForm = document.getElementById('new_survivor_form');
        const formToBeSubmitted = new FormData();

        const water = document.getElementById('water').value;
        const food = document.getElementById('food').value;
        const medication = document.getElementById('medication').value;
        const ammunition = document.getElementById('ammunition').value;
        myForm.elements.namedItem('items').value =
            "Water:" + water + ";Food:" + food + ";Medicine:" + medication + ";Ammunition:" + ammunition;
        const lat = document.getElementById('latitude').innerText;
        const lon = document.getElementById('longitude').innerText;
        myForm.elements.namedItem('person[lonlat]').value = convertLatlonToPointString({ lat, lon });

        formToBeSubmitted.append('person[name]', myForm.elements.namedItem('person[name]').value);
        formToBeSubmitted.append('person[age]', myForm.elements.namedItem('person[age]').value);
        formToBeSubmitted.append('person[gender]', myForm.elements.namedItem('person[gender]').value);
        formToBeSubmitted.append('person[lonlat]', myForm.elements.namedItem('person[lonlat]').value);
        formToBeSubmitted.append('items]', myForm.elements.namedItem('items').value);

        const request = new XMLHttpRequest();
        request.open('POST', 'https://zssn-backend-example.herokuapp.com/api/people.json');
        request.responseType = 'json';
        request.onload = () => {
            hideLoadingIcon();
            if (request.status === 201) {
                displayInfoMessage('SUCCESS', '');
                myForm.reset();
            } else if (request.status === 422) {
                displayInfoMessage('ERROR', "Survivor name has already been taken");
            } else {
                displayInfoMessage('ERROR', "Unknown")
            }
        };
        request.send(formToBeSubmitted);
    }
    event.preventDefault()
}

function displayInfoMessage(type, details) {
    const messageField = document.getElementById('info_message');
    messageField.style.display = 'block';
    const messageTypeField = document.getElementById('info_type');
    messageTypeField.innerText = type;
    const messageDetailsField = document.getElementById('info_details');
    messageDetailsField.innerText = details;
}

function showLoadingIcon() {
    const loader = document.getElementById('loading_icon');
    loader.style.display = 'block';
}

function hideLoadingIcon() {
    const loader = document.getElementById('loading_icon');
    loader.style.display = 'none';
}

function hideInfoMessage() {
    const messageField = document.getElementById('info_message');
    messageField.style.display = 'none';
}

function hideLonlatWarning() {
    const messageField = document.getElementById('lonlat_pick_warning');
    messageField.style.display = 'none';
}

function showPickedLonlat() {
    const messageField = document.getElementById('latlon');
    messageField.style.display = 'block';
}

function getSurvivorIdFromPath(locationPath) {
    const splitPath = locationPath.split('/');
    return splitPath[5];
}