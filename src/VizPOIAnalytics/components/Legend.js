import React from 'react';
import * as CONSTANTS from '../utils/constants';

const Legend = () => (
  <div>
    <div className="layout">
      {CONSTANTS.legendColors.map((value) => (
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
