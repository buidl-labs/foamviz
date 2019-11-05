// eslint-disable-next-line import/no-unresolved
// eslint-disable-next-line import/no-extraneous-dependencies
import { AmbientLight, PointLight, LightingEffect } from '@deck.gl/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { PhongMaterial } from '@luma.gl/core';

export const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoiaGthbWJvaiIsImEiOiJjazFkZnd2bWcwN2JnM25xcGNraDQxeW5kIn0.rGIXi0HRiNRTjgGYQCf_rg';

export const MAP_STYLE = 'mapbox://styles/mapbox/dark-v9';

export const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

export const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000]
});

export const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000]
});

export const lightingEffect = new LightingEffect({
  ambientLight,
  pointLight1,
  pointLight2
});

export const HEXAGON_CONTROLS = {
  showDensityOfPoints: {
    displayName: 'Density of Points',
    type: 'boolean',
    value: true
  },
  showStakedTokens: {
    displayName: 'Staked Tokens',
    type: 'boolean',
    value: false
  },
  radius: {
    displayName: 'Radius',
    type: 'range',
    value: 250,
    step: 50,
    min: 50,
    max: 1000
  },
  coverage: {
    displayName: 'Coverage',
    type: 'range',
    value: 0.7,
    step: 0.1,
    min: 0,
    max: 1
  },
  upperPercentile: {
    displayName: 'Upper Percentile',
    type: 'range',
    value: 100,
    step: 0.1,
    min: 80,
    max: 100
  }
};

export const HEATMAP_COLORS = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];

export const material = new PhongMaterial({
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51]
});

export const LIGHT_SETTINGS = {
  lightsPosition: [-73.8, 40.5, 8000, -74.2, 40.9, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

export const elevationRange = [0, 1000];
