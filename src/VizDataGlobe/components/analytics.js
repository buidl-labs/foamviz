import React from 'react';

export default ({ display, stackedValue, USDRate }) => {
  if (!display) return null;
  
  return (
    <div className="analytics-panel abs-container-top main-container-top">
      <h1>{ stackedValue }</h1>
      <h2>FOAM Tokens Staked</h2>
      <br />
      <h1>$ { (stackedValue * USDRate).toFixed(2) }</h1>
      <h2>Net Value Staked</h2>
      <br />
      <p className="viz-description">This globe represents an aggregate of all points from FOAMs inception till now</p>
    </div>
  );    
};
