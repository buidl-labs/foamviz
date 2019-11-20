import { ArcLayer, ScatterplotLayer } from 'deck.gl';
import { getColorForArcLayer } from './utils/helper';

const CartographerJourneyRenderLayers = (props) => {
  const { data, onHover } = props;

  console.log('data:', data);

  return [
    new ArcLayer({
      id: 'arc-layer',
      data,
      pickable: true,
      getWidth: 5,
      getSourcePosition: (d) => d.from.position,
      getTargetPosition: (d) => d.to.position,
      getSourceColor: (d) => getColorForArcLayer(d.sourceStatus),
      getTargetColor: (d) => getColorForArcLayer(d.destinationStatus),
      onHover,
      autoHighlight: true,
      highlightColor: [101, 105, 237, 250],
    }),
    new ScatterplotLayer({
      id: 'scatterplot-layer',
      data,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 1,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: (d) => d.from.position,
      getRadius: (d) => 50,
      getFillColor: (d) => [101, 197, 108],
      getLineColor: (d) => [0, 0, 0],
    }),
  ];
};

export default CartographerJourneyRenderLayers;
