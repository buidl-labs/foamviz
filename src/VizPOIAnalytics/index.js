import React from 'react';
import DeckGL from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import POIAnalyticsControlPanel from './POIAnalyticsControlPanel';
import POIAnalyticsRenderLayers from './POIAnalyticsRenderLayers';
import Tooltip from './components/Tooltip';
import * as CONSTANTS from './utils/constants';
import lightingEffect from './utils/lightingEffects';
import {
  getPointCoords,
  hexToDecimal,
  getValInUSD,
  getSumOfFoamTokens,
  getInitialControlPanelSettings,
  getToolTipFormattedDetails,
} from './utils/helper';

class VizPOIAnalytics extends React.Component {
  constructor(props) {
    super(props);
    this.getDataForCurrentViewport = this.getDataForCurrentViewport.bind(this);
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
    };
  }

  async componentDidMount() {
    this.setState({
      FOAMTokenInUSD: await getValInUSD(),
    });
    this.fetchAllPOIDetailsInCurrentViewport(
      CONSTANTS.boundingBoxDefaultLocation,
    );
    this.setUserLocation();
  }

  async onHover({ x, y, object }) {
    const allHoveredPOIDetails = object;
    const { FOAMTokenInUSD } = this.state;
    if (allHoveredPOIDetails) {
      const sumOfFoamTokens = allHoveredPOIDetails.points
        ? await getSumOfFoamTokens(allHoveredPOIDetails.points)
        : 0;
      const details = {
        latitude: allHoveredPOIDetails.position[0],
        longitude: allHoveredPOIDetails.position[1],
        numOfPoints:
        (allHoveredPOIDetails.points && allHoveredPOIDetails.points.length)
        || 0,
        sumOfFoamTokens,
        sumValInUSD: (sumOfFoamTokens * FOAMTokenInUSD).toFixed(2),
      };
      this.setState({
        hover: {
          x,
          y,
          hoveredObject: allHoveredPOIDetails,
          details,
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
          this.setState({ viewport: newViewport });
        },
        (err) => {
          if (err.code === 1 || err.message === 'User denied Geolocation') {
            this.fetchAllPOIDetailsInCurrentViewport(
              CONSTANTS.boundingBoxDefaultLocation,
            );
          }
        },
      );
    }
  }

  getDataForCurrentViewport() {
    const newBoundingBox = this.mapRef.getMap().getBounds();
    const boundingBox = {
      _ne: {
        lng: newBoundingBox._ne.lng,
        lat: newBoundingBox._ne.lat,
      },
      _sw: {
        lng: newBoundingBox._sw.lng,
        lat: newBoundingBox._sw.lat,
      },
    };
    this.fetchAllPOIDetailsInCurrentViewport(boundingBox);
  }

  updateLayerSettings(settings) {
    this.setState({ settings });
  }

  fetchAllPOIDetailsInCurrentViewport(boundingBox) {
    fetch(
      `https://map-api-direct.foam.space/poi/filtered?swLng=${boundingBox._sw.lng}&swLat=${boundingBox._sw.lat}&neLng=${boundingBox._ne.lng}&neLat=${boundingBox._ne.lat}&limit=10000&offset=0`,
    )
      .then((result) => result.json())
      .then((arrayOfPOIObjects) => {
        const points = arrayOfPOIObjects.map((item) => {
          const stakedvalue = hexToDecimal(item.state.deposit);
          const pointCoords = getPointCoords(item.geohash);
          return {
            position: [
              parseFloat(pointCoords[0].toFixed(4)),
              parseFloat(pointCoords[1].toFixed(4)),
            ],
            stakedvalue,
          };
        });
        this.setState({
          points,
        });
      });
  }

  render() {
    const {
      hover, settings, points, viewport,
    } = this.state;

    if (!points.length) return null;

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
          onDragEnd={this.getDataForCurrentViewport}
        >
          <StaticMap
            ref={(map) => {
              this.mapRef = map;
            }}
            mapStyle={CONSTANTS.MAP_STYLE}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            onLoad={this.getDataForCurrentViewport}
          />
        </DeckGL>
      </div>
    );
  }
}

export default VizPOIAnalytics;
