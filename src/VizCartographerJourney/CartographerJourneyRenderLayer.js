import { ArcLayer, ScatterplotLayer } from 'deck.gl';
import { getColorForArcLayer } from './utils/helper';

const CartographerJourneyRenderLayers = (props) => {
  const { data, onHover } = props;

  return [
    new ArcLayer({
      id: 'arc-layer',
      data,
      pickable: true,
      getWidth: 4,
      getSourcePosition: (d) => d.from.position,
      getTargetPosition: (d) => d.to.position,
      getSourceColor: (d) => getColorForArcLayer(1, d.sourceStatus),
      getTargetColor: (d) => getColorForArcLayer(2, d.destinationStatus),
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
      getRadius: (d) => (d.stakedValue * 10),
      getFillColor: () => [101, 197, 108, 100],
      getLineColor: () => [101, 197, 108],
    }),
  ];
};

export default CartographerJourneyRenderLayers;
