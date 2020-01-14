import React from 'react';

const Card = (props) => {
  const { imageSrc, gifSrc } = props;

  return (
    <div className="card-body">
      <div className="card-img-container">
        <img className="card-img hide-hover" alt="img" src={imageSrc} />
        <img className="card-img" alt="img" src={gifSrc} />
      </div>
    </div>
  );
};

export default Card;
