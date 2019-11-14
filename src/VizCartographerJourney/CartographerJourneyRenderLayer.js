import { ArcLayer } from 'deck.gl';
import { getColorForArcLayer } from './utils/helper';

const CartographerJourneyRenderLayers = (props) => {
  const { data, onHover } = props;

  return [
    new ArcLayer({
      id: 'arc-layer',
      data,
      pickable: true,
      getWidth: 12,
      getSourcePosition: (d) => d.from.position,
      getTargetPosition: (d) => d.to.position,
      getSourceColor: (d) => getColorForArcLayer(d.sourceStatus),
      getTargetColor: (d) => getColorForArcLayer(d.destinationStatus),
      onHover,
    }),
  ];
};

export default CartographerJourneyRenderLayers;
