import React from 'react';
import Globe from 'react-globe.gl';
import earthNight from '../imgs/earth-night.jpg';
import earthPlane from '../imgs/earth-plane.jpg';

function getColor({ sumWeight }) {
	if (sumWeight <= 2000) {
		return '#52B2F5';
	} else if (sumWeight <= 5000) {
		return '#7AF85B';
	} else if (sumWeight <= 10000) {
		return '#E1953E';
	} else {
		return '#E50538';
	}
}

export default ({ data, pointWeight, maxAltVal }) => (
	<Globe
		globeImageUrl={earthNight}
		// bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
		bumpImageUrl={earthNight}
		hexBinPointsData={data}
		hexBinPointLat={(d) => d.lat}
		hexBinPointLng={(d) => d.lng}
		hexBinResolution={4}
		hexBinPointWeight={pointWeight}
		hexAltitude={(d) => {
			const sum = Math.min(d.sumWeight, maxAltVal);
			return sum / (maxAltVal + 100);
		}}
		hexSideColor={getColor}
		hexTopColor={getColor}
		hexTransitionDuration={1000}
		hexLabel={(d) => {
			const k = d.points.reduce((acc, val) => acc + val.stakedvalue ,0)
			return `Staked Value: ${k} \n Points: ${d.sumWeight}`;
		}}
	/>
);
