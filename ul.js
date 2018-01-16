window.addEventListener("load", function() { 
    requestSurvivor(getSurvivorIdFromUrl());
})

let survivorToBeUpdated = null;

function getSurvivorIdFromUrl() {
    const parameters = new URL(window.location).searchParams;
    const userId = parameters.get('userId');
    return userId;
}

function requestSurvivor(userId) {
    
    const requestUrl = `http://zssn-backend-example.herokuapp.com/api/people/${userId}.json`;
    const request = new XMLHttpRequest();
    
    request.open('GET', requestUrl);
    request.responseType = 'json';
    request.onload = () => {

        survivorToBeUpdated = {};
        survivorToBeUpdated.id = request.response.id;
        survivorToBeUpdated.name = request.response.name;
        survivorToBeUpdated.age = request.response.age;
        survivorToBeUpdated.gender = request.response.gender;
        survivorToBeUpdated.latitude = parsePointStringToLatLon(request.response.lonlat).latitude;
        survivorToBeUpdated.longitude = parsePointStringToLatLon(request.response.lonlat).longitude;
        console.log(survivorToBeUpdated);        
        showSurvivor(survivorToBeUpdated);
    }
    request.send();
}

function showSurvivor(survivor) {
    document.getElementById('survivorName').innerText = survivor.name;
    document.getElementById('survivorAge').innerText = survivor.age;
    document.getElementById('survivorGender').innerText = survivor.gender;
    document.getElementById('longitude').innerText = survivor.longitude;
    document.getElementById('latitude').innerText = survivor.latitude;
}

function parsePointStringToLatLon(pointString) {
    const splittedPoint = pointString.split(' ');
    const longitude = splittedPoint[1].slice(1);
    const latitude = splittedPoint[2].slice(0, splittedPoint[2].length-1);
    return {latitude, longitude};
}

function updateSurvivorLocation(userId) {

    survivorToBeUpdated.latitude = document.getElementById('latitude').innerText;
    survivorToBeUpdated.longitude = document.getElementById('longitude').innerText;

    const latlon = {
        lat: survivorToBeUpdated.latitude,
        lon: survivorToBeUpdated.longitude
    }

    const form = new FormData();
    form.append('person[name]', 'Mariana');
    form.append('person[age]', survivorToBeUpdated.age);
    form.append('person[gender]', survivorToBeUpdated.gender);
    form.append('person[lonlat]', parseLatlonToPointString(latlon));

    const request = new XMLHttpRequest();
    request.open('PATCH', `http://zssn-backend-example.herokuapp.com/api/people/${survivorToBeUpdated.id}.json`);
    request.send(form);
}