window.addEventListener("load", function() { 
});

let survivorToBeUpdated = null;


function requestSurvivor() {

    const survivorId = document.getElementById('person_id').value;
    const requestUrl = `http://zssn-backend-example.herokuapp.com/api/people/${survivorId}.json`;
    const request = new XMLHttpRequest();
    
    request.open('GET', requestUrl);
    request.responseType = 'json';
    request.onload = () => {

        survivorToBeUpdated = {};
        survivorToBeUpdated.id = request.response.id;
        survivorToBeUpdated.name = request.response.name;
        survivorToBeUpdated.age = request.response.age;
        survivorToBeUpdated.gender = request.response.gender;
        let survivorOldLocationPointString = request.response.lonlat;
        if (survivorOldLocationPointString !== null) {
            survivorToBeUpdated.latitude = parsePointStringToLatLon(request.response.lonlat).latitude;
            survivorToBeUpdated.longitude = parsePointStringToLatLon(request.response.lonlat).longitude;
        }
        updateSurvivorLocation(survivorToBeUpdated.id);
        showSurvivor(survivorToBeUpdated);
    }
    request.send();
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
    form.append('person[name]', survivorToBeUpdated.name);
    form.append('person[age]', survivorToBeUpdated.age);
    form.append('person[gender]', survivorToBeUpdated.gender);
    form.append('person[lonlat]', parseLatlonToPointString(latlon));

    const request = new XMLHttpRequest();
    request.open('PATCH', `http://zssn-backend-example.herokuapp.com/api/people/${survivorToBeUpdated.id}.json`);
    request.send(form);
}