

function fillLocationFields(latlon) {
    let longitudeField = document.getElementById('longitude');
    longitudeField.innerText = latlon.lng;
    let latitudeField = document.getElementById('latitude');
    latitudeField.innerText = latlon.lat;
}

function parseLatlonToPointString(latlon) {
    return `Point(${latlon.lon} ${latlon.lat})`;
}

function onFormSubmitted(event) {

    const myForm = document.getElementById('new_survivor_form');
    const form = new FormData();

    const water = document.getElementById('water').value;
    const food = document.getElementById('food').value;
    const medication = document.getElementById('medication').value;
    const ammunition = document.getElementById('ammunition').value;
    const items = "Water:"+water+";Food:"+food+";Medicine:"+medication+";Ammunition:"+ammunition;
    myForm.elements.namedItem('items').value = items;
    const lat = document.getElementById('latitude').innerText;
    const lon = document.getElementById('longitude').innerText;
    myForm.elements.namedItem('person[lonlat]').value = parseLatlonToPointString({lat, lon});

    form.append('person[name]', myForm.elements.namedItem('person[name]').value);
    form.append('person[age]', myForm.elements.namedItem('person[age]').value);
    form.append('person[gender]', myForm.elements.namedItem('person[gender]').value);
    form.append('person[lonlat]', myForm.elements.namedItem('person[lonlat]').value);
    form.append('items]', myForm.elements.namedItem('items').value);

    const request = new XMLHttpRequest();
    request.open('POST', 'http://zssn-backend-example.herokuapp.com/api/people.json');
    request.responseType = 'json';
    request.onload = () => {
        console.log(request.status);
    };
    request.send(form);
    event.preventDefault();

}

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
                currentSurvivor = {};
                currentSurvivor.id = request.response.id;
                currentSurvivor.name = request.response.name;
                currentSurvivor.age = request.response.age;
                currentSurvivor.gender = request.response.gender;
                let survivorOldLocationPointString = request.response.lonlat;
                console.log(survivorOldLocationPointString);
                if (survivorOldLocationPointString !== null) {
                    currentSurvivor.latitude = parsePointStringToLatLon(request.response.lonlat).latitude;
                    currentSurvivor.longitude = parsePointStringToLatLon(request.response.lonlat).longitude;
                } else {
                        currentSurvivor.latitude = 'Unknown';
                        currentSurvivor.longitude = 'Unknown';
                }
                showSurvivor(currentSurvivor);
                hideLoader();
                showSurvivorData();
                enableUpdateButton();
            } else {
                currentSurvivor = null;
                disableUpdateButton();
                hideLoader()
            }
        };
        request.send();
    } else {
        hideLoader();
        hideSurvivorData();
        currentSurvivor = null;
        disableUpdateButton();
    }
}

function showSurvivors(survivorsList) {
    const survivorsTable = document.getElementById('survivors_list');
    for (const survivor of survivorsList) {
        const newRow = survivorsTable.insertRow();
        let iconCell = newRow.insertCell(0);
        let nameCell = newRow.insertCell(1);

        nameCell.innerText = survivor.name;
        const iconLink = document.createElement('a');
        const iconToLink = document.createElement('i');
        iconToLink.className = 'material-icons';
        iconToLink.innerText = 'flag';
        iconLink.appendChild(iconToLink);
        iconLink.addEventListener('click', flagSurvivor);
        iconToLink.id = getSurvivorIdFromPath(survivor.location);
        iconCell.appendChild(iconLink);

    }
}

function survivorsFilterByName() {

    const survivorsTable = document.getElementById('survivors_list');
    const tableRows = survivorsTable.getElementsByTagName('tr');
    const term = document.getElementById('infected_name').value.toLocaleLowerCase();

    for (survivor of tableRows) {
        if (survivor.innerText.toLocaleLowerCase().includes(term)){
            survivor.style.display = '';
        } else {
            survivor.style.display = 'none';
        }
    }
}

function flagSurvivor(event) {
    console.log(event.target.id);
    if (currentSurvivor !== null) {
        const request = new XMLHttpRequest();
        const requestUrl = `http://zssn-backend-example.herokuapp.com/api/people/${currentSurvivor.id}/report_infection.json`;
        request.open('POST', requestUrl);
        request.responseType = 'json';
        request.onload = () => {
            console.log(request.status);
        };
        const form = new FormData();
        form.append('infected', event.target.id);
        request.send(form);
    }
}