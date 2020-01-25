import React from 'react';

const Loading = (props) => {
  const { display } = props;

  if (!display) return null;

  return (
    <div style={{
      position: 'absolute',
      zIndex: 2,
      height: '100vh',
      width: '100vw',
      backgroundColor: 'rgba(0,0,0,0.5)',
      transition: 'opacity 0.3s',
      opacity: 1
    }}>
      <div className="lds-ripple">
        <div />
        <div />
        <h2 className="w-80"
          style={{
            minWidth: '428px',
            color: 'white',
            textAlign: 'center',
            margin: 'auto',
            marginTop: '30vh'
          }}>Please wait, while we are fetching your data...</h2>
      </div>
    </div>

  );
};

export default Loading;
