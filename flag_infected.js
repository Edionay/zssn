window.addEventListener("load", function () {
    document.getElementById('user_id').value = '';
    document.getElementById('infected_name').value = '';
    requestSurvivors();
    document.getElementById('infected_name').addEventListener('input', survivorsFilterByName);
    document.getElementById('user_id').addEventListener('input', requestCurrentUser);
});

let survivorsList = null;
let uninfectedSurvivorsList = null;
let currentUser = null;

function requestSurvivors() {
    const requestUrl = 'http://zssn-backend-example.herokuapp.com/api/people.json';
    const request = new XMLHttpRequest;

    request.open('GET', requestUrl);
    request.responseType = 'json';
    request.onload = () => {
        survivorsList = request.response;
        setUninfectedList(survivorsList);
        showSurvivors(uninfectedSurvivorsList);
    };
    request.send();
}

function setUninfectedList(survivorsList) {
    uninfectedSurvivorsList = [];

    for (let surivor of survivorsList) {
        if (!surivor['infected?']) {
            uninfectedSurvivorsList.push(surivor);
        }
    }
}

function getSurvivorIdFromPath(locationPath) {
    const splittedPath = locationPath.split('/');
    return survivorId = splittedPath[5];
}

function flagSurvivor(event) {

    if (currentUser) {
        const request = new XMLHttpRequest();
        const requestUrl = `http://zssn-backend-example.herokuapp.com/api/people/${currentUser.id}/report_infection.json`;
        request.open('POST', requestUrl);
        request.responseType = 'json';
        request.onload = () => {
            console.log(request.status);
            if (request.status === 204) {
                displayInfoMessage('SUCCESS!', '');
            } else if (request.status === 422) {
                displayInfoMessage('ERROR!', "You've already flagged this person");
            }
        };
        const form = new FormData();
        form.append('infected', event.target.id);
        request.send(form);
    } else {
        displayInfoMessage('ERROR', 'Please, enter a valid ID')
    }
}

function showSurvivors(survivorsList) {
    const survivorsTable = document.getElementById('survivors_list');
    for (const survivor of survivorsList) {
        const newRow = survivorsTable.insertRow();
        let nameCell = newRow.insertCell(0);
        nameCell.className = 'name_cell';
        let iconCell = newRow.insertCell(1);
        iconCell.className = 'icon_cell';

        nameCell.innerText = survivor.name;
        const iconLink = document.createElement('a');
        iconLink.href = '#';
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
        if (survivor.innerText.toLocaleLowerCase().includes(term)) {
            survivor.style.display = '';
        } else {
            survivor.style.display = 'none';
        }
    }
}

function requestCurrentUser() {

    hideInfoMessage();
    const survivorId = document.getElementById('user_id').value;
    if (survivorId.length === 36) {

        const requestUrl = `http://zssn-backend-example.herokuapp.com/api/people/${survivorId}.json`;
        const request = new XMLHttpRequest();

        request.open('GET', requestUrl);
        request.responseType = 'json';
        request.onload = () => {
            if (request.status === 200) {
                currentUser = {
                    id: request.response.id,
                    name: request.response.name
                }
                document.getElementById('warning_message_to_valid_id').innerText = `Welcome, ${currentUser.name}!`

            } else {
                document.getElementById('warning_message_to_valid_id').innerText = 'Please, insert a valid ID';
            }
        };
        request.send();
    } else {
        document.getElementById('warning_message_to_valid_id').innerText = 'Please, insert a valid ID';
        currentUser = null;
    }
}