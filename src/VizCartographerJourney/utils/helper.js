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

// const profile = {
//   points: data.length + 1, // since we get N-1 points for arc-layer incase of N points marked
//   challenged: data.reduce((acc, val) => (val.sourceStatus === 'challenged' ? val + acc : 0), 0),
// };
// return profile;

export const getProfileAnalytics = (cartographerAddress) => axios.get(
  `http://api.blocklytics.org/foam/v0/cartographers/${cartographerAddress}/history?key=AIzaSyAz1sT-EtRPbRlTpNAw3OHNYz463vyA-I0`,
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

export const fetchCartographerDetailsFromFOAMAPI = (cartographerAddress) => axios.get(
  `https://map-api-direct.foam.space/poi/filtered?swLng=-180&swLat=-90&neLng=180&neLat=90&limit=10000&offset=0&sort=oldest&creator=${cartographerAddress}`,
)
  .then(
    (res) => {
      const cartographerJourneyObject = res.data;
      const arcData = [];
      let i;

      for (i = 0; i < cartographerJourneyObject.length - 1; i += 1) {
        const pointCoordsSource = getPointCoords(cartographerJourneyObject[i].geohash);
        const pointCoordsDestination = getPointCoords(cartographerJourneyObject[i + 1].geohash);
        const sourceStatus = cartographerJourneyObject[i].state.status.type;
        const destinationStatus = cartographerJourneyObject[i + 1].state.status.type;
        const dateOfMarking = cartographerJourneyObject[i].state.createdAt;

        // data for arc-layer
        const item = {
          dateOfMarking,
          sourceStatus,
          destinationStatus,
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
      return Promise.resolve(arcData);
    },
  );

export const getColorForArcLayer = (status) => {
  if (status === 'applied') return [46, 124, 230, 255]; // blue
  if (status === 'listing') return [46, 124, 230, 255]; // blue
  if (status === 'challenged') return [252, 199, 108, 255]; // orange
  if (status === 'removed') return [87, 172, 96, 255]; // green
  return [255, 255, 255, 255];
};
