let numberOfCharacters = document.querySelector(".numberOfCharacters");
let numberOfMoons = document.querySelector(".numberOfMoons");
let numberOfPlanets = document.querySelector(".numberOfPlanets");
let numberOfVehicles = document.querySelector(".numberOfVehicles");

fillInformations();
fillTable();

function swapiGet(param) {
  return axios.get(`https://swapi.dev/api/${param}`);
}

function fillInformations() {
  Promise.all([
    swapiGet("people/"),
    swapiGet("starships/"),
    swapiGet("planets/"),
    swapiGet("vehicles/"),
  ]).then(function (results) {
    numberOfCharacters.innerHTML = results[0].data.count;
    numberOfMoons.innerHTML = results[1].data.count;
    numberOfPlanets.innerHTML = results[2].data.count;
    numberOfVehicles.innerHTML = results[3].data.count;
  });
}

async function fillTable() {
  const response = await swapiGet("films/");
  const arrayLength = response.data.results.length;
  for (let n = 0; n <= arrayLength - 1; n++) {
    $(".filmesTable").append(`
            <tbody><tr>
                <td>${response.data.results[n].title}</td> 
                <td>${moment(response.data.results[n].release_date).format(
                  "DD/MM/YYYY"
                )}</td>
                <td>${response.data.results[n].director}</td>
                <td>${response.data.results[n].episode_id}</td>
            </tr></tbody>`);
  }
}

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

async function drawChart() {
  const response = await swapiGet("vehicles/");
  const vehiclesArray = response.data.results;

  const dataArray = [];
  dataArray.push(["Veículos", "Passageiros"]);
  vehiclesArray.forEach((vehicle) => {
    dataArray.push([vehicle.name, Number(vehicle.passengers)]);
  });

  var data = google.visualization.arrayToDataTable(dataArray);

  var options = {
    colors: ["#FFEC00", "#FFAF00", "#FF7300", "#FF0000", "#E01E84"],
    chartArea: {
      width: "95%",
      height: "100%",
    },
    legend: {
      position: "right",
      alignment: "center",
    },
    sliceVisibilityThreshold: 0.1 / 5,
  };

  var chart = new google.visualization.PieChart(
    document.getElementById("piechart")
  );

  chart.draw(data, options);
}
