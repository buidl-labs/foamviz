import React from 'react';
import a1 from '../../assets/imgs/a1.webm';

const Card = (props) => {
  const { imageSrc, gifSrc } = props;

  return (
    <div className="card-body">
      <div className="card-img-container">
        {/* <img className="card-img hide-hover" alt="img" src={imageSrc} /> */}
        {/* <img className="card-img" alt="img" src={gifSrc} /> */}
        <video autoPlay loop muted playsInline>  
          <source src={a1} type="video/webm" />  
          {/* <source src={a1} type="video/mp4" />   */}
        </video>
      </div>
    </div>
  );
};

export default Card;
