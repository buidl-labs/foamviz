import Geohash from 'latlon-geohash';
import axios from 'axios';
import Box from '3box';

const getPointCoords = (geohash) => {
  const coords = Geohash.decode(geohash);
  return [coords.lon, coords.lat, 0];
};

export const getCartographerProfile = async (cartographerAddress) => {
  const profile = await Box.getProfile(cartographerAddress);
  return Promise.resolve(profile);
};

export const getProfileAnalytics = (cartographerAddress) => axios.get(
  `https://api.blocklytics.org/foam/v0/cartographers/${cartographerAddress}/history?key=AIzaSyAz1sT-EtRPbRlTpNAw3OHNYz463vyA-I0`,
)
  .then((res) => {
    const cartographerHistory = res.data;

    const newPoints = cartographerHistory.filter((item) => item.action === 'newPoint').length;
    const removedPoints = cartographerHistory.filter((item) => item.action === 'removedPoint').length;
    const pointsChallenged = cartographerHistory.filter((item) => item.action === 'challenge').length;
    const pointsAdded = newPoints - removedPoints;

    const profile = {
      pointsChallenged,
      pointsAdded,
    };
    return Promise.resolve(profile);
  });

const resultChallenge = (listingHash) => axios.get(`https://map-api-direct.foam.space/poi/details/${listingHash}`);

const hexToDecimal = (hex) => parseInt(hex, 16) * 10 ** -18;

const getArcLayerData = (cartographerJourneyObject) => {
  const arcData = [];
  let i;

  for (i = 0; i < cartographerJourneyObject.length - 1; i += 1) {
    const pointCoordsSource = getPointCoords(cartographerJourneyObject[i].geohash);
    const pointCoordsDestination = getPointCoords(cartographerJourneyObject[i + 1].geohash);
    const sourceStatus = cartographerJourneyObject[i].state.status.type;
    const destinationStatus = cartographerJourneyObject[i + 1].state.status.type;
    const dateOfMarking = cartographerJourneyObject[i].state.createdAt;
    const stakedValue = hexToDecimal(cartographerJourneyObject[i + 1].stakedvalue);

    // data for arc-layer
    const item = {
      dateOfMarking,
      sourceStatus,
      destinationStatus,
      stakedValue,
      from: {
        name: cartographerJourneyObject[i].name,
        position: [
          parseFloat(pointCoordsSource[0].toFixed(4)),
          parseFloat(pointCoordsSource[1].toFixed(4)),
        ],
      },
      to: {
        name: cartographerJourneyObject[i + 1].name,
        position: [
          parseFloat(pointCoordsDestination[0].toFixed(4)),
          parseFloat(pointCoordsDestination[1].toFixed(4)),
        ],
      },
    };
    arcData.push(item);
  }
  return arcData;
};

export const fetchCartographerDetailsFromFOAMAPI = async (cartographerAddress) => {
  const allAddedPOIdata = await axios.get(
    `https://map-api-direct.foam.space/poi/filtered?swLng=-180&swLat=-90&neLng=180&neLat=90&limit=10000&offset=0&sort=oldest&creator=${cartographerAddress}`,
  );

  const filteredAddedPOIData = allAddedPOIdata.data.map((item) => ({
    name: item.name,
    geohash: item.geohash,
    stakedvalue: item.state.deposit,
    state: {
      createdAt: item.state.createdAt,
      status: {
        type: item.state.status.type,
      },
    },
  }));

  const allPointsOfCartographer = await axios.get(
    `https://api.blocklytics.org/foam/v0/cartographers/${cartographerAddress}/history?key=AIzaSyAz1sT-EtRPbRlTpNAw3OHNYz463vyA-I0`,
  );

  const detailOfAllChallengedPoints = allPointsOfCartographer.data.filter((item) => item.action === 'challenge');

  const pollIDsOfAllChallangePoints = detailOfAllChallengedPoints.map((item) => `0x${parseFloat(item.challenge_id).toString(16)}`);

  const promises = pollIDsOfAllChallangePoints.map((item) => axios.get(`https://map-api-direct.foam.space/challenge/${item}/doc`));

  return Promise.all(promises).then(async (res) => {
    const hashes = res.map((item) => item.data.metaData.listingHash);

    const newDataPromises = hashes.map(resultChallenge).map((p) => p.catch(() => {}));

    const results = await Promise.all(newDataPromises);

    const acceptedResults = results.filter((result) => result && !(result instanceof Error));

    const challengedPoints = acceptedResults.map((point) => ({
      name: point.data.data.name,
      geohash: point.data.data.geohash,
      stakedvalue: point.data.state.deposit,
      state: {
        createdAt: point.data.state.createdAt,
        status: {
          type: 'challenged',
        },
      },
    }));

    const test = filteredAddedPOIData.concat(challengedPoints);
    test.sort((a, b) => (new Date(a.state.createdAt).getTime() - new Date(b.state.createdAt).getTime()));
    return getArcLayerData(test);
  }).catch(() => {});
};

export const getColorForArcLayer = (code, status) => {
  if (code === 1) {
    if (status === 'applied') return [137, 53, 40, 255]; // red
    if (status === 'listing') return [137, 53, 40, 255]; // blue
    if (status === 'challenged') return [0, 113, 177, 255]; // orange
    // if (status === 'removed') return [87, 172, 96, 255]; // green
  }
  if (code === 2) {
    if (status === 'applied') return [255, 165, 43, 255]; // blue
    if (status === 'listing') return [255, 165, 43, 255]; // blue
    if (status === 'challenged') return [58, 110, 251, 255]; // orange
    // if (status === 'removed') return [87, 172, 96, 255]; // green
  }
  // return [255, 255, 255, 255];
};
