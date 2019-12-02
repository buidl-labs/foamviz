export const NY_COORDINATES = {
  longitude: -74,
  latitude: 40.7,
};

// Todo: this should not be here and instead be a part of the control Panel.
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
    value: 220,
    step: 50,
    min: 50,
    max: 1000,
  },
  coverage: {
    displayName: 'Coverage',
    type: 'range',
    value: 0.63,
    step: 0.1,
    min: 0,
    max: 1,
  },
};

// Todo: this should be part of control panel and be sent as a prop to lengend component, since control panel parent component
// controls everything.
export const LEGEND_COLORS = [
  'rgb(1, 152, 189)',
  'rgb(73, 227, 206)',
  'rgb(216, 254, 181)',
  'rgb(254, 237, 177)',
  'rgb(254, 173, 84)',
  'rgb(209, 55, 78)',
];

// NYC
export const boundingBoxDefaultLocation = {
  _ne: {
    lng: '-73.878593',
    lat: '40.790939',
  },
  _sw: {
    lng: '-74.028969',
    lat: '40.636102',
  },
};
