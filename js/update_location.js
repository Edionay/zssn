window.addEventListener("load", function() {
    document.getElementById('person_id').addEventListener('input', requestSurvivor);
    document.getElementById('person_id').value = '';
    disableUpdateButton();
});

let currentSurvivor = null;

function disableUpdateButton() {
    document.getElementById('update_button').disabled = true;
}

function enableUpdateButton() {
    document.getElementById('update_button').disabled = false;
}

function makeSurvivorInfoVisible() {
    const survivorInfo = document.getElementById('survivor_data');
    survivorInfo.style.display = 'block';
}

function makeSurvivorInfoInvisible() {
    const survivorInfo = document.getElementById('survivor_data');
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
    const pointStringComponents = pointString.split(' ');
    const longitude = pointStringComponents[1].slice(1);
    const latitude = pointStringComponents[2].slice(0, pointStringComponents[2].length - 1);
    return { latitude, longitude };
}

function updateSurvivorLocation() {

    if (validateLocationFieldNotEmpty()) {

        makeSurvivorInfoInvisible();
        showLoadingIcon();
        currentSurvivor.latitude = document.getElementById('latitude').innerText;
        currentSurvivor.longitude = document.getElementById('longitude').innerText;

        const latlon = {
            lat: currentSurvivor.latitude,
            lon: currentSurvivor.longitude
        };

        const form = new FormData();
        form.append('person[name]', currentSurvivor.name);
        form.append('person[age]', currentSurvivor.age);
        form.append('person[gender]', currentSurvivor.gender);
        form.append('person[lonlat]', convertLatlonToPointString(latlon));

        const request = new XMLHttpRequest();
        request.open('PATCH', `http://zssn-backend-example.herokuapp.com/api/people/${currentSurvivor.id}.json`);
        request.onload = () => {
            if (request.status === 200) {
                displayInfoMessage('SUCCESS!', '');
                hideLoadingIcon();
                showSurvivor(currentSurvivor);
                makeSurvivorInfoVisible();
            } else {
                displayInfoMessage('ERROR!', 'Unknown');
            }
        };
        request.send(form);
    } else {
        disableUpdateButton()
    }

}

function displayWarningMessage() {
    const warningMessage = document.getElementById('warning_message_to_valid_id_input');
    warningMessage.style.display = 'block';
}

function hideWarningMessage() {
    const warningMessage = document.getElementById('warning_message_to_valid_id_input');
    warningMessage.style.display = 'none';
}

function requestSurvivor() {

    hideInfoMessage();
    const survivorId = document.getElementById('person_id').value;
    if (survivorId.length === 36) {
        showLoadingIcon();
        const requestUrl = `http://zssn-backend-example.herokuapp.com/api/people/${survivorId}.json`;
        const request = new XMLHttpRequest();

        request.open('GET', requestUrl);
        request.responseType = 'json';
        request.onload = () => {
            if (request.status === 200) {
                hideWarningMessage();
                currentSurvivor = {};
                currentSurvivor.id = request.response.id;
                currentSurvivor.name = request.response.name;
                currentSurvivor.age = request.response.age;
                currentSurvivor.gender = request.response.gender;
                let survivorOldLocationPointString = request.response.lonlat;
                if (survivorOldLocationPointString !== null) {
                    currentSurvivor.latitude = parsePointStringToLatLon(request.response.lonlat).latitude;
                    currentSurvivor.longitude = parsePointStringToLatLon(request.response.lonlat).longitude;
                } else {
                    currentSurvivor.latitude = 'Unknown';
                    currentSurvivor.longitude = 'Unknown';
                }
                showSurvivor(currentSurvivor);
                hideLoadingIcon();
                makeSurvivorInfoVisible();

                if (validateLocationFieldNotEmpty()) {
                    enableUpdateButton();
                } else {
                    disableUpdateButton();
                }
            } else {
                displayWarningMessage();
                currentSurvivor = null;
                disableUpdateButton();
                hideLoadingIcon()
            }
        };
        request.send();
    } else {
        displayWarningMessage();
        hideLoadingIcon();
        makeSurvivorInfoInvisible();
        currentSurvivor = null;
        disableUpdateButton();
    }
}