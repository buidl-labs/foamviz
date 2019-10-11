/// app.js
import React from 'react';
import DeckGL from '@deck.gl/react';
import StaticMap, { NavigationControl } from 'react-map-gl';
import Geohash from 'latlon-geohash';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import './Home.css';

// getElevationValue: points => points.reduce((prevvalue, cur) => prevvalue + cur.stakedvalue, 0),
// north america
// https://map-api-direct.foam.space/poi/filtered?swLng=-126.035156&swLat=23.563987&neLng=-61.875000&neLat=49.610710&limit=10000&offset=0

// nyc
// https://map-api-direct.foam.space/poi/filtered?swLng=-74.028969&swLat=40.636102&neLng=-73.878593&neLat=40.790939&limit=10000&offset=0

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiaGthbWJvaiIsImEiOiJjazFkZnd2bWcwN2JnM25xcGNraDQxeW5kIn0.rGIXi0HRiNRTjgGYQCf_rg';

const BOUNDING_BOX = [
    [-5.96, 49.83],
    [1.87, 55.24]
];
const INITIAL_ZOOM = 6;
const MIN_ZOOM = 5;
const MAX_ZOOM = 15;

let data = [];

const OPTIONS = ['radius', 'coverage', 'upperPercentile'];

const COLOR_RANGE = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78]
];

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                width: 400,
                height: 400,
                longitude: this.getCenterPoint(BOUNDING_BOX)[0],
                latitude: this.getCenterPoint(BOUNDING_BOX)[1],
                zoom: INITIAL_ZOOM,
                minZoom: MIN_ZOOM,
                maxZoom: MAX_ZOOM,
                pitch: 42.5
            },
            renderLayer: new HexagonLayer({})
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        // OPTIONS.forEach(key => {
        //     document.getElementById(key).oninput = this.renderLayer;
        // });
        this.fetchPoints(100, 0);
    }

    getCenterPoint(bounding_box) {
        return [(bounding_box[0][0] + bounding_box[1][0]) / 2, (bounding_box[0][1] + bounding_box[1][1]) / 2];
    }

    getPointCoords(geohash) {
        let coords = Geohash.decode(geohash);
        return [coords['lon'], coords['lat'], 0];
    }

    renderLayer() {
        const options = {};
        // OPTIONS.forEach(key => {
        //     const value = document.getElementById(key).value;
        //     document.getElementById(key + '-value').innerHTML = value;
        //     options[key] = Number(value);
        // });

        const hexagonLayer = new HexagonLayer({
            id: 'heatmap',
            colorRange: COLOR_RANGE,
            data,
            elevationRange: [0, 1000],
            elevationScale: 250,
            extruded: true,
            getPosition: d => d,
            opacity: 1,
            ...options
        });

        this.setState({
            renderLayer: hexagonLayer
        })

    }

    fetchPoints = (limit, offset) => {
        fetch('https://map-api-direct.foam.space/poi/filtered?swLng=' + BOUNDING_BOX[0][0] + '&swLat=' + BOUNDING_BOX[0][1] + '&neLng=' + BOUNDING_BOX[1][0] + '&neLat=' + BOUNDING_BOX[1][1] + '&status=application&status=listing&sort=most_value&limit=' + limit + '&offset=' + offset)
            .then(result => result.json())
            .then(json => {
                console.log('data is fetched: ', json)
                json.forEach((record) => {
                    data.push(this.getPointCoords(record.geohash));
                });

                offset += json.length
                if (json.length === limit) {
                    this.fetchPoints(limit, offset)
                } else {
                    this.renderLayer();
                }
            });
    }

    handleChange = () => {
        console.log('working !!!')
    }

    _renderInfoBox() {
        return (
            <div>
                <button onClick={this.handleChange}>click me</button>
            </div>
        )
    }

    render() {
        return (
            <div>
                <DeckGL
                    initialViewState={{ ...this.state.viewport }}
                    controller={true}
                    layers={[this.state.renderLayer]}
                    onClick={(info, event) => {
                        console.log("info", info);
                        console.log("event", event);
                    }}
                >
                    <StaticMap
                        mapStyle="mapbox://styles/mapbox/dark-v9"
                        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} >
                        {/* <div className="control-panel">
                        <div>
                            <label>Radius</label>
                            <input id="radius" type="range" min="1000" max="20000" step="1000" value="4000" onChange={this.handleChange}></input>
                            <span id="radius-value"></span>
                        </div>
                        <div>
                            <label>Coverage</label>
                            <input id="coverage" type="range" min="0" max="1" step="0.1" value="1" onChange={this.handleChange}></input>
                            <span id="coverage-value"></span>
                        </div>
                        <div>
                            <label>Upper Percentile</label>
                            <input id="upperPercentile" type="range" min="90" max="100" step="1" value="100" onChange={this.handleChange}></input>
                            <span id="upperPercentile-value"></span>
                        </div>
                    </div> */}
                        {/* {this._renderInfoBox()} */}
                        <button onClick={event => {
                            console.log("hey", event);
                        }}>click me</button>
                    </StaticMap>
                </DeckGL>
            </div>
        );
    }
}

export default Home;