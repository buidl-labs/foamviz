import React from 'react';
import Globe from 'react-globe.gl';
import earthNight from '../imgs/earth-night.jpg';
import earthPlane from '../imgs/earth-plane.jpg';

const getColor = ({ sumWeight }) => {
  if (sumWeight <= 2000) {
    return '#52B2F5';
  } if (sumWeight <= 5000) {
    return '#7AF85B';
  } if (sumWeight <= 10000) {
    return '#E1953E';
  }
  return '#E50538';
};

const tooltipInfo = (d, USDRate) => {

  const numOfStakedPOIs = d.points.length;
  const totalValueOfStakedPOIs = d.sumWeight;
  const USDValueOfStakedPOIs = parseFloat((d.sumWeight * USDRate).toFixed(4));

  return (
    `
      <div
        class="tooltipStyle"
      >
        <div class="tooltip-key">
          Number of POI's:
          <span class="tooltip-value">
            ${'  ' + numOfStakedPOIs}
          </span>
        </div>
        <div class="tooltip-key">
          Accumulated sum of FOAM tokens:
          <span class="tooltip-value">
          ${'  ' + totalValueOfStakedPOIs}
          </span>
        </div>
        <div class="tooltip-key">
          Accumulated value of FOAM tokens:
          <span class="tooltip-value">
          ${'$ ' + USDValueOfStakedPOIs}
          </span>
        </div>
      </div>
    `
  );
};

export default ({
  data,
  pointWeight,
  maxAltVal,
  interactive,
  rotationStatus,
  resolution = 4,
  USDRate,
}) => {
  const globeEl = React.useRef();

  React.useEffect(() => {
    globeEl.current.controls().autoRotate = !!rotationStatus;
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
      hexBinResolution={resolution}
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
        powerPreference: 'high-performance',
      }}
      hexLabel={(d) => tooltipInfo(d, USDRate)}
    />
  );
};
