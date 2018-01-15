window.addEventListener("load", function() { 
    requestSurvivors();
})

function requestSurvivors() {
    const requestUrl = 'http://zssn-backend-example.herokuapp.com/api/people.json';
    const request = new XMLHttpRequest;
    
    request.open('GET', requestUrl);
    request.responseType = 'json';
    request.onload = () => showSurvivors(request.response);
    request.send();
}

function showSurvivors(survivorsList) {
    const survivorsTable = document.getElementById('survivors_list');
    for (const survivor of survivorsList) {
        const newRow = survivorsTable.insertRow();
        let nameCell = newRow.insertCell(0);
        let ageCell = newRow.insertCell(1);
        let genderCell = newRow.insertCell(2);
        let infectedCell = newRow.insertCell(3);
        let locationCell = newRow.insertCell(4);

        nameCell.innerText = survivor.name;
        ageCell.innerText = survivor.age;
        genderCell.innerText = survivor.gender;
        infectedCell.innerText = survivor['infected?'] ? 'Yes' : 'No';
        locationCell.innerText = survivor.lonlat;
    }
}

function toggleNewSurvivorForm() {
    const newSurvivorForm = document.getElementById('new_survivor_form');
    if (newSurvivorForm.style.display === 'block') {
        newSurvivorForm.style.display = 'none';
    } else {
        newSurvivorForm.style.display = 'block';
    }
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

function fillLocationFields(latlon) {
    let longitudeField = document.getElementById('longitude');
    longitudeField.innerText = latlon.lng;
    let latitudeField = document.getElementById('latitude');
    latitudeField.innerText = latlon.lat;
}

function parseLatlonToPointString(latlon) {
    return `Point(${latlon.lon} ${latlon.lat})`;
}