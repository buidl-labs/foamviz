import { HexagonLayer } from 'deck.gl';
import { equals } from 'ramda';
import { LAYER_PROPERTIES_Op1 } from './utils/layerProperties';

const POIAnalyticsRenderLayers = function RenderedDeckGLLayerSettings(props) {
  const { data, onHover, settings } = props;

  return [
    settings.showDensityOfPoints
      && new HexagonLayer({
        id: 'heatmap',
        getPosition: (d) => d.position,
        dataComparator: (newData, oldData) => {
          const noChangeInData = equals(newData, oldData);
          console.log(noChangeInData);
          return noChangeInData;
        },
        data,
        onHover,
        ...settings,
        ...LAYER_PROPERTIES_Op1,
      }),
    settings.showStakedTokens
      && new HexagonLayer({
        id: 'stakedTokens',
        getPosition: (d) => d.position,
        getElevationValue: (points) => points.reduce((prevvalue, cur) => prevvalue + cur.stakedvalue, 0),
        getColorValue: (points) => points.reduce((prevvalue, cur) => prevvalue + cur.stakedvalue, 0),
        onSetElevationDomain: () => console.log('yolo'),
        data,
        onHover,
        ...settings,
        ...LAYER_PROPERTIES_Op1,
      }),
  ];
};

export default POIAnalyticsRenderLayers;
