window.addEventListener("load", function () {
    requestInfectedAverage();
    requestSurvivors();
});


let uninfectedSurvivorsIdList = null;
let water = 0;
let food = 0;
let ammunition = 0;
let medication = 0;

function requestInfectedAverage() {

    showLoadingIcon();
    const requestUrl = 'http://zssn-backend-example.herokuapp.com/api/report/infected.json';
    const request = new XMLHttpRequest();

    request.open('GET', requestUrl);
    request.responseType = 'json';
    request.onload = () => {

        let infectedAverage = request.response.report.average_infected;
        let uninfectedAverage = 1 - infectedAverage;


        document.getElementById('infected_rate').innerText = (infectedAverage * 100).toFixed(2) + "%";
        document.getElementById('uninfected_rate').innerText = (uninfectedAverage * 100).toFixed(2) + "%";

        hideLoadingIcon();
        showReportInfo();
    };
    request.send();
}

function showReportInfo() {
    document.getElementById('infection_report').style.display = 'block';
}

function requestSurvivors() {
    showLoadingIcon();
    const requestUrl = 'http://zssn-backend-example.herokuapp.com/api/people.json';
    const request = new XMLHttpRequest();

    request.open('GET', requestUrl);
    request.responseType = 'json';
    request.onload = () => {
        fillSurvivorsIdList(request.response);
    };
    request.send();
}

function fillSurvivorsIdList(survivorsList) {
    uninfectedSurvivorsIdList = [];
    for (let survivor of survivorsList) {
        if (survivor['infected?'] === false) {
            const survivorId = getSurvivorIdFromPath(survivor.location);
            uninfectedSurvivorsIdList.push(survivorId);
        }
    }

    let promises = [];
    for (let id of uninfectedSurvivorsIdList) {
        promises.push(requestSurvivorItems(id));
    }
    const allPromises = Promise.all(promises);
    allPromises.then(function (response) {
        for (let inventory of response) {
            for (let item of inventory) {
                if (item.item.name === "Water") {
                    water = water + item.quantity;
                } else if (item.item.name === "Food") {
                    food = food + item.quantity;
                } else if (item.item.name === "Ammunition") {
                    ammunition = food + item.quantity;
                } else if (item.item.name === "Medication") {
                    medication = food + item.quantity;
                }
            }
        }
        document.getElementById('water_amount').innerText = (water / uninfectedSurvivorsIdList.length).toFixed(2);
        document.getElementById('food_amount').innerText = (food / uninfectedSurvivorsIdList.length).toFixed(2);
        document.getElementById('ammunition_amount').innerText = (ammunition / uninfectedSurvivorsIdList.length).toFixed(2);
        document.getElementById('medication_amount').innerText = (medication / uninfectedSurvivorsIdList.length).toFixed(2);
        hideInventoryLoadingIcon();
        showInventoryReport();

    }).catch(function (error) {
        console.log(error);
    })
}

function showInventoryReport() {
    document.getElementById('inventory_report').style.display = 'block';
}

function requestSurvivorItems(survivorId) {
    return new Promise(function (resolve, reject) {
        const requestUrl = `http://zssn-backend-example.herokuapp.com/api/people/${survivorId}/properties.json`;
        const request = new XMLHttpRequest();

        request.open('GET', requestUrl);
        request.responseType = 'json';
        request.onload = function () {
            resolve(request.response);
        };
        request.onerror = function () {
            reject('Erro');
        };
        request.send();
    });
}

function hideInventoryLoadingIcon() {
    document.getElementById('inventory_loading_icon').style.display = 'none';
}