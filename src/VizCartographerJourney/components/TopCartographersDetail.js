import React from 'react';
import placeholder from '../../assets/imgs/person.jpeg';
import Img from 'react-image';
import { getCartographerProfile } from '../utils/helper';

const TopCartographersDetails = props => {
  const { display, topCartographers, getCartographerDetails } = props;

  React.useEffect(() => {
    topCartographers().then(data => setCartographers(data));
  }, []);

  const [top5Cartographers, setCartographers] = React.useState([]);
  const [cartographerProfilePic, updateProfilePic] = React.useState('#');

  React.useEffect(() => {
    if (top5Cartographers.length) {
      top5Cartographers.forEach(c => {
        getCartographerProfile(c.user)
          .then(details => {
            const cartographerProfilePic = `https://ipfs.infura.io:5001/api/v0/cat?arg=${details.image[0].contentUrl['/']}`;
            updateProfilePic(cartographerProfilePic);
          })
          .catch(error => {
            console.log('error in getting', error);
          });
      });
    }
  }, [top5Cartographers]);

  if (!display) return null;

  return (
    <React.Fragment>
      {top5Cartographers.length ? (
        <div className="top-c-main-container">
          <h2 className="top-c-heading">Top 5 Cartographers</h2>
          <div className="top-c-container">
            {top5Cartographers.map((c, key) => (
              <div
                key={key}
                className="top-c address-input-box main-container"
                onClick={() => getCartographerDetails(c.user)}
              >
                <div className="info-container">
                  <div className="top-c-photo-container">
                    <Img
                      className="top-cartographer-profile-pic"
                      src={cartographerProfilePic}
                      loader={
                        <div className="lds-spinner">
                          <div />
                          <div />
                          <div />
                          <div />
                          <div />
                          <div />
                          <div />
                          <div />
                          <div />
                          <div />
                          <div />
                          <div />
                        </div>
                      }
                      unloader={
                        <img
                          alt="img"
                          className="top-cartographer-profile-pic"
                          src={placeholder}
                        />
                      }
                    />
                  </div>
                  <div className="address">
                    <div>{c.user}</div>
                    <div>Points on map: {c.points_on_map}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </React.Fragment>
  );
};

export default TopCartographersDetails;
