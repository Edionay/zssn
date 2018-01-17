window.addEventListener("load", function () {
    document.getElementById('person_id').addEventListener('input', requestSurvivor);
});

let survivorToBeUpdated = null;

function requestSurvivor() {

    const survivorId = document.getElementById('person_id').value;
    if (survivorId.length === 36) {
        showLoader();
        const requestUrl = `http://zssn-backend-example.herokuapp.com/api/people/${survivorId}.json`;
        const request = new XMLHttpRequest();

        request.open('GET', requestUrl);
        request.responseType = 'json';
        request.onload = () => {
            if (request.status === 200) {
                survivorToBeUpdated = {};
                survivorToBeUpdated.id = request.response.id;
                survivorToBeUpdated.name = request.response.name;
                survivorToBeUpdated.age = request.response.age;
                survivorToBeUpdated.gender = request.response.gender;
                let survivorOldLocationPointString = request.response.lonlat;
                console.log(survivorOldLocationPointString);
                if (survivorOldLocationPointString.value !== null) {
                    survivorToBeUpdated.latitude = parsePointStringToLatLon(request.response.lonlat).latitude;
                    survivorToBeUpdated.longitude = parsePointStringToLatLon(request.response.lonlat).longitude;
                }
                showSurvivor(survivorToBeUpdated);
                hideLoader();
                showSurvivorData();
                enableUpdateButton();
            } else {
                survivorToBeUpdated = null;
                disableUpdateButton();
                hideLoader()
            }
        };
        request.send();
    } else {
        hideLoader();
        hideSurvivorData();
        survivorToBeUpdated = null;
        disableUpdateButton();
    }
}

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