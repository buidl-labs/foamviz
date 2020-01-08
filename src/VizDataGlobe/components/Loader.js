import React from 'react';

const Loading = (props) => {
  const { display } = props;

  if (!display) return null;

  return (
    <div className="lds-ripple">
      <div />
      <div />
      <h2 className="text-white loader-text">Please wait, while we are fetching your data...</h2>
    </div>
  );
};

export default Loading;
