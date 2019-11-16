import React from 'react';

const CartographerAddressInputBox = (props) => {
  const { display, getCartographerDetails } = props;
  let cartographerAddressInput = null;

  const getCartographerDetailsWhenPressedEnter = (event) => {
    const code = event.keyCode || event.which;
    if (code === 13) {
      getCartographerDetails(event.target.value);
      cartographerAddressInput.value = '';
    }
  };

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
        onKeyPress={getCartographerDetailsWhenPressedEnter}
      />
    </div>
  );
};

export default CartographerAddressInputBox;
