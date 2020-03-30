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
      <h2
        style={{
          width: '250px',
          color: 'white',
          textAlign: 'center',
          marginTop: '12vh',
          fontWeight: 'bold',
          fontSize: '1.35rem',
          marginLeft: '-75px'
        }}
      >Fetching POI's...</h2>
    </div>
  </div>
);

export default LoaderWhenFetchingData;
