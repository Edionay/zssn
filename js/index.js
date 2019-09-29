window.addEventListener("load", function() {
    requestInfectedAverage();

    showLoadingIcon();
    requestUninfectedSurvivors().then(uninfectedIds => {

        let promises = [];
        for (let id of uninfectedIds) {
            promises.push(requestSurvivorItems(id));
        }

        return Promise.all(promises);
    }).then(inventoriesList => {

        const totalInventory = sumInventoryItems(inventoriesList);
        const itemsBySurvivor = calculateItemsAverage(totalInventory, inventoriesList.length);
        fillInventoryReportFields(itemsBySurvivor);
        hideInventoryLoadingIcon();
        showInventoryReport();

    }).catch(error => {
        console.error(error.message);
        hideInventoryLoadingIcon();
    })
});

function fillInventoryReportFields(itemsBySurvivor) {

    document.getElementById('water_amount').innerText = itemsBySurvivor.waterPerSurvivor.toFixed(2);
    document.getElementById('food_amount').innerText = itemsBySurvivor.foodPerSurvivor.toFixed(2);
    document.getElementById('ammunition_amount').innerText = itemsBySurvivor.ammunitionPerSurvivor.toFixed(2);
    document.getElementById('medication_amount').innerText = itemsBySurvivor.medicationPerSurvivor.toFixed(2);
}


function calculateItemsAverage(inventory, totalSurvivors) {

    let waterPerSurvivor = inventory.water / totalSurvivors;
    let foodPerSurvivor = inventory.food / totalSurvivors;
    let ammunitionPerSurvivor = inventory.ammunition / totalSurvivors;
    let medicationPerSurvivor = inventory.medication / totalSurvivors;

    return {
        waterPerSurvivor,
        foodPerSurvivor,
        ammunitionPerSurvivor,
        medicationPerSurvivor
    }
}

function sumInventoryItems(inventoriesList) {

    let water = 0;
    let food = 0;
    let ammunition = 0;
    let medication = 0;

    for (let inventory of inventoriesList) {
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

    return totalInventory = {
        water,
        food,
        ammunition,
        medication
    }
}

function requestInfectedAverage() {

    showLoadingIcon();
    const requestUrl = 'https://zssn-backend-example.herokuapp.com/api/report/infected.json';
    const request = new XMLHttpRequest();

    request.open('GET', requestUrl);
    request.responseType = 'json';
    request.onload = () => {

        const infectedAverage = request.response.report.average_infected;
        const uninfectedAverage = 1 - infectedAverage;

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

function requestUninfectedSurvivors() {

    return new Promise((resolve, reject) => {
        const requestUrl = 'https://zssn-backend-example.herokuapp.com/api/people.json';
        const request = new XMLHttpRequest();

        request.open('GET', requestUrl);
        request.responseType = 'json';
        request.onload = () => {

            const filteredSurvivorsIds = request.response.filter(survivor => !survivor['infected?'])
                .map(survivor => getSurvivorIdFromPath(survivor.location));
            resolve(filteredSurvivorsIds);
        };
        request.onerror = reject;
        request.send();
    });
}

function showInventoryReport() {
    document.getElementById('inventory_report').style.display = 'block';
}

function requestSurvivorItems(survivorId) {
    return new Promise(function(resolve, reject) {
        const requestUrl = `https://zssn-backend-example.herokuapp.com/api/people/${survivorId}/properties.json`;
        const request = new XMLHttpRequest();

        request.open('GET', requestUrl);
        request.responseType = 'json';
        request.onload = () => {
            resolve(request.response);
        };
        request.onerror = () => {
            reject('Erro');
        };
        request.send();
    });
}

function hideInventoryLoadingIcon() {
    document.getElementById('inventory_loading_icon').style.display = 'none';
}