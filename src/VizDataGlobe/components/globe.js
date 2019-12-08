import React from 'react';
import Globe from 'react-globe.gl';
import earthNight from '../imgs/earth-night.jpg';
import earthPlane from '../imgs/earth-plane.jpg';

const getColor = ({ sumWeight }) => {
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

const tooltipInfo = (d) => {
  const k = d.points.reduce((acc, val) => acc + val.stakedvalue ,0)
  return (
    `
      <div
        class="tooltipStyle"
        style="position: 'absolute'; z-index: 1;"
      >
        <div class="tooltip-key">
          Staked Value <span class="tooltip-value"> ${k} </span>
        </div>
        <div class="tooltip-key">
          Points
          <span class="tooltip-value">
            ${d.sumWeight}
          </span>
        </div>
      </div>
    `
  )
}

export default ({ data, pointWeight, maxAltVal, interactive, rotationStatus }) => {

  const globeEl = React.useRef();

  React.useEffect(() => {
    globeEl.current.controls().autoRotate = rotationStatus ? true : false;
    globeEl.current.controls().autoRotateSpeed = 0.1;
  }, [rotationStatus]);

  return (
    <Globe
      ref={globeEl}
      globeImageUrl={earthNight}
      bumpImageUrl={earthPlane}
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
      resumeAnimation={interactive}
      pauseAnimation={!interactive}
      enablePointerInteraction={interactive}
      rendererConfig={{
        alpha: false,
        antialias: false,
        powerPreference: 'high-performance'
      }}
      hexLabel={(d) => tooltipInfo(d)}
    />
  )
};
