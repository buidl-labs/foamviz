import React from 'react';

const LoaderWhenFetchingData = () => (
  <div
    style={{
      position: 'absolute',
      zIndex: 2,
      height: '100vh',
      width: '100vw',
      backgroundColor: 'rgba(0,0,0,0.5)',
      transition: 'opacity 0.3s',
      opacity: 1,
    }}
  >
    <div className="lds-ripple">
      <div />
      <div />
      <h2 className="text-white loader-text">Fetching POI's...</h2>
    </div>
  </div>
);

export default LoaderWhenFetchingData;
