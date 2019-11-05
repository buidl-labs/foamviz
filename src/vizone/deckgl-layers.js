import { HexagonLayer } from 'deck.gl';
import * as CONSTANTS from './utils/constants';

function renderLayers(props) {
  const { data, onHover, settings } = props;
  return [
    settings.showDensityOfPoints &&
      new HexagonLayer({
        id: 'heatmap',
        colorRange: CONSTANTS.HEATMAP_COLORS,
        elevationRange: CONSTANTS.elevationRange,
        elevationScale: 5,
        extruded: true,
        getPosition: d => d.position,
        lightSettings: CONSTANTS.LIGHT_SETTINGS,
        opacity: 0.8,
        pickable: true,
        autoHighlight: true,
        // transitions: { getElevationValue: { duration: 500 } },
        material: CONSTANTS.material,
        data,
        onHover,
        ...settings
      }),
    settings.showStakedTokens &&
      new HexagonLayer({
        id: 'stakedTokens',
        colorRange: CONSTANTS.HEATMAP_COLORS,
        elevationRange: CONSTANTS.elevationRange,
        elevationScale: 5,
        extruded: true,
        getPosition: d => d.position,
        getElevationValue: points =>
          points.reduce((prevvalue, cur) => prevvalue + cur.stakedvalue, 0),
        getColorValue: points =>
          points.reduce((prevvalue, cur) => prevvalue + cur.stakedvalue, 0),
        lightSettings: CONSTANTS.LIGHT_SETTINGS,
        opacity: 0.8,
        pickable: true,
        material: CONSTANTS.material,
        autoHighlight: true,
        // transitions: { getElevationValue: { duration: 500 } },
        data,
        onHover,
        ...settings
      })
  ];
}

export default renderLayers;
