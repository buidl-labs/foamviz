import Geohash from 'latlon-geohash';

export const getPointCoords = (geohash) => {
  const coords = Geohash.decode(geohash);
  return [coords.lon, coords.lat, 0];
};

export const hexToDecimal = (hex) => parseInt(hex, 16) * (10 ** -18);

const getSumOfFoamTokens = (points) => {
  const sum = points.reduce((prevvalue, item) => prevvalue + item.stakedvalue, 0).toFixed(2);
  return sum;
};

export const getValInUSD = () => fetch('https://poloniex.com/public?command=returnTicker')
  .then((res) => res.json())
  .then((json) => Promise.resolve(json.USDC_BTC.last * json.BTC_FOAM.last));

export const getInitialControlPanelSettings = (constants) => Object.keys(constants).reduce(
  (accu, key) => ({
    ...accu,
    [key]: constants[key].value,
  }),
  {},
);

export const getTooltipFormattedDetails = async (allHoveredPOIDetails, FOAMTokenInUSD) => {
  const sumOfFoamTokens = allHoveredPOIDetails.points
    ? await getSumOfFoamTokens(allHoveredPOIDetails.points)
    : 0;
  const details = {
    latitude: allHoveredPOIDetails.position[0],
    longitude: allHoveredPOIDetails.position[1],
    numOfPoints:
    (allHoveredPOIDetails.points && allHoveredPOIDetails.points.length)
    || 0,
    sumOfFoamTokens,
    sumValInUSD: (sumOfFoamTokens * FOAMTokenInUSD).toFixed(2),
  };
  return details;
};

export const getBoundingBoxDetailsFromCurrentViewport = (newBoundingBox) => {
  const boundingBox = {
    _ne: {
      lng: newBoundingBox._ne.lng,
      lat: newBoundingBox._ne.lat,
    },
    _sw: {
      lng: newBoundingBox._sw.lng,
      lat: newBoundingBox._sw.lat,
    },
  };
  return boundingBox;
};

export const fetchPOIDetailsFromFOAMAPI = (boundingBox) => fetch(
  `https://map-api-direct.foam.space/poi/filtered?swLng=${boundingBox._sw.lng}&swLat=${boundingBox._sw.lat}&neLng=${boundingBox._ne.lng}&neLat=${boundingBox._ne.lat}&limit=10000&offset=0`,
)
  .then((result) => result.json())
  .then((arrayOfPOIObjects) => {
    const points = arrayOfPOIObjects.map((item) => {
      const stakedvalue = hexToDecimal(item.state.deposit);
      const pointCoords = getPointCoords(item.geohash);
      return {
        position: [
          parseFloat(pointCoords[0].toFixed(4)),
          parseFloat(pointCoords[1].toFixed(4)),
        ],
        stakedvalue,
      };
    });
    return Promise.resolve(points);
  });
