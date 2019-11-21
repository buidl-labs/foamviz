import React from 'react';

const Tooltip = props => {
  const { allHoveredPOIDetails } = props || {};

  if (!allHoveredPOIDetails.details) return null;

  return (
    <div
      className="tooltipStyle"
      style={{
        position: 'absolute',
        zIndex: 1,
        transform: `translate(${allHoveredPOIDetails.x}px, ${allHoveredPOIDetails.y}px)`
      }}
    >
      <div className="">
        <div>Latitude: {allHoveredPOIDetails.details.latitude}</div>
        <div>Longitude: {allHoveredPOIDetails.details.longitude}</div>
        <div>POI&apos;s: {allHoveredPOIDetails.details.numOfPoints}</div>
        <div>
          Accumulated sum of FOAM tokens:{' '}
          {allHoveredPOIDetails.details.sumOfFoamTokens}
        </div>
        <div>
          Accumulated value of FOAM tokens: $
          {allHoveredPOIDetails.details.sumValInUSD}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
