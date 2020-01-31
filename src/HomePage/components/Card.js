import React from 'react';

const Card = (props) => {
  const { mp4Src, webmSrc } = props;

  return (
    <div className="card-body">
      <div className="card-img-container">
        <div className="video-container">
        <video preload="true" autoPlay loop muted playsInline width="600px">  
          <source src={webmSrc} type="video/webm" />  
          <source src={mp4Src} type="video/mp4" />  
        </video>
        </div>
      </div>
    </div>
  );
};

export default Card;
