import React from 'react';

const FoamNavbar = (props) => {
  const { title, info } = props;

  return (
    <div className="nav-container m-nav">
      <span className="dn m-show pull-out"></span>
      <div className="nav-heading m-text-center">
        { title }
      </div>
      <div className="nav-subheading m-text-center">
        { info }
      </div>
    </div>
  );
};

export default FoamNavbar;
