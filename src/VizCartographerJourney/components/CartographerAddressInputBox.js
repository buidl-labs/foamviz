import React from 'react';

const CartographerAddressInputBox = (props) => {
  const { display, getCartographerDetails } = props;

  if (display === false) return null;

  return (
    <div className="abs-container">
      <input
        id="cartographer-address"
        className="address-input-box main-container"
        type="text"
        placeholder="Enter Cartographer Address"
        onKeyPress={getCartographerDetails}
      />
    </div>
  );
};

export default CartographerAddressInputBox;
