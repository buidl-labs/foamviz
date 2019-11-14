import React from 'react';

const CartographerJourneyTooltip = (props) => {
  const { hoveredObjectDetails } = props || {};

  if (!hoveredObjectDetails.details) return null;

  return (
    <div
      className="cartographerJourneyTooltipStyle"
      style={{
        transform: `translate(${hoveredObjectDetails.x}px, ${hoveredObjectDetails.y}px)`,
      }}
    >
      <div>
              Source Name:
        {' '}
        {hoveredObjectDetails.details.from.name}
      </div>
      <div>
              Source Status:
        {' '}
        {hoveredObjectDetails.details.sourceStatus}
      </div>
      <div>
              Destination Name:
        {' '}
        {hoveredObjectDetails.details.to.name}
      </div>
      <div>
              Destination Status:
        {' '}
        {hoveredObjectDetails.details.destinationStatus}
      </div>
    </div>

  );
};

export default CartographerJourneyTooltip;
