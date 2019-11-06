import { HexagonLayer } from 'deck.gl';
import LAYER_PROPERTIES from './utils/layerProperties';

function POIAnalyticsRenderLayers(props) {
  const { data, onHover, settings } = props;

  return [
    settings.showDensityOfPoints
      && new HexagonLayer({
        id: 'heatmap',
        getPosition: (d) => d.position,
        data,
        onHover,
        ...settings,
        ...LAYER_PROPERTIES,
      }),
    settings.showStakedTokens
      && new HexagonLayer({
        id: 'stakedTokens',
        getPosition: (d) => d.position,
        getElevationValue: (points) => points.reduce((prevvalue, cur) => prevvalue + cur.stakedvalue, 0),
        getColorValue: (points) => points.reduce((prevvalue, cur) => prevvalue + cur.stakedvalue, 0),
        data,
        onHover,
        ...settings,
        ...LAYER_PROPERTIES,
      }),
  ];
}

export default POIAnalyticsRenderLayers;
