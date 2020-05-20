import React, { useEffect, useState } from 'react';
import * as topojson from 'topojson';
import * as d3 from 'd3';
import { json } from 'd3-request';

const draw = (data, svg, setState) => {
  const projection = d3.geoMercator().translate([-1300, 800]).scale(1100);

  const path = d3.geoPath().projection(projection).pointRadius(2);

  const states = topojson.feature(data, data.objects['india-states-edited-2'])
    .features;

  svg
    .selectAll('.state')
    .data(states)
    .enter()
    .append('path')
    .attr('class', (d) => `state P${d.properties.OBJECTID}`)
    .attr('d', path)
    .on('click', (d) => {
      console.log(d.properties.NAME_1);
      setState({
        name: d.properties.NAME_1,
        code: d.properties.OBJECTID
      });
    });
};

function India2() {
  const [mapData, setMapData] = useState(null);
  const [state, setState] = useState({ name: null, code: null });
  const height = 680;
  const width = 590;

  useEffect(() => {
    json('data2.json', function (data) {
      setMapData(data);
    });
  }, []);

  useEffect(() => {
    console.log(mapData);
    if (mapData !== null) {
      const svg = d3.select('#map');
      draw(mapData, svg, setState);
    }
  }, [mapData]);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `.P${state.code}{fill:rgba(0, 123, 255, 0.5) !important;}`
        }}
      ></style>
      <div>
        <p>State: {state.name || 'None Selected'}</p>
        <svg height={height} width={width} id="map"></svg>
      </div>
    </>
  );
}

export default India2;
