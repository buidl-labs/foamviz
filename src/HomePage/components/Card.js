import React from 'react';

const Card = (props) => {
  const { mp4Src, webmSrc } = props;

  return (
    <video preload="true" autoPlay loop muted playsInline >  
      <source src={webmSrc} type="video/webm" />  
      <source src={mp4Src} type="video/mp4" />  
    </video>
  );
};

export default Card;
