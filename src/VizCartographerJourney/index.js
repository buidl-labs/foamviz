import React from 'react';
import DeckGL from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import CartographerJourneyRenderLayers from './CartographerJourneyRenderLayer';
import CartographerAddressInputBox from './components/CartographerAddressInputBox';
import CartographerProfilePanel from './components/CartographerProfilePanel';
import CartographerJourneyTooltip from './components/CartographerJourneyTooltip';
import TimeSeriesSlider from './components/TimeSeriesSlider';
import ErrorDialogueBox from './components/ErrorDialogueBox';
import { fetchCartographerDetailsFromFOAMAPI, getProfileAnalytics } from './utils/helper';
import * as GLOBAL_CONSTANTS from '../common-utils/constants';
import './index.css';

class VizCartographerJourney extends React.Component {
  constructor(props) {
    super(props);
    this.getCartographerDetails = this.getCartographerDetails.bind(this);
    this.state = {
      viewport: {
        longitude: -57.38580902885856,
        latitude: 62.51353296267838,
        zoom: 1.75,
        maxZoom: 20,
        minZoom: 1,
        pitch: 60,
        bearing: 50,
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
      isPlayButton: true,
      hover: {
        x: 0,
        y: 0,
        hoveredObject: null,
      },
      hasError: false,
      errorMessage: '',
    };
  }

  async componentDidMount() {
    // 0xda65d14fb04ce371b435674829bede656693eb48
  }

  // componentDidCatch(error, info) {
  //   console.log('error from componentdidcatch:', error, 'info', info);
  // }

  async getCartographerDetails(cartographerAddress) {
    try {
      const cartographerDetails = await fetchCartographerDetailsFromFOAMAPI(cartographerAddress);
      const profileAnalytics = getProfileAnalytics(cartographerDetails);

      const min = Math.min.apply(null,
        cartographerDetails.map((x) => new Date(x.dateOfMarking)));

      const max = Math.max.apply(null,
        cartographerDetails.map((x) => new Date(x.dateOfMarking)));

      this.setState({
        data: cartographerDetails,
        filteredData: cartographerDetails,
        showInputBox: false,
        showProfilePanel: true,
        cartographerAddress,
        profileAnalytics,
        timelineMin: min,
        timelineMax: max,
        minDate: min,
        maxDate: max,
        globalMax: max,
      });
    } catch (error) {
      this.setState({
        hasError: true,
        errorMessage: error.message,
      });
    }
  }

  filterData = (newMinVal, newMaxVal) => {
    const {
      minDate, maxDate, data,
    } = this.state;

    const [newMinDate, newMaxDate] = [new Date(newMinVal), new Date(newMaxVal)];
    const [oldMinDate, oldMaxDate] = [minDate, maxDate];

    if (oldMinDate !== newMinDate || oldMaxDate !== newMaxDate) {
      this.setState({
        timelineMin: newMinVal,
        timelineMax: newMaxVal,
        minDate: newMinDate,
        maxDate: newMaxDate,
        filteredData: [...data]
          .filter((x) => new Date(x.dateOfMarking) >= newMinDate)
          .filter((x) => new Date(x.dateOfMarking) <= newMaxDate),
      });
    }
  }

  toggle = () => {
    const { isPlayButton } = this.state;
    this.setState({
      isPlayButton: !isPlayButton,
    });
    if (this.showInterval) {
      clearInterval(this.showInterval);
      this.showInterval = !this.showInterval;
      return;
    }

    const {
      timelineMax, timelineMin, globalMax,
    } = this.state;

    this.setState({
      timelineMin,
      timelineMax: timelineMax !== globalMax ? timelineMax + 86400000 : timelineMin + 86400000,
    }, () => {
      if (this.showInterval) clearInterval(this.showInterval);
      this.showInterval = setInterval(() => {
        const { timelineMax } = this.state;
        this.filterData(timelineMin, timelineMax + 86400000);
      }, 1000);
    });
  }

  closeErrorBox = () => {
    this.setState({
      hasError: false,
      errorMessage: '',
    });
  }

  onHover = ({ object, x, y }) => {
    const hoveredArcLayer = object;
    if (hoveredArcLayer) {
      this.setState({
        hover: {
          x,
          y,
          hoveredObject: hoveredArcLayer,
          details: hoveredArcLayer,
        },
      });
    } else {
      this.setState({
        hover: {
          x,
          y,
          hoveredObject: hoveredArcLayer,
        },
      });
    }
  }

  render() {
    const {
      viewport,
      data,
      showInputBox,
      showProfilePanel,
      cartographerAddress,
      profileAnalytics,
      filteredData,
      timelineMax,
      timelineMin,
      isPlayButton,
      hover,
      hasError,
      errorMessage,
    } = this.state;

    const min = Math.min.apply(null,
      data.map((x) => new Date(x.dateOfMarking)));

    const max = Math.max.apply(null,
      data.map((x) => new Date(x.dateOfMarking)));

    return (
      <div>
        <ErrorDialogueBox
          display={hasError}
          errorMessage={errorMessage}
          closeErrorBox={this.closeErrorBox}
        />
        <CartographerAddressInputBox
          display={showInputBox}
          getCartographerDetails={this.getCartographerDetails}
        />
        <CartographerJourneyTooltip
          hoveredObjectDetails={hover}
        />
        <TimeSeriesSlider
          display={showProfilePanel}
          count={2}
          length={2}
          minRange={min}
          maxRange={max}
          curMinVal={timelineMin}
          curMaxVal={timelineMax}
          initialMinValue={min}
          initialMaxValue={max}
          filterData={this.filterData}
          play={this.toggle}
          isPlayButton={isPlayButton}
        />
        <CartographerProfilePanel
          display={showProfilePanel}
          cartographerAddress={cartographerAddress}
          profileAnalytics={profileAnalytics}
        />
        <DeckGL
          layers={CartographerJourneyRenderLayers({
            data: filteredData,
            onHover: (hover) => this.onHover(hover),
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
