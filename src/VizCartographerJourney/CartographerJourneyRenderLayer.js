import { ArcLayer } from 'deck.gl';

const CartographerJourneyRenderLayers = (props) => {
  const { data } = props;

  return [
    new ArcLayer({
      id: 'arc-layer',
      data,
      pickable: true,
      getWidth: 12,
      getSourcePosition: (d) => d.from.position,
      getTargetPosition: (d) => d.to.position,
      getSourceColor: (d) => [0, 140, 0],
      getTargetColor: (d) => [0, 140, 0],
    }),
  ];
};

export default CartographerJourneyRenderLayers;
