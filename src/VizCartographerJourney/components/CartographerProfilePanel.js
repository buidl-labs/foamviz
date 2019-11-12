import React from 'react';
import { getCartographerProfile } from '../utils/helper';

const CartographerProfilePanel = (props) => {
  const { display, cartographerAddress, profileAnalytics } = props;
  const [cartographer, updateCartographer] = React.useState({});
  const [cartographerProfilePic, updateProfilePic] = React.useState('#');

  React.useEffect(() => {
    if (cartographerAddress) {
      getCartographerProfile(cartographerAddress).then((details) => {
        const cartographerProfilePic = `https://ipfs.infura.io:5001/api/v0/cat?arg=${details.image[0].contentUrl['/']}`;
        updateCartographer(details);
        updateProfilePic(cartographerProfilePic);
        // console.log(details);
      });
    }
  }, [cartographerAddress]);

  if (display === false) return null;

  return (
    <div className="abs-container">
      <div className="main-container">
        <div className="profile-panel">
          <img
            className="cartographer-profile-pic"
            alt="cartographer"
            src={cartographerProfilePic}
          />
          <h2>{cartographer.name}</h2>
        </div>
        <hr />
        <div className="cartographer-analytics">
          <p>ANALYTICS</p>
          <br />
          <span className="big-int">{profileAnalytics.points}</span>
          <p>points added</p>
          <br />
          <div>
            <span className="big-int">{profileAnalytics.challenged}</span>
            <p>points challenged</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartographerProfilePanel;
