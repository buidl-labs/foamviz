export default async function fetchViz3Data() {
	return await fetch('https://map-api-direct.foam.space/poi/filtered?swLng=-180&swLat=-90&neLng=180&neLat=90&limit=10000&offset=0&sort=oldest').then(res => res.json());
}