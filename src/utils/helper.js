async function fetchViz3Data() {
  try {
    const res = await fetch('https://foamviz-api.herokuapp.com/').then((res) => res.json());
    return JSON.parse(res);
  } catch (err) {
    console.log(err);
  }
}

export default fetchViz3Data;
