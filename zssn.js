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
        newRow.id = getSurvivorIdFromPath(survivor.location);
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

function getSurvivorIdFromPath(locationPath) {
    const splittedPath = locationPath.split('/');
    return survivorId = splittedPath[5];
}

