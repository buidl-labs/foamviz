import React from 'react';

const LoaderWhenFetchingData = () => (
  <div className="lds-ripple">
    <div />
    <div />
    <h2 className="text-white loader-text">Fetching POI's...</h2>
  </div>
);

export default LoaderWhenFetchingData;
