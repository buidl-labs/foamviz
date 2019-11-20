import React from 'react';
import Img from 'react-image';
import { getCartographerProfile } from '../utils/helper';
import placeholder from '../../assets/imgs/person.jpeg';

const CartographerProfilePanel = (props) => {
  const {
    display,
    cartographerAddress,
    profileAnalytics,
    changeMapView,
    displayMode2D,
  } = props;
  const [cartographer, updateCartographer] = React.useState({});
  const [cartographerProfilePic, updateProfilePic] = React.useState('#');

  React.useEffect(() => {
    if (cartographerAddress) {
      getCartographerProfile(cartographerAddress)
        .then((details) => {
          const cartographerProfilePic = `https://ipfs.infura.io:5001/api/v0/cat?arg=${details.image[0].contentUrl['/']}`;
          updateCartographer(details);
          updateProfilePic(cartographerProfilePic);
        })
        .catch((error) => {
          console.log('error in getting', error);
        });
    }
  }, [cartographerAddress]);

  if (display === false) return null;

  return (
    <div className="abs-container">
      <div className="main-container">
        <div className="profile-panel">
          <Img
            className="cartographer-profile-pic"
            src={cartographerProfilePic}
            loader={<img alt="img" className="placeholder-img" src={placeholder} />}
            unloader={<img alt="img" className="placeholder-img" src={placeholder} />}
          />
          <h2>{cartographer.name}</h2>
        </div>
        <hr />
        <h3>MapView</h3>
        <div className="profile-panel">
          <div className="toggleButton">
            <button
              className="view-btn"
              style={{
                background: displayMode2D ? 'white' : 'black',
                color: !displayMode2D ? 'white' : 'black',
              }}
              onClick={() => changeMapView(0)}
            >
              2D
            </button>
            <button
              className="view-btn"
              style={{
                background: !displayMode2D ? 'white' : 'black',
                color: displayMode2D ? 'white' : 'black',
              }}
              onClick={() => changeMapView(45)}
            >
              3D
            </button>
          </div>
        </div>
        <div className="cartographer-analytics">
          <p>ANALYTICS</p>
          <br />
          <span className="big-int">{profileAnalytics.pointsAdded}</span>
          <p>points added</p>
          <br />
          <div>
            <span className="big-int">{profileAnalytics.pointsChallenged}</span>
            <p>points challenged</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartographerProfilePanel;
