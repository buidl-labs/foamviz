import React from 'react';

const CartographerJourneyTooltip = (props) => {
  const { hoveredObjectDetails } = props || {};

  if (!hoveredObjectDetails.details) return null;

  if (!hoveredObjectDetails.type) {
    return (
      <div
        className="cartographerJourneyTooltipStyle m-tooltip"
        style={{
          transform: `translate(${hoveredObjectDetails.x}px, ${hoveredObjectDetails.y}px)`,
        }}
      >
        <div className="tooltip-key">
          From
          {' '}
          <span className="tooltip-value">
            {hoveredObjectDetails.details.from.name}
          </span>
          <br />
          to
          {' '}
          <span className="tooltip-value">
            {hoveredObjectDetails.details.to.name}
          </span>
        </div>
        <br />
        <div className="tooltip-key">
                Source Status:
          {' '}
          <span className="tooltip-value">
            {hoveredObjectDetails.details.sourceStatus}
          </span>
        </div>
        <div className="tooltip-key">
                Destination Status:
          {' '}
          <span className="tooltip-value">
            {hoveredObjectDetails.details.destinationStatus}
          </span>
        </div>
      </div>
    );
  }

  if (hoveredObjectDetails.type) {
    return (
      <div
        className="cartographerJourneyTooltipStyle"
        style={{
          transform: `translate(${hoveredObjectDetails.x}px, ${hoveredObjectDetails.y}px)`,
        }}
      >
        <div className="tooltip-key">
                Place:
          {' '}
          <span className="tooltip-value">
            {hoveredObjectDetails.details.from.name}
          </span>
        </div>
        <div className="tooltip-key">
                Staked Value:
          {' '}
          <span className="tooltip-value">
            {hoveredObjectDetails.details.stakedValue.toFixed(2)}
            {' '}
            FOAM tokens
          </span>
        </div>
      </div>
    );
  }
};

export default CartographerJourneyTooltip;
