function lagrangeInterpolation(points, x) {
    let result = 0;
    for (let i = 0; i < points.length; i++) {
        let term = points[i].y;
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                term = term * (x - points[j].x) / (points[i].x - points[j].x);
            }
        }
        result += term;
    }
    return result + 10;
}

function generateInterpolatedValues(points, numPoints) {
    const interpolatedValues = [];
    const minX = Math.min(...points.map(point => point.x));
    const maxX = Math.max(...points.map(point => point.x));
    const step = (maxX - minX) / (numPoints - 1);

    for (let i = 0; i < numPoints; i++) {
        const x = minX + i * step;
        const y = lagrangeInterpolation(points, x);
        interpolatedValues.push(y);
    }

    return interpolatedValues;
}

function drawInterpolatedPolynomialChart(points) {
    const numPoints = 120;
    const dataPoints = generateInterpolatedValues(points, numPoints);

    var ctx = document.getElementById('interpolatedPolynomialChart').getContext('2d');

    // Pobierz kolor tła z mainstyles
    const mainStyles = window.getComputedStyle(document.body);
    const backgroundColor = mainStyles.backgroundColor;

    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: numPoints }, (_, i) => i),
            datasets: [{
                label: '',
                borderColor: backgroundColor,
                data: dataPoints,
                fill: true,
                borderWidth: 0, // Grubość linii
                backgroundColor: `rgba(255,255,255, 0.15)`, // Użyj koloru tła z mainstyles
            }]
        },
        options: {
            layout: {
                padding: 0,
            },
            scales: {
                x: {
                    display: false, // Ukryj oś X
                    max: numPoints - 20,
                    min: 1
                },
                y: {
                    display: false, // Ukryj oś Y
                    min: 5
                }
            },
            plugins: {
                legend: {
                    display: false, // Ukryj legendę
                }
            },
            elements: {
                point: {
                    radius: 0 // Ukryj punkty danych
                }
            }
        }
    });
}
