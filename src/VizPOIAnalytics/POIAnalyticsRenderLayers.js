import { HexagonLayer } from 'deck.gl';
import { equals } from 'ramda';
import LAYER_PROPERTIES from './utils/layerProperties';

const POIAnalyticsRenderLayers = function RenderedDeckGLLayerSettings(props) {
  const { data, onHover, settings } = props;

  return [
    settings.showDensityOfPoints
      && new HexagonLayer({
        id: 'heatmap',
        getPosition: (d) => d.position,
        dataComparator: (newData, oldData) => equals(newData, oldData),
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
};

export default POIAnalyticsRenderLayers;
