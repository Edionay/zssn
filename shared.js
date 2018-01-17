

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
        // let ageCell = newRow.insertCell(1);
        // let genderCell = newRow.insertCell(2);
        // let infectedCell = newRow.insertCell(3);
        // let locationCell = newRow.insertCell(4);

        nameCell.innerText = survivor.name;
        const iconLink = document.createElement('a');
        const iconToLink = document.createElement('i');
        iconToLink.className = 'material-icons';
        iconToLink.innerText = 'flag';
        iconLink.appendChild(iconToLink);
        iconLink.addEventListener('click', flagSurvivor);
        iconToLink.id = getSurvivorIdFromPath(survivor.location);
        iconCell.appendChild(iconLink);
        // ageCell.innerText = survivor.age;
        // genderCell.innerText = survivor.gender;
        // infectedCell.innerText = survivor['infected?'] ? 'Yes' : 'No';
        // locationCell.innerText = survivor.lonlat;
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
    };
    //
    // const term = document.getElementById('infected_name').value.toLowerCase();
    // let filteredSurvivors = survivorsList.filter(survivor => {
    //     return survivor.name.toLocaleLowerCase().includes(term);
    // });
    // showSurvivors(filteredSurvivors);
    // console.log(filteredSurvivors);
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