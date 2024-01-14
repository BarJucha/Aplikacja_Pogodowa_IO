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

function drawInterpolatedPolynomialChart(svgId, points, size = "big") {
    const svg = d3.select(`#${svgId}`);
    const numPoints = 120;
    const dataPoints = generateInterpolatedValues(points, numPoints);

    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;

    let xMax;
    let yMin;

    // Usuń poprzedni wykres, etykiety i strzałki
    svg.selectAll('.line').remove();
    svg.selectAll('.label').remove();
    svg.selectAll('.label-background').remove();
    svg.selectAll('.arrow').remove();

    if (size === "big") {
        // Ustaw zakres x dla "big"
        xMax = numPoints - 20;
        // Ustaw minimalną wartość y na 10 dla "big"
        yMin = 10;
    } else if (size === "small") {
        // Ustaw zakres x dla "small"
        xMax = points[points.length - 1].x;
        // Pozostaw domyślne wartości dla "small"
        yMin = d3.min(dataPoints);
    }

    // Użyj skal x i y, aby dopasować do szerokości i wysokości SVG
    const xScale = d3.scaleLinear()
        .domain([0, xMax])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([yMin, d3.max(dataPoints)])
        .range([height, 0]);

    const line = d3.line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d));

    svg.append('path')
        .datum(dataPoints)
        .attr('class', 'line')
        .attr('d', line)
        .style('stroke-width', size === "small" ? 2 : 0)
        .style('stroke', size === "small" ? "black" : "none")
        .style('fill', size === "big" ? "rgba(255,255,255,0.1)" : "none");

    if (size === "small") {
        const labels = svg.selectAll('.label')
            .data(points.slice(1, -1)) // Usuń pierwszą i ostatnią etykietę
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', d => xScale(d.x))
            .attr('y', d => {
                const interpolatedY = lagrangeInterpolation(points, d.x);
                const offset = 100; // Dostosuj offset
                const yPosition = yScale(interpolatedY) - offset;
                return yPosition < offset ? offset : yPosition;
            })
            .text(d => `${d.z}, ${Math.round(d.y * 10) / 10}`)
            .style('text-anchor', 'middle')
            .style('alignment-baseline', 'middle')
            .style('fill', 'black');

        labels.each(function (d) {
            const label = d3.select(this);
            const bbox = label.node().getBBox();
            svg.insert('rect', ':first-child')
                .attr('class', 'label-background')
                .attr('x', bbox.x - 5)
                .attr('y', bbox.y - 2)
                .attr('width', bbox.width + 10)
                .attr('height', bbox.height + 4)
                .attr('rx', 5)
                .attr('ry', 5)
                .style('fill', 'white');
        });
    }

}



