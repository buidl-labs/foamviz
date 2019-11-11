import React from 'react';

const CartographerAddressInputBox = (props) => {
  const { showInputBox, getCartographerDetails } = props;

  if (showInputBox === false) return null;

  return (
    <div className="address-container">
      <input
        id="cartographer-address"
        className="address-input-box"
        type="text"
        placeholder="Enter Cartographer Address"
        onKeyPress={getCartographerDetails}
      />
    </div>
  );
};

export default CartographerAddressInputBox;
