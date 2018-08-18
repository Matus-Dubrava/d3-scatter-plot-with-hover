// x-scale  birhts /population
// y-scale lifeExpectancy
// radius-scale Births [2, 40]
// color-scale population / area [lightgreen, black]

const height = 600;
const width = 600;
const padding = 50;

const xScale = d3.scaleLinear()
                 .domain(d3.extent(birthData2011, (d) => d.births / d.population))
                 .range([padding, width - padding]);

const xAxis = d3.axisBottom(xScale)
                .tickSize(-width + 2 * padding)
                .tickSizeOuter(0);

const yScale = d3.scaleLinear()
                 .domain(d3.extent(birthData2011, (d) => d.lifeExpectancy))
                 .range([height - padding, padding]);

const yAxis = d3.axisLeft(yScale)
               .tickSize(-height + 2 * padding)
               .tickSizeOuter(0);

const colorScale = d3.scaleLinear()
                     .domain(d3.extent(birthData2011, (d) => d.population / d.area))
                     .range(['lightgreen', 'black']);

const radiusScale = d3.scaleLinear()
                      .domain(d3.extent(birthData2011, (d) => d.births))
                      .range([2, 40]);

const svg = d3.select('svg')
              .attr('width', width)
              .attr('height', height);

const tooltip = d3.select('body')
                  .append('div')
                    .classed('tooltip', true);

svg
  .selectAll('circle')
  .data(birthData2011)
  .enter()
  .append('circle')
    .attr('cx', (d) => xScale(d.births / d.population))
    .attr('cy', (d) => yScale(d.lifeExpectancy))
    .attr('r', (d) => radiusScale(d.births))
    .attr('fill', (d) => colorScale(d.population / d.area))
    .attr('stroke', '#f3f3f3')
    .on('mousemove', (d) => {
      tooltip
        .style('opacity', 1)
        .style('left', d3.event.x - 100 + 'px')
        .style('top', d3.event.y + 30 + 'px')
        .html(`
          <p>Region: ${d.region}</p>
          <p>Births: ${d.births.toLocaleString()}</p>
          <p>Population: ${d.population.toLocaleString()}</p>
          <p>Area: ${d.area.toLocaleString()}</p>
          <p>Life Expectancy: ${d.lifeExpectancy.toLocaleString()}</p>
        `);
      d3.select(d3.event.target)
        .attr('fill', '#993e06');

      console.log(d3.event.target);

    })
    .on('mouseout', (d) => {
      tooltip.style('opacity', 0);
      d3.select(d3.event.target)
        .attr('fill', (d) => colorScale(d.population / d.area));
    })

svg
  .append('g')
    .attr('transform', `translate(0, ${height - padding})`)
    .call(xAxis);

svg
  .append('g')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis);

svg
  .append('text')
    .text('Births per Capita')
    .attr('x', width / 2)
    .attr('y', height - 20)
    .style('text-anchor', 'middle');

svg
  .append('text')
    .text('Life Expectancy')
    .attr('x', - height / 2)
    .attr('y', 20)
    .attr('transform', 'rotate(-90)')
    .style('text-anchor', 'middle');

svg
  .append('text')
    .text('Life Expectancy based on Births per Capita for 2011')
    .attr('x', width / 2)
    .attr('y', 20)
    .style('text-anchor', 'middle')
    .style('font-size', '1.5em');
