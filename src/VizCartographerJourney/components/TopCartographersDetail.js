import React from 'react';

const TopCartographersDetails = props => {
  const { display, topCartographers, getCartographerDetails } = props;

  React.useEffect(() => {
    topCartographers().then(data => setCartographers(data))
  }, []);

  const [top5Cartographers, setCartographers] = React.useState([]);

  if(display === false) return null;

  return (
    <div className="top-c-container">
    {
      top5Cartographers.map((c, key) => (
        <div key={key} className="top-c address-input-box main-container" onClick={() => getCartographerDetails(c.user)}>
          <div>{c.user}</div>
          <div>Points on map: {c.points_on_map}</div>
        </div>
        )
      )
    }
    </div>
  );
};

export default TopCartographersDetails;
