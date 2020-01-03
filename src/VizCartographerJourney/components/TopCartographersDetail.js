import React from 'react';
import placeholder from '../../assets/imgs/person.jpeg';
import Img from 'react-image';
import { getCartographerProfile } from '../utils/helper';

const TopCartographersDetails = props => {
  const { display, topCartographers, getCartographerDetails } = props;
  
  const [top5Cartographers, setCartographers] = React.useState([]);

  React.useEffect(() => {
    topCartographers().then(data => {
      const promise = Promise.all(data.map(c => {
        return getCartographerProfile(c.user).then(details => {
          return Promise.resolve({
            ...c,
            pic: `https://ipfs.infura.io:5001/api/v0/cat?arg=${details.image[0].contentUrl['/']}`
          });
        }).catch(() => Promise.resolve(c))
      }));
      promise.then((cartographers) => {
        setCartographers(cartographers);
      });
    });
  }, [topCartographers]);

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
                      src={(c && c.pic) || ''}
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
                    <div>{c && c.user}</div>
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
