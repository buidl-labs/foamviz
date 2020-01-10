import React from 'react';

const Card = (props) => {
  const { imageSrc } = props;

  return (
    <div className="card-body">
      <div className="card-img-container">
        <img className="card-img" alt="img" src={imageSrc} />
      </div>
    </div>
  );
};

export default Card;
