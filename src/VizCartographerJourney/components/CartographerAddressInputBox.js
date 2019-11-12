import React from 'react';

const CartographerAddressInputBox = (props) => {
  const { display, getCartographerDetails } = props;

  let cartographerAddressInput = null;

  React.useEffect(() => {
    if (display) cartographerAddressInput.focus();
  });

  if (display === false) return null;

  return (
    <div className="abs-container">
      <input
        id="cartographer-address"
        ref={(input) => { cartographerAddressInput = input; }}
        className="address-input-box main-container"
        type="text"
        placeholder="Enter Cartographer Address"
        onKeyPress={getCartographerDetails}
      />
    </div>
  );
};

export default CartographerAddressInputBox;
