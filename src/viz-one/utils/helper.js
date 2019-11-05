import Geohash from 'latlon-geohash';

export function getPointCoords(geohash) {
  const coords = Geohash.decode(geohash);
  return [coords.lon, coords.lat, 0];
}

export function hexToDecimal(hex) {
  return parseInt(hex, 16) * 10e-18;
}

export function getSumOfFoamTokens(points) {
  let sum = 0;
  points.forEach(item => {
    sum += item.stakedvalue;
  });
  return sum.toFixed(2);
}

export function getValInUSD() {
  return fetch('https://poloniex.com/public?command=returnTicker')
    .then(res => res.json())
    .then(json => {
      return Promise.resolve(json.USDC_BTC.last * json.BTC_FOAM.last);
    });
}
