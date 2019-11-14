import React from 'react';
import DeckGL from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import * as R from 'ramda';
import POIAnalyticsControlPanel from './POIAnalyticsControlPanel';
import POIAnalyticsRenderLayers from './POIAnalyticsRenderLayers';
import Tooltip from './components/Tooltip';
import * as CONSTANTS from './utils/constants';
import * as GLOBAL_CONSTANTS from '../common-utils/constants';
import lightingEffect from './utils/lightingEffects';
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

  async onHover({ x, y, object }) {
    const allHoveredPOIDetails = object;
    const { FOAMTokenInUSD } = this.state;
    if (allHoveredPOIDetails) {
      this.setState({
        hover: {
          x,
          y,
          hoveredObject: allHoveredPOIDetails,
          details: await getTooltipFormattedDetails(
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

  dataSanityChecker(newPointsFetched) {
    const existingPoints = this.state.points;
    const newPoints = newPointsFetched;
    console.log('Existing Points');
    console.log(existingPoints);
    console.log('NewPoints');
    console.log(newPoints);

    console.log('Existing Points Length', existingPoints.length);
    console.log('New Points Length', newPoints.length);

    const compareListingHash = (x, y) => x.listingHash === y.listingHash;

    const difference = R.differenceWith(
      compareListingHash,
      existingPoints,
      newPoints,
    );

    console.log('Difference before Union', difference);

    const arrayOfUniquePoints = R.unionWith(
      R.eqBy(R.prop('listingHash')),
      existingPoints,
      newPoints,
    );

    return arrayOfUniquePoints;
  }

  async fetchAllPOIDetailsInCurrentViewport() {
    console.log('fetchAllPOIDetailsInCurrentViewport called!');
    const boundingBoxDetailsFromCurrentViewPort = getBoundingBoxDetailsFromCurrentViewport(
      this.mapRef.getMap().getBounds(),
    );

    const newPointsFetched = await fetchPOIDetailsFromFOAMAPI(
      boundingBoxDetailsFromCurrentViewPort,
    );

    const formattedObjectForDeckGL = this.dataSanityChecker(newPointsFetched);

    this.setState({ points: formattedObjectForDeckGL });
  }

  updateLayerSettings(settings) {
    this.setState({ settings });
  }

  render() {
    const {
 hover, settings, points, viewport, userResponse 
} = this.state;

    if (userResponse === false) return <p>Loading...</p>;

    return (
      <div>
        <Tooltip allHoveredPOIDetails={hover} />
        <POIAnalyticsControlPanel
          settings={settings}
          controls={CONSTANTS.HEXAGON_CONTROLS}
          onChange={(settings) => this.updateLayerSettings(settings)}
        />
        <DeckGL
          layers={POIAnalyticsRenderLayers({
            data: points,
            onHover: (hover) => this.onHover(hover),
            settings,
          })}
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
