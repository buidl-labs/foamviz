import React from 'react';

const Card = (props) => {
  const { imageSrc, title, description } = props;

  return <div className="card-body">
    <div className="card-img-container">
      <img className="card-img" src={imageSrc} />
    </div>
    <div className="card-inner-body">
      <span className="card-title">{title}</span>
      <p className="card-desc">{description}</p>
    </div>
  </div>
}

export default Card;