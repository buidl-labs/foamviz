import React from 'react';
import DeckGL from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import POIAnalyticsControlPanel from './POIAnalyticsControlPanel';
import POIAnalyticsRenderLayers from './POIAnalyticsRenderLayers';
import Tooltip from './components/Tooltip';
import * as CONSTANTS from './utils/constants';
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
    this.fetchAllPOIDetailsInCurrentViewport = this.fetchAllPOIDetailsInCurrentViewport.bind(this);
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
          details: await getTooltipFormattedDetails(allHoveredPOIDetails, FOAMTokenInUSD),
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

  async fetchAllPOIDetailsInCurrentViewport() {
    const boundingBoxDetailsFromCurrentViewPort = getBoundingBoxDetailsFromCurrentViewport(this.mapRef.getMap().getBounds());

    const pointsInCurrentViewPort = await fetchPOIDetailsFromFOAMAPI(boundingBoxDetailsFromCurrentViewPort);

    this.setState({ points: pointsInCurrentViewPort });
  }

  updateLayerSettings(settings) {
    this.setState({ settings });
  }

  render() {
    const {
      hover, settings, points, viewport, userResponse,
    } = this.state;

    if (userResponse === false) return <p>Loading...</p>;

    return (
      <div>
        <Tooltip
          allHoveredPOIDetails={hover}
        />
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
            mapStyle={CONSTANTS.MAP_STYLE}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            onLoad={this.fetchAllPOIDetailsInCurrentViewport}
          />
        </DeckGL>
      </div>
    );
  }
}

export default VizPOIAnalytics;
