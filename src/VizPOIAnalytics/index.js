import React from 'react';
import { HexagonLayer, DeckGL } from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import * as R from 'ramda';
import POIAnalyticsControlPanel from './POIAnalyticsControlPanel';
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
} from './utils/helper';

class VizPOIAnalytics extends React.Component {
  constructor(props) {
    super(props);
    this.fetchAllPOIDetailsInCurrentViewport = this.fetchAllPOIDetailsInCurrentViewport.bind(
      this,
    );
    this.state = {
      viewport: CONSTANTS.INITIAL_VIEWPORT,
      hover: {
        x: 0,
        y: 0,
        hoveredObject: null,
      },
      checkingPoints: [],
      points: [],
      FOAMTokenInUSD: 0,
      settings: getInitialControlPanelSettings(CONSTANTS.HEXAGON_CONTROLS),
      userResponse: false,
    };
  }

  async componentDidMount() {
    console.log('Mounted');
    this.setState({
      FOAMTokenInUSD: await getValInUSD(),
    });
    this.setUserLocation();
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
            FOAMTokenInUSD,
          ),
        },
      });
    } else {
      this.setState({ hover: { x, y, hoveredObject: allHoveredPOIDetails } });
    }
  }

  setUserLocation() {
    const { viewport } = this.state;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newViewport = {
            ...viewport,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          this.setState({ viewport: newViewport, userResponse: true });
        },
        (err) => {
          if (err.code === 1 || err.message === 'User denied Geolocation') {
            this.setState({ userResponse: true });
          }
        },
      );
    }
  }

  dataSanityChecker(pointsFetchedForCurrentViewPort) {
    const pointsAlreadyRendered = [...this.state.points];
    const unionOfOldAndNew = R.unionWith(
      R.eqBy(R.prop('listingHash')),
      pointsAlreadyRendered,
      pointsFetchedForCurrentViewPort,
    );

    console.log('Existing Points Length', pointsAlreadyRendered.length);
    console.log(
      'Points Fetched in the Current ViewPort Length',
      pointsFetchedForCurrentViewPort.length,
    );
    console.log('Union Points of Existing & New', unionOfOldAndNew.length);

    const compareListingHash = (x, y) => x.listingHash === y.listingHash;

    const newPoints = R.differenceWith(
      compareListingHash,
      unionOfOldAndNew,
      pointsAlreadyRendered,
    );

    console.log(
      'Count of points that are not already rendered',
      newPoints.length,
    );

    // If difference is not 0, then union contains new points that were not existing before
    return newPoints.length !== 0 ? newPoints : false;
  }

  async fetchAllPOIDetailsInCurrentViewport() {
    console.log('==========================');
    console.log('fetchAllPOIDetailsInCurrentViewport called!');
    const boundingBoxDetailsFromCurrentViewPort = getBoundingBoxDetailsFromCurrentViewport(
      this.mapRef.getMap().getBounds(),
    );

    const pointsFetchedForCurrentViewPort = await fetchPOIDetailsFromFOAMAPI(
      boundingBoxDetailsFromCurrentViewPort,
    );

    const newPoints = this.dataSanityChecker(pointsFetchedForCurrentViewPort);

    if (newPoints) {
      const dataChunks = [...this.state.checkingPoints];
      dataChunks.push(newPoints);
      this.setState((prevState) => ({
        checkingPoints: dataChunks,
        points: [...prevState.points, ...newPoints],
      }));
    }

    // this.setState({ points: newPoints });
  }

  updateLayerSettings(settings) {
    this.setState({ settings });
  }

  render() {
    const {
      hover,
      settings,
      points,
      checkingPoints,
      viewport,
      userResponse,
    } = this.state;

    if (userResponse === false) return <p>Loading...</p>;

    // const layers = POIAnalyticsRenderLayers({
    //   data: points,
    //   onHover: (hover) => this.onHover(hover),
    //   settings,
    // });

    console.log('Checking Points', checkingPoints);
    const layers = checkingPoints.map(
      (chunk, chunkIndex) =>
      // console.log(chunk);

        new HexagonLayer({
          id: `chunk-${chunkIndex}`,
          getPosition: (d) => d.position,
          dataComparator: (newData, oldData) => {
            const noChangeInData = R.equals(newData, oldData);
            // console.log(noChangeInData);
            return noChangeInData;
          },
          data: chunk,
          onHover: (hover) => this.onHover(hover),
          ...settings,
          ...LAYER_PROPERTIES,
        }),
    );

    // console.log(layers);

    return (
      <div>
        <Tooltip allHoveredPOIDetails={hover} />
        <POIAnalyticsControlPanel
          settings={settings}
          controls={CONSTANTS.HEXAGON_CONTROLS}
          onChange={(settings) => this.updateLayerSettings(settings)}
        />
        <DeckGL
          layers={layers}
          effects={[lightingEffect]}
          initialViewState={{ ...viewport }}
          controller
          onDragEnd={this.fetchAllPOIDetailsInCurrentViewport}
        >
          <StaticMap
            ref={(map) => {
              this.mapRef = map;
            }}
            mapStyle={GLOBAL_CONSTANTS.MAP_STYLE}
            mapboxApiAccessToken="pk.eyJ1IjoicHJhc3R1dCIsImEiOiJjazJ5a2RxdGIwNjYzM2R0ODAzcXJpN2FmIn0.-XHSjrUZcvB9y40hReB7nw"
            onLoad={this.fetchAllPOIDetailsInCurrentViewport}
          />
        </DeckGL>
      </div>
    );
  }
}

export default VizPOIAnalytics;
