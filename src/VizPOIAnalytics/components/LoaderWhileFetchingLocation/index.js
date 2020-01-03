import React from 'react';

const LoaderWhileFetchingLocation = () => (
  <div
    style={{
      position: 'absolute',
      zIndex: 2,
      height: '100vh',
      width: '100vw',
      backgroundColor: 'rgba(0,0,0,0.5)',
      transition: 'opacity 0.3s',
      opacity: 1
    }}
  >
    <div className="lds-ripple">
      <div />
      <div />
    </div>
    <h2
      className
      style={{
        width: '50rem',
        color: 'white',
        textAlign: 'center',
        margin: 'auto',
        marginTop: '30vh'
      }}
    >
      Waiting for User Location. If denied, Viz will redirect to FOAM HQ City
      i.e New York
    </h2>
  </div>
);

export default LoaderWhileFetchingLocation;
