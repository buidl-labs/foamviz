import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import FoamNavbar from '../../common-utils/components/FoamNavbar';

const CartographerAddressInputBox = (props) => {
  const { display, history } = props;
  let cartographerAddressInput = null;

  const getCartographerDetailsWhenPressedEnter = (event) => {
    const code = event.keyCode || event.which;
    const { value } = event.target;
    if (code === 13 && history) history.push(`/cartographer-journey/${value}`);
  };

  useEffect(() => {
    if (display) cartographerAddressInput.focus();
  }, [ display, cartographerAddressInput ]);

  if (display === false) return null;

  return (
    <div className="abs-container input-container">
      <div className="dm-none get-w-100">
        <FoamNavbar
          title="Cartographer's journey"
          info="Part of FOAMViz project"
        />
      </div>
      <input
        id="cartographer-address"
        ref={(input) => {
          cartographerAddressInput = input;
        }}
        className="address-input-box main-container w-100-p-1-5"
        type="text"
        placeholder="Enter Cartographer Address"
        onKeyPress={getCartographerDetailsWhenPressedEnter}
      />
    </div>
  );
};

export default withRouter(CartographerAddressInputBox);
