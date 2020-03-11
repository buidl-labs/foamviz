import React from 'react';
import { HexagonLayer, DeckGL } from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import { Helmet } from 'react-helmet';
import * as R from 'ramda';
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';

// Layers
// Todo Insert Seperate Layer Components

// Interaction Components
import POIAnalyticsControlPanel from './components/POIAnalyticsControlPanel';
import LocationSearchBox from './components/LocationSearchBox';
import Tooltip from './components/ToolTip';

// import POIAnalyticsRenderLayers from './POIAnalyticsRenderLayers';

// Loaders
// import LoaderWhenFetchingData from './components/LoaderWhenFetchingData';

// Constants
import * as CONSTANTS from './utils/constants';
import * as GLOBAL_CONSTANTS from '../common-utils/constants';
import lightingEffect from './utils/lightingEffects';

import {
  LAYER_PROPERTIES_Op1,
  LAYER_PROPERTIES_Op2,
} from './utils/layerProperties';

import {
  // getValInUSD,
  getInitialControlPanelSettings,
  getTooltipFormattedDetails,
  getBoundingBoxDetailsFromCurrentViewport,
  fetchPOIDetailsFromFOAMAPI,
  getCurrentLocation,
  getFOAMUSDRate,
} from './utils/helper';
import LoaderWhileFetchingLocation from './components/LoaderWhileFetchingLocation';

// Todo: All Control panel settings need to become part of this initital state
const INTIAL_VIEW_STATE = {
  zoom: 11.6,
  minZoom: 5,
  maxZoom: 16,
  pitch: 40.5,
  bearing: 0,
  latitude: null,
  longitude: null,
};

// const elevationScale = { min: 0, max: 5 };

class VizPOIAnalytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: INTIAL_VIEW_STATE,
      hover: {
        x: 0,
        y: 0,
        hoveredObject: null,
      },
      checkingPoints: [],
      points: [],
      FOAMTokenInUSD: 0,
      settings: getInitialControlPanelSettings(CONSTANTS.HEXAGON_CONTROLS),
      elevationScale: 0,
      fetchingData: false,
      showCurrentLayer: true,
      arrowUp: true,
    };

    this.fetchPointsInCurrentViewPort = this.fetchPointsInCurrentViewPort.bind(
      this,
    );
    this.startAnimationTimer = null;
    this.intervalTimer = null;

    this.setViewport = this.setViewport.bind(this);
    this.startAnimate = this.startAnimate.bind(this);
    this.animateHeight = this.animateHeight.bind(this);
  }

  async componentDidMount() {
    // Get User Location
    try {
      const userLocationObject = await getCurrentLocation();

      // console.log(userLocationObject);

      const viewPortObject = {
        latitude: userLocationObject.coords.latitude,
        longitude: userLocationObject.coords.longitude,
      };

      this.setState((prevState) => ({
        viewport: { ...prevState.viewport, ...viewPortObject },
      }));
    } catch (error) {
      // If user doesn't give information, render NYC location

      if (error.message === 'User denied Geolocation') {
        this.setState((prevState) => ({
          viewport: { ...prevState.viewport, ...CONSTANTS.NY_COORDINATES },
        }));
      }
    }

    // Get FOAM_USDC Price
    try {
      const FOAMTokenInUSD = await getFOAMUSDRate();

      this.setState({ FOAMTokenInUSD });
    } catch (error) {
      console(error);
    }
  }

  onHover({ x, y, object }) {
    const allHoveredPOIDetails = object;
    const { FOAMTokenInUSD } = this.state;
    this.updateViewport().then(() => {
      this.setState({
        hover: {
          x,
          y,
          hoveredObject: allHoveredPOIDetails,
          details: allHoveredPOIDetails ? getTooltipFormattedDetails(
            allHoveredPOIDetails,
            FOAMTokenInUSD,
          ) : null,
        },
      });
    });
  }

  startAnimate() {
    this.stopAnimate();
    this.intervalTimer = window.setInterval(this.animateHeight, 20);
  }

  animateHeight() {
    const { elevationScale } = this.state;
    if (elevationScale === 5) {
      this.stopAnimate();
    } else {
      this.setState({ elevationScale: elevationScale + 0.125 });
    }
  }

  stopAnimate() {
    window.clearTimeout(this.startAnimationTimer);
    window.clearTimeout(this.intervalTimer);
  }

  dataSanityChecker(pointsFetchedForCurrentViewPort) {
    const pointsAlreadyRendered = [...this.state.points];
    const unionOfOldAndNew = R.unionWith(
      R.eqBy(R.prop('listingHash')),
      pointsAlreadyRendered,
      pointsFetchedForCurrentViewPort,
    );

    // console.log('Existing Points Length', pointsAlreadyRendered.length);
    // console.log(
    //   'Points Fetched in the Current ViewPort Length',
    //   pointsFetchedForCurrentViewPort.length,
    // );
    // console.log('Union Points of Existing & New', unionOfOldAndNew.length);

    const compareListingHash = (x, y) => x.listingHash === y.listingHash;

    const newPoints = R.differenceWith(
      compareListingHash,
      unionOfOldAndNew,
      pointsAlreadyRendered,
    );

    // console.log(
    //   'Count of points that are not already rendered',
    //   newPoints.length,
    // );

    // If difference is not 0, then union contains new points that were not existing before
    return newPoints.length !== 0 ? newPoints : false;
  }

  fetchPointsInCurrentViewPort() {
    const { viewport } = this.state;
    const map = this.mapRef.getMap();
    const center = map.getCenter();

    this.setState({
      fetchingData: true,
      showCurrentLayer: true,
      viewport: {
        ...viewport,
        latitude: center.lat,
        longitude: center.lng,
      },
    }, async () => {
      const boundingBoxDetailsFromCurrentViewPort = getBoundingBoxDetailsFromCurrentViewport(
        map.getBounds(),
      );

      const pointsFetchedForCurrentViewPort = await fetchPOIDetailsFromFOAMAPI(
        boundingBoxDetailsFromCurrentViewPort,
      );

      const newPoints = this.dataSanityChecker(pointsFetchedForCurrentViewPort);

      if (newPoints) {
        const dataChunks = [...this.state.checkingPoints];
        dataChunks.push(newPoints);
        this.setState(
          (prevState) => ({
            checkingPoints: dataChunks,
            points: [...prevState.points, ...newPoints],
            elevationScale: 0,
          }),
          () => {
            this.startAnimate();
          },
        );
      }

      this.setState({ fetchingData: false });
    });

    // this.setState({ points: newPoints });
  }

  updateViewport(coordinates = []) {
    const { viewport } = this.state;
    const map = this.mapRef.getMap();
    return new Promise((resolve) => {
      this.setState({
        viewport: {
          ...viewport,
          latitude: coordinates[1] || map.getCenter().lat,
          longitude: coordinates[0] || map.getCenter().lng,
          zoom: map.getZoom(),
          bearing: map.getBearing(),
          pitch: map.getPitch(),
        },
      }, resolve);
    });
  }

  setViewport(coordinates) {
    const map = this.mapRef.getMap();
    this.setState({ fetchingData: true, showCurrentLayer: false });
    map.flyTo({ center: coordinates, duration: 1000 });
    map.once('moveend', () => {
      const { viewport } = this.state;
      this.setState({
        viewport: {
          ...viewport,
          longitude: coordinates[0],
          latitude: coordinates[1],
        },
      }, () => {
        this.fetchPointsInCurrentViewPort();
      });
    });
  }

  updateLayerSettings(settings) {
    this.setState({ settings });
  }

  renderLayers() {
    const {
      settings, checkingPoints, elevationScale, showCurrentLayer,
    } = this.state;

    // Todo: move each layer and it's settings to a seperate component, settings to be part of the component itself as settings are
    // way too closely tied to the layer.

    const densityofPointsLayers = checkingPoints.map(
      (chunk, chunkIndex) => new HexagonLayer({
        id: `chunk-${chunkIndex}-densityOfPoints`,
        getPosition: (d) => d.position,
        dataComparator: (newData, oldData) => R.equals(newData, oldData),
        data: chunk,
        visible: settings.showDensityOfPoints && showCurrentLayer,
        onHover: (hover) => this.onHover(hover),
        ...settings,
        ...LAYER_PROPERTIES_Op1,
        elevationScale:
          checkingPoints.length - 1 === chunkIndex ? elevationScale : 5,
      }),
    );

    const showStakedTokens = checkingPoints.map(
      (chunk, chunkIndex) => new HexagonLayer({
        id: `chunk-${chunkIndex}-stakedToken`,
        getPosition: (d) => d.position,
        dataComparator: (newData, oldData) => R.equals(newData, oldData),
        data: chunk,
        getElevationValue: (points) => points.reduce((prevvalue, cur) => prevvalue + cur.stakedvalue, 0),
        getColorValue: (points) => points.reduce((prevvalue, cur) => prevvalue + cur.stakedvalue, 0),
        visible: settings.showStakedTokens && showCurrentLayer,
        onHover: (hover) => this.onHover(hover),
        ...settings,
        ...LAYER_PROPERTIES_Op2,
      }),
    );

    return [densityofPointsLayers, showStakedTokens];
  }

  render() {
    const {
      hover,
      settings,
      // points,
      // checkingPoints,
      viewport,
      fetchingData,
      arrowUp,
    } = this.state;

    // Todo: Move this to seperate component and design a good loading state.
    if (viewport.latitude === null && viewport.longitude === null) {
      return <LoaderWhileFetchingLocation />
    }

    const layers = this.renderLayers();

    // console.log(settings);
    // console.log('Checking Points', checkingPoints);
    // console.log(layers);

    // Todo: POIAnalyticsControlPanel should technically take the state of the settings and a prop to handle changes.
    // Sending controls from somewhere else feels impure and hence the structure of the component needs to change to
    // reflect a more API friendly component design.
    return (
      <div>
        <Helmet>
          <title>FOAMViz - POI Analytics</title>
        </Helmet>
        {fetchingData}
        <Tooltip allHoveredPOIDetails={hover} />
        <div className="dm-none">
          <POIAnalyticsControlPanel
            settings={settings}
            controls={CONSTANTS.HEXAGON_CONTROLS}
            onChange={(settings) => this.updateLayerSettings(settings)}
          />
        </div>
        <div className="dn m-show">
          <SwipeableBottomSheet
            overflowHeight={100}
            marginTop={128}
            style={{ zIndex: 5 }}
            onChange={() => this.setState({ arrowUp: !arrowUp})}
          >
            <div style={{ height: '480px' }}>
              <POIAnalyticsControlPanel
                arrowUp={arrowUp}
                settings={settings}
                controls={CONSTANTS.HEXAGON_CONTROLS}
                onChange={(settings) => this.updateLayerSettings(settings)}
              />
            </div>
          </SwipeableBottomSheet>
        </div>
        <LocationSearchBox onLocationSelect={this.setViewport} />
        <DeckGL
          layers={layers}
          effects={[lightingEffect]}
          initialViewState={{ ...INTIAL_VIEW_STATE }}
          viewState={{ ...viewport }}
          onViewStateChange={(ev) => {
            const { viewState, interactionState } = ev;
            const { isDragging, isPanning } = interactionState;
            const { longitude, latitude } = viewState;
            if (!isDragging && !isPanning) {
              this.updateViewport([longitude, latitude]).then(() => this.fetchPointsInCurrentViewPort());
            }
          }}
          controller
          // onDragEnd={this.fetchPointsInCurrentViewPort}
        >
          <StaticMap
            ref={(map) => {
              this.mapRef = map;
            }}
            mapStyle={GLOBAL_CONSTANTS.MAP_STYLE}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            onLoad={this.fetchPointsInCurrentViewPort}
          />
        </DeckGL>
      </div>
    );
  }
}

export default VizPOIAnalytics;
