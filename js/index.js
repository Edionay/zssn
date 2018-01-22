window.addEventListener("load", function () {
    requestInfectedAverage();
});


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

function infectionReport(survivorsList) {
    let infected = 0, uninfected = 0, totalOfSurvivors = 0;

    for (let survivor of survivorsList) {
        if (survivor['infected?']) {
            infected++;
        } else {
            uninfected++;
        }
        totalOfSurvivors++
    }

    document.getElementById('total_of_survivors').innerText = totalOfSurvivors;
    document.getElementById('uninfected_survivors').innerText = uninfected;
    document.getElementById('infected_survivors').innerText = infected;

    console.log(`Survivors: ${totalOfSurvivors}, Infected: ${infected}, Uninfected: ${uninfected}`);
}

function showReportInfo() {
    document.getElementById('report').style.display = 'block';
}

