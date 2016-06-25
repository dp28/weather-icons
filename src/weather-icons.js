import * as d3 from 'd3';

export function draw(selector, width = 200, height = 200) {
  const svg = d3
    .select(selector)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const centre = { x: width / 2, y: height / 2 };
  const colour = 'gold';

  function drawCircle({ x, y }, radius) {
    return svg
      .append('circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', radius)
  };

  const innerRadius = 20;
  const outerRadius = 30;

  drawCircle(centre, innerRadius)
    .attr('fill', colour);

  function buildSunburst() {
     const sunburstPoint = {
      x: centre.x + (outerRadius * Math.sin(0)),
      y: centre.y - (outerRadius * Math.cos(0)),
    }

    const halfSunburstPointWidth = 2;

    return svg.append('rect').attr({
      x: sunburstPoint.x - halfSunburstPointWidth,
      y: sunburstPoint.y - halfSunburstPointWidth,
      width: halfSunburstPointWidth * 2,
      height: outerRadius - innerRadius,
      fill: colour
    });
  };

  const numSunbursts = 12;
  Array(numSunbursts).fill().forEach((_, i) => (
    buildSunburst().attr('transform', `rotate(${i * 360 / numSunbursts}, ${centre.x}, ${centre.y})`)
  ));

  const cloudBaseY = 150;
  const cloudRightRadius = 25;
  const cloudLeftRadius = 20;
  const cloudColour = 'grey';
  const cloudCentreWidth = 55;
  const cloudCentreStart = 50;

  function drawCloudCircle(centre, radius) {
    return drawCircle(centre, radius).attr('fill', cloudColour);
  }

  drawCloudCircle({ x: cloudCentreStart, y: cloudBaseY - cloudLeftRadius}, cloudLeftRadius);
  drawCloudCircle({ x: cloudCentreStart + cloudCentreWidth, y: cloudBaseY - cloudRightRadius}, cloudRightRadius);
  drawCloudCircle({ x: cloudCentreStart + cloudCentreWidth / 2, y: cloudBaseY - 1.65 * cloudRightRadius}, 1.1 * cloudRightRadius);
  svg.append('rect').attr({
    x: cloudCentreStart,
    y: cloudBaseY - cloudLeftRadius * 2,
    width: cloudCentreWidth,
    height: cloudLeftRadius * 2,
    fill: cloudColour
  });


  const raindropRadius = cloudLeftRadius / 2.5;
  const raindropColour = 'dodgerblue';

  drawRaindrop({ x: cloudCentreStart + cloudCentreWidth / 4, y: cloudBaseY + raindropRadius * 2 });
  drawRaindrop({ x: cloudCentreStart + cloudCentreWidth * 0.75, y: cloudBaseY + raindropRadius * 1 });

  function drawRaindrop(raindropCentre) {
    drawCircle(raindropCentre, raindropRadius).attr('fill', raindropColour);

    drawIsoscelesTriangle(raindropRadius * 1.9, -raindropRadius * 2, { x: raindropCentre.x - raindropRadius * 0.95, y: raindropCentre.y  - raindropRadius * 0.325 })
      .attr('fill', raindropColour)
      .attr('transform', `rotate(15, ${raindropCentre.x}, ${raindropCentre.y})`);
  }

  function drawIsoscelesTriangle(width, height, bottomLeft) {
    return svg.append('polyline')
      .attr('points', [
        `${bottomLeft.x} ${bottomLeft.y}`,
        `${bottomLeft.x + width / 2} ${bottomLeft.y + height}`,
        `${bottomLeft.x + width} ${bottomLeft.y}`
      ]);
    }
}

draw('body');
