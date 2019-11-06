import React from 'react';
import DeckGL from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import POIAnalyticsControlPanel from './POIAnalyticsControlPanel';
import POIAnalyticsRenderLayers from './POIAnalyticsRenderLayers';
import * as CONSTANTS from './utils/constants';
import lightingEffect from './utils/lightingEffects';
import {
  getPointCoords,
  hexToDecimal,
  getSumOfFoamTokens,
  getValInUSD,
} from './utils/helper';

class VizPOIAnalytics extends React.Component {
  constructor(props) {
    super(props);
    this.getDataForCurrentViewport = this.getDataForCurrentViewport.bind(this);
    this.state = {
      viewport: {
        longitude: -74,
        latitude: 40.7,
        zoom: 11,
        minZoom: 5,
        maxZoom: 16,
        pitch: 45,
        bearing: 0,
      },
      hover: {
        x: 0,
        y: 0,
        hoveredObject: null,
      },
      points: [],
      FOAMTokenInUSD: 0,
      settings: Object.keys(CONSTANTS.HEXAGON_CONTROLS).reduce(
        (accu, key) => ({
          ...accu,
          [key]: CONSTANTS.HEXAGON_CONTROLS[key].value,
        }),
        {},
      ),
    };
  }

  async componentDidMount() {
    const boundingBoxNYC = {
      _ne: {
        lng: '-73.878593',
        lat: '40.790939',
      },
      _sw: {
        lng: '-74.028969',
        lat: '40.636102',
      },
    };
    this.fetchAllPOIDetailsInCurrentViewport(boundingBoxNYC);
    this.setUserLocation();
    this.setState({
      FOAMTokenInUSD: await getValInUSD(),
    });
  }

  async onHover({ x, y, object }) {
    const { FOAMTokenInUSD } = this.state;
    if (object) {
      const sumOfFoamTokens = object.points
        ? await getSumOfFoamTokens(object.points)
        : 0;
      const details = {
        latitude: object.position[0],
        longitude: object.position[1],
        numOfPoints: (object.points && object.points.length) || 0,
        sumOfFoamTokens,
        sumValInUSD: (sumOfFoamTokens * FOAMTokenInUSD).toFixed(2),
      };
      this.setState({
        hover: {
          x,
          y,
          hoveredObject: object,
          details,
        },
      });
    } else {
      this.setState({ hover: { x, y, hoveredObject: object } });
    }
  }

  setUserLocation() {
    const { viewport } = this.state;
    navigator.geolocation.getCurrentPosition((position) => {
      const newViewport = {
        ...viewport,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      this.setState({ viewport: newViewport });
    });
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
          const temp = hexToDecimal(item.state.deposit);
          const pointCoords = getPointCoords(item.geohash);
          return {
            position: [
              parseFloat(pointCoords[0].toFixed(4)),
              parseFloat(pointCoords[1].toFixed(4)),
            ],
            stakedvalue: temp,
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
        {hover.details && (
          <div
            className="tooltipStyle"
            style={{
              transform: `translate(${hover.x}px, ${hover.y}px)`,
            }}
          >
            <div className="">
              <div>
Latitude:
                {' '}
                {hover.details.latitude}
              </div>
              <div>
Longitude:
                {' '}
                {hover.details.longitude}
              </div>
              <div>
POI&apos;s:
                {' '}
                {hover.details.numOfPoints}
              </div>
              <div>
                Accumulated sum of FOAM tokens:
                {' '}
                {hover.details.sumOfFoamTokens}
              </div>
              <div>
                Accumulated value of FOAM tokens: $
                {hover.details.sumValInUSD}
              </div>
            </div>
          </div>
        )}
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
