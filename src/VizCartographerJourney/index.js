import React from 'react';
import DeckGL, { FlyToInterpolator } from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import { Helmet } from 'react-helmet';
import CartographerJourneyRenderLayers from './CartographerJourneyRenderLayer';
import CartographerAddressInputBox from './components/CartographerAddressInputBox';
import CartographerProfilePanel from './components/CartographerProfilePanel';
import CartographerJourneyTooltip from './components/CartographerJourneyTooltip';
import TimeSeriesSlider from './components/TimeSeriesSlider';
import ErrorDialogueBox from './components/ErrorDialogueBox';
import Loading from './components/Loading';
import {
  fetchCartographerDetailsFromFOAMAPI,
  getProfileAnalytics,
} from './utils/helper';
import * as GLOBAL_CONSTANTS from '../common-utils/constants';
import './index.css';

const INITIAL_VIEWPORT_STATE = {
  longitude: -80,
  latitude: 50,
  zoom: 1.5,
  maxZoom: 22,
  minZoom: 0,
  pitch: 50,
  bearing: 15,
  // transitionDuration: 1200,
  // transitionInterpolator: new FlyToInterpolator(),
};

class VizCartographerJourney extends React.Component {
  constructor(props) {
    super(props);
    this.getCartographerDetails = this.getCartographerDetails.bind(this);
    this.updateViewport = this.updateViewport.bind(this);
    this.state = {
      viewport: INITIAL_VIEWPORT_STATE,
      loading: false,
      data: [],
      showInputBox: true,
      showProfilePanel: false,
      cartographerAddress: '',
      profileAnalytics: {},
      filteredData: [],
      timelineMin: null,
      timelineMax: null,
      isPlayButton: true,
      hover: {
        x: 0,
        y: 0,
        hoveredObject: null,
        type: null
      },
      hasError: false,
      errorMessage: '',
      pitchFor3d: 50,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    if (match && match.params && match.params.id) { this.getCartographerDetails(match.params.id); }
  }

  async getCartographerDetails(cartographerAddress) {
    try {
      this.setState({ loading: true, showInputBox: false });
      const cartographerDetails = await fetchCartographerDetailsFromFOAMAPI(
        cartographerAddress,
      );

      const profileAnalytics = await getProfileAnalytics(cartographerAddress);

      const [min, max] = [0, cartographerDetails.length - 1];

      this.setState({
        data: cartographerDetails,
        filteredData: cartographerDetails,
        showInputBox: false,
        showProfilePanel: true,
        cartographerAddress,
        profileAnalytics,
        timelineMin: min,
        timelineMax: max,
        globalMax: max,
        loading: false,
      });
    } catch (error) {
      this.setState({
        hasError: true,
        errorMessage: error.message,
        loading: false,
        showInputBox: true,
      });
    }
  }

  filterData = (newMinVal, newMaxVal) => {
    const { timelineMin, timelineMax, data } = this.state;

    if (newMinVal !== timelineMin || newMaxVal !== timelineMax) {
      this.updateViewport().then(() => {
        this.setState({
          timelineMin: newMinVal,
          timelineMax: newMaxVal,
          filteredData: data.slice(newMinVal, newMaxVal),
        });
      });
    }
  };

  reset = () => {
    const { data, isPlayButton } = this.state;
    if (!isPlayButton) this.toggle();
    this.filterData(0, data.length - 1);
  }

  toggle = () => {
    const { isPlayButton } = this.state;
    this.setState({ isPlayButton: !isPlayButton });

    if (this.showInterval) {
      clearInterval(this.showInterval);
      this.showInterval = !this.showInterval;
      return;
    }

    const { timelineMax, timelineMin, globalMax } = this.state;

    this.setState(
      {
        timelineMin,
        timelineMax:
          timelineMax !== globalMax
            ? timelineMax + 1
            : timelineMin + 1,
      },
      () => {
        if (this.showInterval) clearInterval(this.showInterval);
        this.showInterval = setInterval(() => {
          const { timelineMax } = this.state;
          this.filterData(timelineMin, timelineMax + 1);
        }, 1000);
      },
    );
  };

  closeErrorBox = () => {
    const { history } = this.props;
    this.setState({
      hasError: false,
      errorMessage: '',
    });
    history.push('/cartographer-journey');
  };

  onHover = ({ object, x, y }, type) => {
    const hoveredData = object || null;
    this.updateViewport().then(() => {
      this.setState({
        hover: {
          x,
          y,
          hoveredObject: hoveredData,
          details: hoveredData,
          type
        },
      });
    });
  };

  updateViewport(pitchMode = null) {
    const { viewport } = this.state;
    let { pitchFor3d } = this.state;

    const map = this.mapRefVizTwo.getMap();
    const mapPitch = map.getPitch();

    let pitch;
    if (pitchMode === '2d') {
      pitch = 0;
      pitchFor3d = mapPitch;
    } else if (pitchMode === '3d') {
      pitch = 50;
    } else {
      pitch = mapPitch;
    }

    return new Promise((resolve) => {
      this.setState({
        viewport: {
          ...viewport,
          latitude: map.getCenter().lat,
          longitude: map.getCenter().lng,
          zoom: map.getZoom(),
          bearing: map.getBearing(),
          pitch,
        },
        pitchFor3d,
      }, resolve);
    });
  }

  render() {
    const {
      viewport,
      data,
      filteredData,
      showInputBox,
      showProfilePanel,
      cartographerAddress,
      profileAnalytics,
      timelineMax,
      timelineMin,
      isPlayButton,
      hover,
      hasError,
      errorMessage,
      loading,
    } = this.state;

    const [min, max] = [0, data.length - 1];

    return (
      <div>
        <Helmet>
          <title>FOAMViz - Cartographer Journey</title>
        </Helmet>
        <Loading display={loading} />
        <ErrorDialogueBox
          display={hasError}
          errorMessage={errorMessage}
          closeErrorBox={this.closeErrorBox}
        />
        <CartographerAddressInputBox
          display={showInputBox}
          getCartographerDetails={this.getCartographerDetails}
        />
        <CartographerJourneyTooltip hoveredObjectDetails={hover} />
        <TimeSeriesSlider
          display={showProfilePanel}
          count={2}
          length={data.length || 0}
          minRange={min}
          maxRange={max}
          curMinVal={timelineMin}
          curMaxVal={timelineMax}
          curMinDate={data[timelineMin] && data[timelineMin].dateOfMarking}
          curMaxDate={data[timelineMax] && data[timelineMax].dateOfMarking}
          initialMinValue={min}
          initialMaxValue={max}
          filterData={this.filterData}
          play={this.toggle}
          reset={this.reset}
          isPlayButton={isPlayButton}
        />
        <CartographerProfilePanel
          display={showProfilePanel}
          cartographerAddress={cartographerAddress}
          profileAnalytics={profileAnalytics}
          displayMode2D={viewport.pitch === 0}
          changeMapView={this.updateViewport}
        />
        <DeckGL
          layers={CartographerJourneyRenderLayers({
            data: filteredData,
            onArcHover: (hover) => this.onHover(hover, 0),
            onPOIHover: (hover) => this.onHover(hover, 1),
          })}
          initialViewState={INITIAL_VIEWPORT_STATE}
          viewState={{ ...viewport }}
          onViewStateChange={() => { this.updateViewport().then(() => { }); }}
          controller
        >
          <StaticMap
            ref={(map) => {
              this.mapRefVizTwo = map;
            }}
            mapStyle={GLOBAL_CONSTANTS.MAP_STYLE}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
          />
        </DeckGL>
      </div>
    );
  }
}

export default VizCartographerJourney;
