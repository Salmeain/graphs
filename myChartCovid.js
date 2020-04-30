// Add an event listener to the HTML element with the id 'renderBtn'. That's our 
// button. When the event 'click' happens (when the button is clicked), run the 
// function 'logCountryCode'.
document.getElementById('renderBtn').addEventListener('click', fetchData);

async function fetchData() {
    var areaCode = document.getElementById('area').value;
    //const indicatorCode = 'SP.POP.TOTL';
    const url = 'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/processedThlData';
    //const url = baseUrl + areaCode + '/indicator/' + indicatorCode + '?format=json';
    console.log('Fetching data from URL: ' + url);

    var response = await fetch(url);

    if (response.status == 200) {
        var fetchedData = await response.json();
        console.log(fetchedData);

        var data = getValuesCorona(fetchedData, areaCode);
        var labels = getLabelsCorona(fetchedData, areaCode);
        var areaName = getAreaName(fetchedData, areaCode);
        renderChart(data, labels, areaName);
    }
}

function getValuesCorona(data, areaCode) {
    var vals = data.confirmed[areaCode].sort((a, b) => a.date - b.date).map(item => item.value);
    return vals;
}

function getLabelsCorona(data, areaCode) {
    var labels = data.confirmed[areaCode].sort((a, b) => a.date - b.date).map(item => item.date.substring(0,10));
    return labels;
}

function getAreaName(data, areaCode) {
    var areaName = data.confirmed[areaCode][0].healthCareDistrict;
    return areaName;
}



function renderChart(data, labels, areaName) {
    var ctx = document.getElementById('myChart').getContext('2d');

    var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, "#f49080");
    gradientStroke.addColorStop(1, "#0066cc");
    
    if (currentChart) {
        // Clear the previous chart if it exists
        currentChart.destroy();
    }
    // Draw new chart
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Region, ' + areaName,
                data: data,
                borderColor: gradientStroke,
                backgroundColor: gradientStroke,
            }]
        },
        options: {
            scale: {
                yAxes: [{
                    ticks: {
                        //beginAtZero: true,
                       
                    },
                }]
            }
        },
        options: {
            animation: {
                duration: 10000
            }
          }
        
    });
}

var currentChart;