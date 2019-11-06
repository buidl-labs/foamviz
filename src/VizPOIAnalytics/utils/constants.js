export const MAP_STYLE = 'mapbox://styles/mapbox/dark-v9';

export const HEXAGON_CONTROLS = {
  showDensityOfPoints: {
    displayName: 'Density of Points',
    type: 'boolean',
    value: true,
  },
  showStakedTokens: {
    displayName: 'Staked Tokens',
    type: 'boolean',
    value: false,
  },
  radius: {
    displayName: 'Radius',
    type: 'range',
    value: 250,
    step: 50,
    min: 50,
    max: 1000,
  },
  coverage: {
    displayName: 'Coverage',
    type: 'range',
    value: 0.7,
    step: 0.1,
    min: 0,
    max: 1,
  },
  upperPercentile: {
    displayName: 'Upper Percentile',
    type: 'range',
    value: 100,
    step: 0.1,
    min: 80,
    max: 100,
  },
};

export const legendColors = [
  'rgb(1, 152, 189)',
  'rgb(73, 227, 206)',
  'rgb(216, 254, 181)',
  'rgb(254, 237, 177)',
  'rgb(254, 173, 84)',
  'rgb(209, 55, 78)',
];

export const boundingBoxNYC = {
  _ne: {
    lng: '-73.878593',
    lat: '40.790939',
  },
  _sw: {
    lng: '-74.028969',
    lat: '40.636102',
  },
};
