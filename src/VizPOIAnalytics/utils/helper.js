import Geohash from 'latlon-geohash';
import axios from 'axios';

export const getPointCoords = (geohash) => {
  const coords = Geohash.decode(geohash);
  return [coords.lon, coords.lat, 0];
};

export const hexToDecimal = (hex) => parseInt(hex, 16) * 10 ** -18;

const getSumOfFoamTokens = (points) => {
  const sum = points
    .reduce((prevvalue, item) => prevvalue + item.stakedvalue, 0)
    .toFixed(2);
  return sum;
};

export const getCurrentLocation = (options) => new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      ({ code, message }) => reject(
          Object.assign(new Error(message), { name: 'PositionError', code }),
        ),
      options,
    );
  });

export const getInitialControlPanelSettings = (constants) => Object.keys(constants).reduce(
    (accu, key) => ({
      ...accu,
      [key]: constants[key].value,
    }),
    {},
  );

// Todo: To be part of TodoComponent
export const getTooltipFormattedDetails = (
  allHoveredPOIDetails,
  FOAMTokenInUSD,
) => {
  const sumOfFoamTokens = allHoveredPOIDetails.points
    ? getSumOfFoamTokens(allHoveredPOIDetails.points)
    : 0;
  const details = {
    latitude: allHoveredPOIDetails.position[0],
    longitude: allHoveredPOIDetails.position[1],
    numOfPoints:
      (allHoveredPOIDetails.points && allHoveredPOIDetails.points.length) || 0,
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

// Helper API Calls
export const getFOAMUSDRate = async () => {
  const url = 'https://poloniex.com/public?command=returnTicker';

  try {
    const response = await axios.get(url);
    const FOAM_BTC = response.data.BTC_FOAM.last;
    const BTC_USDC = response.data.USDC_BTC.last;

    return FOAM_BTC * BTC_USDC;
  } catch (error) {
    console.log(error);
  }
};

export const fetchPOIDetailsFromFOAMAPI = async (boundingBox) => {
  const url = `https://map-api-direct.foam.space/poi/filtered?swLng=${boundingBox._sw.lng}&swLat=${boundingBox._sw.lat}&neLng=${boundingBox._ne.lng}&neLat=${boundingBox._ne.lat}&limit=10000&offset=0`;

  try {
    const response = await axios.get(url);

    // console.log(response.data);

    const formattedObjectForDeckGl = response.data.map((item) => {
      const stakedvalue = hexToDecimal(item.state.deposit);
      const pointCoords = getPointCoords(item.geohash);
      const { listingHash } = item;

      return {
        position: [parseFloat(pointCoords[0]), parseFloat(pointCoords[1])],
        stakedvalue,
        listingHash,
      };
    });

    return formattedObjectForDeckGl;
  } catch (error) {
    console.log(error);
  }
};
