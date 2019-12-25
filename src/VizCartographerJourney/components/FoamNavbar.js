import React from 'react';

const FoamNavbar = (props) => {
  const { display } = props;

  // if (display === false) return null;

  return (
    <div className="nav-container">
    <div className="nav-heading">Cartographer Journey</div>
    <div className="nav-subheading">Part of FoamViz project</div>
    </div>
  );
};

export default FoamNavbar;
