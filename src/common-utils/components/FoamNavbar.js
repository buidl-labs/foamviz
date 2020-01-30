import React from 'react';
import { Link } from 'react-router-dom';
import arrow from '../../assets/imgs/down-arrow.svg';

const FoamNavbar = (props) => {
  const { title, info, arrowUp, width } = props;

  return (
    <div className="nav-container m-nav" width={width}>
      <img src={arrow} 
      className={arrowUp ? "dn m-show pull-out rotate-arrow-180" : "dn m-show pull-out rotate-arrow-0"} />
      <div className="nav-heading m-text-center">
        {title}
      </div>
      <Link to="/" className="card-link">
        <div className="nav-subheading m-text-center">
          {info}
        </div>
      </Link>

    </div>
  );
};

export default FoamNavbar;
