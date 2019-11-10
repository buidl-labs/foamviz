import React from 'react';
import DeckGL from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import { fetchCartographerDetailsFromFOAMAPI } from './utils/helper';
import CartographerJourneyRenderLayers from './CartographerJourneyRenderLayer';

class VizCartographerJourney extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        longitude: 77.10,
        latitude: 28.70,
        zoom: 11,
        minZoom: 2,
        maxZoom: 16,
        pitch: 45,
        bearing: 0,
      },
      points: [],
    };
  }

  async componentDidMount() {
    const data = await fetchCartographerDetailsFromFOAMAPI();
    console.log(data);
    this.setState({
      points: data,
    });
  }

  render() {
    const { viewport, points } = this.state;
    return (
      <div>
        <DeckGL
          layers={CartographerJourneyRenderLayers({
            data: points,
          })}
                // effects={[lightingEffect]}
          initialViewState={{ ...viewport }}
          controller
        >
          <StaticMap
                //   ref={(map) => {
                //     this.mapRef = map;
                //   }}
                //   mapStyle={CONSTANTS.MAP_STYLE}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
          />
        </DeckGL>
      </div>
    );
  }
}

export default VizCartographerJourney;
