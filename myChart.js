// Add an event listener to the HTML element with the id 'renderBtn'. That's our 
// button. When the event 'click' happens (when the button is clicked), run the 
// function 'logCountryCode'.
document.getElementById('renderBtn').addEventListener('click', fetchData);

async function fetchData() {
    var countryCode = document.getElementById('country').value;
    const indicatorCode = 'SP.POP.TOTL';
    const baseUrl = 'https://api.worldbank.org/v2/country/';
    const url = baseUrl + countryCode + '/indicator/' + indicatorCode + '?format=json';
    console.log('Fetching data from URL: ' + url);

    var response = await fetch(url);

    if (response.status == 200) {
        var fetchedData = await response.json();
        console.log(fetchedData);

        var data = getValues(fetchedData);
        var labels = getLabels(fetchedData);
        var countryName = getCountryName(fetchedData);
        var indicatorName = getIndicatorName(fetchedData);
        renderChart(data, labels, countryName, indicatorName);
    }
}

function getValues(data) {
    var vals = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
    return vals;
}

function getLabels(data) {
    var labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
    return labels;
}

function getCountryName(data) {
    var countryName = data[1][0].country.value;
    return countryName;
}
function getIndicatorName(data) {
    var indicatorName = data[1][0].indicator.value;
    return indicatorName;
}



function renderChart(data, labels, countryName) {
    var ctx = document.getElementById('myChart').getContext('2d');

    var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, "#FA5B50");
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
                label: 'Population, ' + countryName,
                data: data,
                borderColor: gradientStroke,
                backgroundColor: gradientStroke,
            }]
        },
        options: {
            scale: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                       
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