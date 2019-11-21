/* eslint-disable import/no-extraneous-dependencies */
import { PhongMaterial } from '@luma.gl/core';

const HEATMAP_COLORS = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78],
];

const material = new PhongMaterial({
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51],
});

const LIGHT_SETTINGS = {
  lightsPosition: [-73.8, 40.5, 8000, -74.2, 40.9, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2,
};

const elevationRange = [0, 1000];

// Todo: to be part of Density of Points Layer component
export const LAYER_PROPERTIES_Op1 = {
  colorRange: HEATMAP_COLORS,
  lightSettings: LIGHT_SETTINGS,
  colorDomain: [0, 30],
  elevationDomain: [0, 30],
  elevationRange: [0, 1000],
  elevationScale: 5,
  extruded: true,
  opacity: 1,
  pickable: true,
  autoHighlight: true,
  material,
};

export const LAYER_PROPERTIES_Op2 = {
  colorRange: HEATMAP_COLORS,
  lightSettings: LIGHT_SETTINGS,
  elevationScale: 5,
  extruded: true,
  opacity: 1,
  pickable: true,
  autoHighlight: true,
  material,
};
