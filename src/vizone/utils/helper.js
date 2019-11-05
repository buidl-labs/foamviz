import Geohash from 'latlon-geohash';

export function _getPointCoords(geohash) {
  const coords = Geohash.decode(geohash);
  return [coords.lon, coords.lat, 0];
}

export function _hexToDecimal(hex) {
  return parseInt(hex, 16) * Math.pow(10, -18);
}

export function _getSumOfFoamTokens(points) {
  let sum = 0;
  points.forEach(item => {
    sum += item.stakedvalue;
  });
  return sum.toFixed(2);
}

export function _getValInUSD() {
  return fetch('https://poloniex.com/public?command=returnTicker')
    .then(res => res.json())
    .then(json => {
      return Promise.resolve(json.USDC_BTC.last * json.BTC_FOAM.last);
    });
}
