import React from 'react';

const Legend = ({ legendColors }) => (
  <div>
    <div className="layout">
      {legendColors.map((value) => (
        <div
          key={value}
          className="legend"
          style={{ background: `${value}`, width: '16.6667%' }}
        />
      ))}
    </div>
    <p className="legend-text">
      <span>Low</span>
      <span>High</span>
    </p>
  </div>
);

export default Legend;
