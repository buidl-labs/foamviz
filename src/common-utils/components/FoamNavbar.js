import React from 'react';

const FoamNavbar = (props) => {
  const { title, info } = props;

  return (
    <div className="nav-container">
      <div className="nav-heading">
        { title }
      </div>
      <div className="nav-subheading">
        { info }
      </div>
    </div>
  );
};

export default FoamNavbar;
