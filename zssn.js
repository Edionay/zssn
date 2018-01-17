window.addEventListener("load", function() { 
    requestSurvivors();
    document.getElementById('infected_name').addEventListener('input', survivorsFilterByName);
    document.getElementById('person_id').addEventListener('input', requestSurvivor);
});

let survivorsList = null;

function requestSurvivors() {
    const requestUrl = 'http://zssn-backend-example.herokuapp.com/api/people.json';
    const request = new XMLHttpRequest;
    
    request.open('GET', requestUrl);
    request.responseType = 'json';
    request.onload = () => {
        survivorsList = {};
        survivorsList = request.response;
        console.log(survivorsList);
        showSurvivors(survivorsList);
    };
    request.send();
}

function getSurvivorIdFromPath(locationPath) {
    const splittedPath = locationPath.split('/');
    return survivorId = splittedPath[5];
}
