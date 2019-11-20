import React from 'react';
import { HexagonLayer, DeckGL } from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import * as R from 'ramda';
import POIAnalyticsControlPanel from './components/POIAnalyticsControlPanel';
import POIAnalyticsRenderLayers from './POIAnalyticsRenderLayers';

import Tooltip from './components/Tooltip';
import * as CONSTANTS from './utils/constants';
import * as GLOBAL_CONSTANTS from '../common-utils/constants';
import lightingEffect from './utils/lightingEffects';

import LAYER_PROPERTIES from './utils/layerProperties';

import {
  getValInUSD,
  getInitialControlPanelSettings,
  getTooltipFormattedDetails,
  getBoundingBoxDetailsFromCurrentViewport,
  fetchPOIDetailsFromFOAMAPI,
  getCurrentLocation,
  getFOAMUSDRate
} from './utils/helper';

class VizPOIAnalytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        zoom: 11,
        minZoom: 5,
        maxZoom: 16,
        pitch: 45,
        bearing: 0,
        latitude: null,
        longitude: null
      },
      hover: {
        x: 0,
        y: 0,
        hoveredObject: null
      },
      checkingPoints: [],
      points: [],
      FOAMTokenInUSD: 0,
      settings: getInitialControlPanelSettings(CONSTANTS.HEXAGON_CONTROLS)
    };

    this.fetchPointsInCurrentViewPort = this.fetchPointsInCurrentViewPort.bind(
      this
    );
  }

  async componentDidMount() {
    // Get User Location
    try {
      const userLocationObject = await getCurrentLocation();

      console.log(userLocationObject);

      const viewPortObject = {
        latitude: userLocationObject.coords.latitude,
        longitude: userLocationObject.coords.longitude
      };

      this.setState(prevState => ({
        viewport: { ...prevState.viewport, ...viewPortObject }
      }));
    } catch (error) {
      // If user doesn't give information, render NYC location

      if (error.message === 'User denied Geolocation') {
        this.setState(prevState => ({
          viewport: { ...prevState.viewport, ...CONSTANTS.NY_COORDINATES }
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

  componentDidUpdate() {
    // console.log(this.state);
  }

  onHover({ x, y, object }) {
    const allHoveredPOIDetails = object;
    const { FOAMTokenInUSD } = this.state;
    if (allHoveredPOIDetails) {
      this.setState({
        hover: {
          x,
          y,
          hoveredObject: allHoveredPOIDetails,
          details: getTooltipFormattedDetails(
            allHoveredPOIDetails,
            FOAMTokenInUSD
          )
        }
      });
    } else {
      this.setState({ hover: { x, y, hoveredObject: allHoveredPOIDetails } });
    }
  }

  dataSanityChecker(pointsFetchedForCurrentViewPort) {
    const pointsAlreadyRendered = [...this.state.points];
    const unionOfOldAndNew = R.unionWith(
      R.eqBy(R.prop('listingHash')),
      pointsAlreadyRendered,
      pointsFetchedForCurrentViewPort
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
      pointsAlreadyRendered
    );

    // console.log(
    //   'Count of points that are not already rendered',
    //   newPoints.length,
    // );

    // If difference is not 0, then union contains new points that were not existing before
    return newPoints.length !== 0 ? newPoints : false;
  }

  async fetchPointsInCurrentViewPort() {
    const boundingBoxDetailsFromCurrentViewPort = getBoundingBoxDetailsFromCurrentViewport(
      this.mapRef.getMap().getBounds()
    );

    const pointsFetchedForCurrentViewPort = await fetchPOIDetailsFromFOAMAPI(
      boundingBoxDetailsFromCurrentViewPort
    );

    const newPoints = this.dataSanityChecker(pointsFetchedForCurrentViewPort);

    if (newPoints) {
      const dataChunks = [...this.state.checkingPoints];
      dataChunks.push(newPoints);
      this.setState(prevState => ({
        checkingPoints: dataChunks,
        points: [...prevState.points, ...newPoints]
      }));
    }

    // this.setState({ points: newPoints });
  }

  updateLayerSettings(settings) {
    this.setState({ settings });
  }

  renderLayers() {
    const { settings, checkingPoints } = this.state;

    const densityofPointsLayers = checkingPoints.map(
      (chunk, chunkIndex) =>
        new HexagonLayer({
          id: `chunk-${chunkIndex}-densityOfPoints`,
          getPosition: d => d.position,
          dataComparator: (newData, oldData) => R.equals(newData, oldData),
          data: chunk,
          visible: settings.showDensityOfPoints,
          onHover: hover => this.onHover(hover),
          ...settings,
          ...LAYER_PROPERTIES
        })
    );

    const showStakedTokens = checkingPoints.map(
      (chunk, chunkIndex) =>
        new HexagonLayer({
          id: `chunk-${chunkIndex}-stakedToken`,
          getPosition: d => d.position,
          dataComparator: (newData, oldData) => R.equals(newData, oldData),
          data: chunk,
          getElevationValue: points =>
            points.reduce((prevvalue, cur) => prevvalue + cur.stakedvalue, 0),
          getColorValue: points =>
            points.reduce((prevvalue, cur) => prevvalue + cur.stakedvalue, 0),
          visible: settings.showStakedTokens,
          onHover: hover => this.onHover(hover),
          ...settings,
          ...LAYER_PROPERTIES
        })
    );

    return [densityofPointsLayers, showStakedTokens];
  }

  render() {
    const { hover, settings, points, checkingPoints, viewport } = this.state;

    if (viewport.latitude === null && viewport.longitude === null) {
      return (
        <p>
          Waiting for User Location. If denied, Viz will redirect to FOAM HQ
          City i.e New York
        </p>
      );
    }

    console.log(settings);

    console.log('Checking Points', checkingPoints);
    const layers = this.renderLayers();

    console.log(layers);

    return (
      <div>
        <Tooltip allHoveredPOIDetails={hover} />
        <POIAnalyticsControlPanel
          settings={settings}
          controls={CONSTANTS.HEXAGON_CONTROLS}
          onChange={settings => this.updateLayerSettings(settings)}
        />
        <DeckGL
          layers={layers}
          effects={[lightingEffect]}
          initialViewState={{ ...viewport }}
          controller
          onDragEnd={this.fetchPointsInCurrentViewPort}
        >
          <StaticMap
            ref={map => {
              this.mapRef = map;
            }}
            mapStyle={GLOBAL_CONSTANTS.MAP_STYLE}
            mapboxApiAccessToken="pk.eyJ1IjoicHJhc3R1dCIsImEiOiJjazJ5a2RxdGIwNjYzM2R0ODAzcXJpN2FmIn0.-XHSjrUZcvB9y40hReB7nw"
            onLoad={this.fetchPointsInCurrentViewPort}
          />
        </DeckGL>
      </div>
    );
  }
}

export default VizPOIAnalytics;
