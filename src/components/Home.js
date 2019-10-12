import React, { Component } from "react";
import { StaticMap } from "react-map-gl";
import { LayerControls, HEXAGON_CONTROLS } from "./controls";
import { tooltipStyle } from "./style";
import DeckGL from "deck.gl";
import { AmbientLight, PointLight, LightingEffect } from "@deck.gl/core";
import taxiData from "../data/taxi";
import { renderLayers } from "./deckgl-layers";
import Geohash from "latlon-geohash";

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiaGthbWJvaiIsImEiOiJjazFkZnd2bWcwN2JnM25xcGNraDQxeW5kIn0.rGIXi0HRiNRTjgGYQCf_rg";

// const BOUNDING_BOX = [[-9.667969, 56.704506], [2.988281, 49.382373]];

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000]
});

const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000]
});

const lightingEffect = new LightingEffect({
  ambientLight,
  pointLight1,
  pointLight2
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this._onViewStateChange = this._onViewStateChange.bind(this);
    this.state = {
      viewport: {
        // longitude: this._getCenterPoint(BOUNDING_BOX)[0],
        // latitude: this._getCenterPoint(BOUNDING_BOX)[1],
        longitude: -74,
        latitude: 40.7,
        zoom: 11,
        minZoom: 5,
        maxZoom: 16,
        pitch: 45,
        bearing: 0
      },
      hover: {
        x: 0,
        y: 0,
        hoveredObject: null
      },
      points: [],
      settings: Object.keys(HEXAGON_CONTROLS).reduce(
        (accu, key) => ({
          ...accu,
          [key]: HEXAGON_CONTROLS[key].value
        }),
        {}
      ),
      style: "mapbox://styles/mapbox/dark-v9"
    };
  }

  // _getCenterPoint(bounding_box) {
  //     return [(bounding_box[0][0] + bounding_box[1][0]) / 2, (bounding_box[0][1] + bounding_box[1][1]) / 2];
  // }

  _getPointCoords(geohash) {
    let coords = Geohash.decode(geohash);
    return [coords["lon"], coords["lat"], 0];
  }

  componentDidMount() {
    let currBbox = {
      _ne: {
        lng: "-73.878593",
        lat: "40.790939"
      },
      _sw: {
        lng: "-74.028969",
        lat: "40.636102"
      }
    };
    this._fetchData(currBbox);
    console.log("ref", this.mapRef);
  }

  _fetchData = bbox => {
    fetch(
      `https://map-api-direct.foam.space/poi/filtered?swLng=${bbox._sw.lng}&swLat=${bbox._sw.lat}&neLng=${bbox._ne.lng}&neLat=${bbox._ne.lat}&limit=10000&offset=0`
    )
      .then(result => result.json())
      .then(json => {
        let points = [];
        json.forEach((item, index) => {
          let temp = this._hexToDecimal(item.state.deposit);
          item = this._getPointCoords(item.geohash);
          points[index] = {
            position: [item[0], item[1]],
            pickup: item[2],
            stakedvalue: temp
          };
        });
        this.setState({
          points
        });
      });
  };

  _hexToDecimal(hex) {
    return parseInt(hex, 16) * Math.pow(10, -18);
  }

  _processData = () => {
    const points = taxiData.reduce((accu, curr) => {
      accu.push({
        position: [Number(curr.pickup_longitude), Number(curr.pickup_latitude)],
        pickup: true
      });

      accu.push({
        position: [
          Number(curr.dropoff_longitude),
          Number(curr.dropoff_latitude)
        ],
        pickup: false
      });
      return accu;
    }, []);
    this.setState({
      points
    });
  };

  _onHover({ x, y, object }) {
    const label = object ? (object.pickup ? "Pickup" : "Dropoff") : null;
    console.log("i am hovered: ", x, y, object);
    let details = {
      latitude: "qwe",
      longitude: "asd"
    };
    this.setState({ hover: { x, y, hoveredObject: object, label, details } });
  }

  _updateLayerSettings(settings) {
    this.setState({ settings });
  }

  _onViewStateChange() {
    let newBbox = this.mapRef.getMap().getBounds();
    let bbox = {
      _ne: {
        lng: newBbox._ne.lng,
        lat: newBbox._ne.lat
      },
      _sw: {
        lng: newBbox._sw.lng,
        lat: newBbox._sw.lat
      }
    };

    this._fetchData(bbox);
  }

  render() {
    const data = this.state.points;
    if (!data.length) {
      return null;
    }
    const { hover, settings } = this.state;
    return (
      <div>
        {hover.hoveredObject && (
          <div
            style={{
              ...tooltipStyle,
              transform: `translate(${hover.x}px, ${hover.y}px)`
            }}
          >
            <div>{hover.label}</div>
            <div>{hover.details.latitude}</div>
          </div>
        )}
        <LayerControls
          settings={settings}
          propTypes={HEXAGON_CONTROLS}
          onChange={settings => this._updateLayerSettings(settings)}
        />
        <DeckGL
          layers={renderLayers({
            data: this.state.points,
            onHover: hover => this._onHover(hover),
            settings: settings
          })}
          effects={[lightingEffect]}
          initialViewState={{ ...this.state.viewport }}
          controller
          onViewStateChange={this._onViewStateChange}
        >
          <StaticMap
            ref={map => (this.mapRef = map)}
            mapStyle={this.state.style}
            mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          />
        </DeckGL>
      </div>
    );
  }
}
