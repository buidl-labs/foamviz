import React from 'react';

const Loader = (props) => {
  const { hidden, text } = props;

  if (hidden) return null;

  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 2,
        height: '100vh',
        width: '100vw',
        backgroundColor: 'rgba(0,0,0)',
        transition: 'opacity 0.3s',
        opacity: 1
      }}
    >
      <div className="lds-ripple">
        <div />
        <div />
      </div>
      <h2
        className="w-80"
        style={{
          maxWidth: '428px',
          color: 'white',
          textAlign: 'center',
          margin: 'auto',
          marginTop: '32vh',
          fontWeight: 'bold',
          fontSize: '1.35rem'
        }}
      >
        {text}
      </h2>
    </div >
  );
};

export default Loader;
