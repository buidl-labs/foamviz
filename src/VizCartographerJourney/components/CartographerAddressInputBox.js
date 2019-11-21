import React from 'react';
import { withRouter } from 'react-router-dom';

const CartographerAddressInputBox = (props) => {
  const { display, history } = props;
  let cartographerAddressInput = null;

  const getCartographerDetailsWhenPressedEnter = (event) => {
    const code = event.keyCode || event.which;
    const { value } = event.target;
    if (code === 13 && history) history.push(`/cartographer-journey/${value}`);
  };

  React.useEffect(() => {
    if (display) cartographerAddressInput.focus();
  }, []);

  if (display === false) return null;

  return (
    <div className="abs-container">
      <input
        id="cartographer-address"
        ref={(input) => {
          cartographerAddressInput = input;
        }}
        className="address-input-box main-container"
        type="text"
        placeholder="Enter Cartographer Address"
        onKeyPress={getCartographerDetailsWhenPressedEnter}
      />
    </div>
  );
};

export default withRouter(CartographerAddressInputBox);
