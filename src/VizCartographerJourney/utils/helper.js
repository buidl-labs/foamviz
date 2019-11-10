import Geohash from 'latlon-geohash';
import axios from 'axios';

export const getPointCoords = (geohash) => {
  const coords = Geohash.decode(geohash);
  return [coords.lon, coords.lat, 0];
};

export const fetchCartographerDetailsFromFOAMAPI = () => axios.get(
  'https://map-api-direct.foam.space/poi/filtered?swLng=-180&swLat=-90&neLng=180&neLat=90&limit=100&offset=0&sort=oldest&creator=0xda65d14fb04ce371b435674829bede656693eb48',
)
  .then(
    (res) => {
      const cartographerJourneyObject = res.data;
      const arcData = [];
      let i;
      for (i = 0; i < cartographerJourneyObject.length - 1; i++) {
        const pointCoordsSource = getPointCoords(cartographerJourneyObject[i].geohash);
        const pointCoordsDestination = getPointCoords(cartographerJourneyObject[i + 1].geohash);

        const item = {
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
