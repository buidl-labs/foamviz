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
      <div className="tooltip-key dm-none">Latitude:
        {' '}
        <span className="tooltip-value">
          {allHoveredPOIDetails.details.latitude}
        </span>
      </div>
      <div className="tooltip-key dm-none">Longitude:
        {' '}
        <span className="tooltip-value">
          {allHoveredPOIDetails.details.longitude}
        </span>
      </div>
      <div className="tooltip-key">POI&apos;s:
        {' '}
        <span className="tooltip-value">
          {allHoveredPOIDetails.details.numOfPoints}
        </span>
      </div>
      <div className="tooltip-key">
        Accumulated sum of FOAM tokens:
        {' '}
        <span className="tooltip-value">
          {allHoveredPOIDetails.details.sumOfFoamTokens}
        </span>
      </div>
      <div className="tooltip-key">
        Accumulated value of FOAM tokens:
        {' '}
        <span className="tooltip-value">
          {'$ ' + allHoveredPOIDetails.details.sumValInUSD}
        </span>
      </div>
    </div>
  );
};

export default Tooltip;
