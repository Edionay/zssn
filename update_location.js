window.addEventListener("load", function () {
    document.getElementById('person_id').addEventListener('input', requestSurvivor);
});

let currentSurvivor = null;

function disableUpdateButton() {
    document.getElementById('update_button').disabled = true;
}

function enableUpdateButton() {
    document.getElementById('update_button').disabled = false;
}


function showSurvivorData() {
    const survivorInfo = document.getElementById('survivor_data');
    survivorInfo.style.display = 'block';
}

function hideSurvivorData() {
    const survivorInfo = document.getElementById('survivor_data');
    survivorInfo.style.display = 'none';
}

function showLoader() {
    const survivorInfo = document.getElementById('loader');
    survivorInfo.style.display = 'block';
}

function hideLoader() {
    const survivorInfo = document.getElementById('loader');
    survivorInfo.style.display = 'none';
}


function showSurvivor(survivor) {
    document.getElementById('survivorName').innerText = survivor.name;
    document.getElementById('survivorAge').innerText = survivor.age;
    document.getElementById('survivorGender').innerText = survivor.gender;
    document.getElementById('survivorLongitude').innerText = survivor.longitude;
    document.getElementById('survivorLatitude').innerText = survivor.latitude;
}

function parsePointStringToLatLon(pointString) {
    const splittedPoint = pointString.split(' ');
    const longitude = splittedPoint[1].slice(1);
    const latitude = splittedPoint[2].slice(0, splittedPoint[2].length - 1);
    return {latitude, longitude};
}

function updateSurvivorLocation() {

    currentSurvivor.latitude = document.getElementById('latitude').innerText;
    currentSurvivor.longitude = document.getElementById('longitude').innerText;

    const latlon = {
        lat: currentSurvivor.latitude,
        lon: currentSurvivor.longitude
    }

    const form = new FormData();
    form.append('person[name]', currentSurvivor.name);
    form.append('person[age]', currentSurvivor.age);
    form.append('person[gender]', currentSurvivor.gender);
    form.append('person[lonlat]', parseLatlonToPointString(latlon));

    const request = new XMLHttpRequest();
    request.open('PATCH', `http://zssn-backend-example.herokuapp.com/api/people/${currentSurvivor.id}.json`);
    request.onload = () => {
        if (request.status === 200) {
            console.log('SUCESS!');
        }
        else {
            console.log('ERRO!');
        }
    };
    request.send(form);
}