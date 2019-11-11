import React from 'react';
import Box from '3box';

const x = async () => {
  const profile = await Box.getProfile('0x1de5366615bceb1bdb7274536bf3fc9f06aa9c2c');
  console.log(profile);
};

const CartographerProfilePanel = (props) => {
  const { display, cartographerAddress } = props;

  x();

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
          <h2>name</h2>
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
