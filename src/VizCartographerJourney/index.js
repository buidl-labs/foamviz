import React from 'react';
import DeckGL from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import CartographerJourneyRenderLayers from './CartographerJourneyRenderLayer';
import CartographerAddressInputBox from './components/CartographerAddressInputBox';
import CartographerProfilePanel from './components/CartographerProfilePanel';
import { fetchCartographerDetailsFromFOAMAPI, getProfileAnalytics } from './utils/helper';
import TimeSeriesSlider from './components/TimeSeriesSlider';
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
        zoom: 5,
        minZoom: 2,
        maxZoom: 20,
        pitch: 45,
        bearing: 0,
      },
      data: [],
      showInputBox: true,
      showProfilePanel: false,
      cartographerAddress: '',
      profileAnalytics: {},
      filteredData: [],
      minDate: null,
      maxDate: null,
      timelineMin: null,
      timelineMax: null,
    };
  }

  async componentDidMount() {
    // 0xda65d14fb04ce371b435674829bede656693eb48
  }

  async getCartographerDetails(cartographerAddress) {
    const cartographerDetails = await fetchCartographerDetailsFromFOAMAPI(cartographerAddress);
    const profileAnalytics = getProfileAnalytics(cartographerDetails);

    this.setState({
      data: cartographerDetails,
      filteredData: cartographerDetails,
      showInputBox: false,
      showProfilePanel: true,
      cartographerAddress,
      profileAnalytics,
    });
  }

  filterDate = (evt) => {
    const {
      minDate, maxDate, data, filteredData,
    } = this.state;
    const [newMinDate, newMaxDate] = [new Date(evt[0]), new Date(evt[1])];
    const [oldMinDate, oldMaxDate] = [minDate, maxDate];

    if (oldMinDate !== newMinDate || oldMaxDate !== newMaxDate) {
      this.setState({
        minDate: newMinDate,
        maxDate: newMaxDate,
        filteredData: data
          .filter((x) => new Date(x.dateOfMarking) >= newMinDate)
          .filter((x) => new Date(x.dateOfMarking) <= newMaxDate),
      });
      console.log(filteredData);
    }
  }

  startShow = () => {
    const { data, timelineMax } = this.state;
    const minVal = Math.min.apply(null, data.map((x) => new Date(x.dateOfMarking)));
    this.setState({
      timelineMin: minVal,
      timelineMax: minVal + 10000,
    }, () => {
      setInterval(() => {
        this.setState({ timelineMax: timelineMax + 10000000 });
      }, 500);
    });
  }

  render() {
    const {
      viewport,
      data,
      showInputBox,
      showProfilePanel,
      cartographerAddress,
      profileAnalytics,
      // timeseries,
      filteredData,
      // timelineMax,
      // timelineMin,
      // minDate,
      // maxDate,
    } = this.state;

    const min = Math.min.apply(null,
      data.map((x) => new Date(x.dateOfMarking)));

    const max = Math.max.apply(null,
      data.map((x) => new Date(x.dateOfMarking)));

    return (
      <div>
        <CartographerAddressInputBox
          display={showInputBox}
          getCartographerDetails={this.getCartographerDetails}
        />
        <TimeSeriesSlider
          display={showProfilePanel}
          minRange={min}
          maxRange={max}
          curMinVal={min}
          curMaxVal={max}
          count={2}
          currMin={min}
          currMax={max}
          filterDate={this.filterDate}
          length={2}
        />
        <CartographerProfilePanel
          display={showProfilePanel}
          cartographerAddress={cartographerAddress}
          profileAnalytics={profileAnalytics}
        />
        <DeckGL
          layers={CartographerJourneyRenderLayers({ data: filteredData })}
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
