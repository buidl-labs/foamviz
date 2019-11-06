import Geohash from 'latlon-geohash';

export function getPointCoords(geohash) {
  const coords = Geohash.decode(geohash);
  return [coords.lon, coords.lat, 0];
}

export function hexToDecimal(hex) {
  return parseInt(hex, 16) * (10 ** -18);
}

export function getSumOfFoamTokens(points) {
  const sum = points.reduce((prevvalue, item) => prevvalue + item.stakedvalue, 0).toFixed(2);
  return sum;
}

export function getValInUSD() {
  return fetch('https://poloniex.com/public?command=returnTicker')
    .then((res) => res.json())
    .then((json) => Promise.resolve(json.USDC_BTC.last * json.BTC_FOAM.last));
}
