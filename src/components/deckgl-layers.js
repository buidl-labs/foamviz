import { HexagonLayer } from "deck.gl";
import { PhongMaterial } from "@luma.gl/core";

const HEATMAP_COLORS = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];

const material = new PhongMaterial({
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51]
});

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
        // transitions: { getElevationValue: { duration: 500 } },
        material,
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
        extruded: true,
        getPosition: d => d.position,
        getElevationValue: points =>
          points.reduce((prevvalue, cur) => prevvalue + cur.stakedvalue, 0),
        getColorValue: points =>
          points.reduce((prevvalue, cur) => prevvalue + cur.stakedvalue, 0),
        lightSettings: LIGHT_SETTINGS,
        opacity: 0.8,
        pickable: true,
        material,
        autoHighlight: true,
        // transitions: { getElevationValue: { duration: 500 } },
        data,
        onHover,
        ...settings
      })
  ];
}
