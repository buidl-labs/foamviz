import React from 'react';
import Box from '3box';

const x = async (cartographerAddress) => {
  const profile = await Box.getProfile(cartographerAddress);
  // console.log(profile);
  return Promise.resolve(profile);
};

const CartographerProfilePanel = (props) => {
  const { display, cartographerAddress } = props;

  const cartographer = x(cartographerAddress);
  console.log('car: ', cartographer);

  if (display === false) return null;

  return (
    <div className="abs-container">
      <div className="main-container">
        <div className="profile-panel">
          <img
            className="cartographer-profile-pic"
            alt="cartographer"
            src="https://ipfs.infura.io:5001/api/v0/cat?arg=QmZF7cLSWSPhEMFPqK4t5gH3kzd1bD89cNkudzY3844NF4"
          />
          <h2>{cartographer.name}</h2>
        </div>
        <hr />
        <div className="cartographer-analytics">
          <p>ANALYTICS</p>
          <br />
          <span className="big-int">300</span>
          <p>points added</p>
          <br />
          <div>
            <span className="big-int">7</span>
            <p>points added</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartographerProfilePanel;
