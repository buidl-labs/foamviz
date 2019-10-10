import { HexagonLayer } from "deck.gl";

const HEATMAP_COLORS = [
  [255, 255, 204],
  [199, 233, 180],
  [127, 205, 187],
  [65, 182, 196],
  [44, 127, 184],
  [37, 52, 148]
];

const LIGHT_SETTINGS = {
  lightsPosition: [-73.8, 40.5, 8000, -74.2, 40.9, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

const elevationRange = [0, 1000];

export function renderLayers(props) {
  const { data, onHover, settings } = props;
  return [
    settings.showDensityOfPoints &&
      new HexagonLayer({
        id: "heatmap",
        colorRange: HEATMAP_COLORS,
        elevationRange,
        elevationScale: 5,
        extruded: true,
        getPosition: d => d.position,
        lightSettings: LIGHT_SETTINGS,
        opacity: 0.8,
        pickable: true,
        autoHighlight: true,
        data,
        onHover,
        ...settings
      }),
    settings.showStakedTokens &&
      new HexagonLayer({
        id: "stakedTokens",
        colorRange: HEATMAP_COLORS,
        elevationRange,
        elevationScale: 5,
        extruded: false,
        getPosition: d => d.position,
        lightSettings: LIGHT_SETTINGS,
        opacity: 0.8,
        pickable: true,
        autoHighlight: true,
        data,
        onHover,
        ...settings
      })
  ];
}
