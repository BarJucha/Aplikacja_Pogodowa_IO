// Rysowanie funkcji w tle za pomocą interpolacji
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

    return result;
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

function backgroundDrawInterpolatedPolynomialChart(points) {
    const numPoints = 120;
    const dataPoints = generateInterpolatedValues(points, numPoints);

    var ctx = document.getElementById('interpolatedPolynomialChart').getContext('2d');


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
                borderWidth: 0,
                backgroundColor: `rgba(255,255,255, 0.15)`,
            }]
        },
        options: {
            layout: {
                padding: 0,
            },
            scales: {
                x: {
                    display: false,
                    max: numPoints - 20,
                    min: 1
                },
                y: {
                    display: false,
                    min: 5
                }
            },
            plugins: {
                legend: {
                    display: false,
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            }
        }
    });
}

// Rysowanie wykresu danych pogodowych na najbliższe godziny

function drawFunctionFromPoints(points) {
    const svg = d3.select("#hourlyForecast");

    if (!svg.node()) {
        console.error("Element SVG nie został znaleziony");
        return;
    }

    svg.select("g").remove();
    svg.select("text").remove();

    const width = svg.node().clientWidth * 0.9;
    const height = svg.node().clientHeight * 0.9;

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "20")
        .text("Godzinowy wykres pogodowy");

    const xScale = d3.scaleLinear()
        .domain([0, points.length - 1])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(points, d => d.y - 5), d3.max(points, d => d.y + 5)])
        .range([height, 0]);

    const g = svg.append("g")
        .attr("transform", `translate(${width * 0.05},${height * 0.05})`);

    const line = d3.line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d.y));

    g.append("path")
        .data([points])
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("d", line);

    let tooltip, foreignObject;

    const pointsGroup = g.selectAll("circle")
        .data(points)
        .enter().append("circle")
        .attr("class", "data-point")
        .attr("cx", (d, i) => xScale(i))
        .attr("cy", d => yScale(d.y))
        .attr("r", 5)
        .on("mouseover", function (event, d) {

            tooltip = g.append("rect")
                .attr("class", "tooltip-bg")
                .attr("tooltip-bg", "white")
                .attr("x", xScale(points.indexOf(d)) - 40)
                .attr("y", yScale(d.y) - 45)
                .attr("width", 80)
                .attr("height", 40)
                .attr("rx", 5)
                .attr("ry", 5);

            foreignObject = g.append("foreignObject")
                .attr("x", xScale(points.indexOf(d)) - 40)
                .attr("y", yScale(d.y) - 45)
                .attr("width", 120)
                .attr("height", 60);

            const tooltipDiv = foreignObject.append("xhtml:div")
                .attr("class", "tooltip-text")
                .html(getTooltipText(d));
        })

        .on("mouseout", function () {
            if (tooltip) tooltip.remove();
            if (foreignObject) foreignObject.remove();
        });
}

function getTooltipText(d) {
    let temperatureText;
    if (temperatureUnit === 1) {
        temperatureText = `${d.y}°F`;
    } else {
        temperatureText = `${d.y}°C`;
    }

    return `${temperatureText}<br>time: ${d.z}`;
}



// Wybór losowych punktów do interpolacji

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomPoints(count) {
    const points = [];
    for (let i = 0; i < count; i++) {
        points.push({ x: i + 1, y: getRandomInt(5, 25) });
    }
    return points;
}






