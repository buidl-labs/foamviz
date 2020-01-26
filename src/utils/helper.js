async function fetchViz3Data() {
  const res = await fetch('https://foamviz-api.herokuapp.com/').then((res) => res.json());
  return JSON.parse(res);
}

export default fetchViz3Data;
