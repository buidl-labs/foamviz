import React from 'react';
import DeckGL from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import CartographerJourneyRenderLayers from './CartographerJourneyRenderLayer';
import CartographerAddressInputBox from './components/CartographerAddressInputBox';
import CartographerProfilePanel from './components/CartographerProfilePanel';
import { fetchCartographerDetailsFromFOAMAPI, getProfileAnalytics } from './utils/helper';
import * as GLOBAL_CONSTANTS from '../common-utils/constants';
import './index.css';

class VizCartographerJourney extends React.Component {
  constructor(props) {
    super(props);
    this.getCartographerDetails = this.getCartographerDetails.bind(this);
    this.state = {
      viewport: {
        longitude: 77.10,
        latitude: 28.70,
        zoom: 11,
        minZoom: 2,
        maxZoom: 20,
        pitch: 45,
        bearing: 0,
      },
      points: [],
      showInputBox: true,
      showProfilePanel: false,
      cartographerAddress: '',
      profileAnalytics: {},
    };
  }

  async componentDidMount() {
    // 0xda65d14fb04ce371b435674829bede656693eb48
  }

  async getCartographerDetails(event) {
    const code = event.keyCode || event.which;
    if (code === 13) {
      const cartographerAddress = event.target.value;
      const data = await fetchCartographerDetailsFromFOAMAPI(cartographerAddress);
      const profileAnalytics = getProfileAnalytics(data);
      // console.log(data);
      this.setState({
        points: data,
        showInputBox: false,
        showProfilePanel: true,
        cartographerAddress,
        profileAnalytics,
        // cartographerAddress,
      });
    }
  }

  render() {
    const {
      viewport, points, showInputBox, showProfilePanel, cartographerAddress, profileAnalytics,
    } = this.state;
    return (
      <div>
        <CartographerAddressInputBox
          display={showInputBox}
          getCartographerDetails={this.getCartographerDetails}
        />
        <CartographerProfilePanel
          display={showProfilePanel}
          cartographerAddress={cartographerAddress}
          profileAnalytics={profileAnalytics}
        />
        <DeckGL
          layers={CartographerJourneyRenderLayers({
            data: points,
          })}
          initialViewState={{ ...viewport }}
          controller
        >
          <StaticMap
            mapStyle={GLOBAL_CONSTANTS.MAP_STYLE}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
          />
        </DeckGL>
      </div>
    );
  }
}

export default VizCartographerJourney;
