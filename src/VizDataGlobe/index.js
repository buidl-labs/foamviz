import React from 'react';
import Geohash from 'latlon-geohash';
import debounce from 'lodash/debounce';
import Globe from './components/globe';
import Analytics from './components/analytics';
import TimeSeries from './components/timeseries';
import { store } from '../global-store';
import fetchViz3Data from '../utils/helper';
import './index.css';

const transformData = (data) => data
  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  .map((item) => ({
    createdAt: item.state.createdAt,
    lat: Geohash.decode(item.geohash).lat,
    lng: Geohash.decode(item.geohash).lon,
    stakedvalue: parseFloat((parseInt(item.state.deposit, 16) * 10 ** -18).toFixed(2)),
  }));

const getDataDateChunks = (data) => {
  const chunks = {};
  data.forEach((p) => {
    const date = new Date(p.createdAt);
    const id = `${date.getFullYear()}-${date.getMonth()}`;
    if (!chunks[id]) chunks[id] = [];
    chunks[id].push(p);
  });
  return chunks;
};

class VizDataGlobe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filteredData: [],
      loading: true,
      totalStakedValue: null,
      foamUSDRate: null,
      pastAnalyticsValue: 0,
      isRotateState: false,
    };

    this.reset = this.reset.bind(this);
    this.toggle = this.toggle.bind(this);
    this.getData = this.getData.bind(this);
    this.filterData = this.filterData.bind(this);
    this.initComponent = this.initComponent.bind(this);
    this.updateDataOnGlobe = debounce(this.updateDataOnGlobe.bind(this), 500);
    this.toggleRotate = this.toggleRotate.bind(this);
  }

  async componentDidMount() {
    // window.onresize = () => {
    //   if (window.RT) clearTimeout(window.RT);
    //   window.RT = setTimeout(() => window.location.reload(false), 10);
    // };

    const response = await this.getData();
    this.initComponent(response);
  }

  getData() {
    return new Promise((resolve, reject) => {
      try {
        let refreshed = false;
        const dataFromStorage = JSON.parse(localStorage.getItem('viz3data'));
        // const loading = localStorage.getItem('loading');
        if (dataFromStorage) {
          resolve(dataFromStorage);
          console.log('state1');
        } else if (store.loading) {
          console.log('state2');
          // show fetching new data
          // add listener to check if new data is there and update data and remove text
          const localDataInterval = setInterval(() => {
            if (!store.loading) {
              const newDataFromStorage = JSON.parse(localStorage.getItem('viz3data'));
              store.loading = false;
              clearInterval(localDataInterval);
              resolve(newDataFromStorage);
            }
          }, 200);
        } else {
          console.log('state3');
          // fetch data and add to storage
          // user has directly jumped here on this url
          refreshed = true;
          fetchViz3Data().then((newData) => {
            localStorage.setItem('viz3data', JSON.stringify(newData));
            resolve(newData);
          });
        }

        if (!refreshed) {
          console.log('refreshing...');
          this.setState({ fetchingNewData: true });
          fetchViz3Data().then((newData) => {
            const oldData = JSON.parse(localStorage.getItem('viz3data'));
            if (newData.length !== oldData.length) {
              localStorage.setItem('viz3data', JSON.stringify(newData));
              alert('new data udpated!');
              this.initComponent(newData);
            }
            this.setState({ fetchingNewData: false });
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async initComponent(response) {
    const data = transformData(response);
    const dataDateChunks = Object.values(getDataDateChunks(data));
    const foamUSDResponse = await fetch('https://poloniex.com/public?command=returnTicker').then((res) => res.json());
    const { BTC_FOAM, USDC_BTC } = foamUSDResponse;

    this.setState({
      loading: false,
      data,
      filteredData: data,
      dataDateChunks,
      timelineMin: 0,
      timelineMax: dataDateChunks.length - 1,
      globalMax: dataDateChunks.length - 1,
      totalStakedValue: data
        .map((d) => d.stakedvalue)
        .reduce((a, b) => a + b, 0)
        .toFixed(2),
      foamUSDRate: BTC_FOAM.last * USDC_BTC.last,
    });
  }

  updateDataOnGlobe(newMinVal, newMaxVal) {
    const { dataDateChunks, totalStakedValue, foamUSDRate } = this.state;
    const filteredData = dataDateChunks
      .slice(newMinVal, newMaxVal)
      .reduce((a, b) => a.concat(b), []);

    this.setState({
      filteredData,
      filtering: false,
      pastAnalyticsValue: Number(totalStakedValue * foamUSDRate).toFixed(2),
      totalStakedValue: filteredData
        .map((d) => d.stakedvalue)
        .reduce((a, b) => a + b, 0)
        .toFixed(2),
    });
  }

  filterData(newMinVal, newMaxVal) {
    const { timelineMin, timelineMax } = this.state;

    if (newMinVal !== timelineMin || newMaxVal !== timelineMax) {
      this.setState({
        timelineMin: newMinVal,
        timelineMax: newMaxVal,
        filtering: true,
      }, () => {
        this.updateDataOnGlobe(newMinVal, newMaxVal);
      });
    }
  }

  toggle() {
    const { playing } = this.state;
    this.setState({ playing: !playing });

    if (this.showInterval) {
      clearInterval(this.showInterval);
      this.showInterval = !this.showInterval;
      return;
    }

    const { timelineMax, timelineMin, globalMax } = this.state;

    this.setState(
      {
        timelineMin,
        timelineMax:
          timelineMax !== globalMax
            ? timelineMax + 1
            : timelineMin + 1,
      },
      () => {
        if (this.showInterval) clearInterval(this.showInterval);
        this.showInterval = setInterval(() => {
          const { timelineMin, timelineMax } = this.state;
          if (timelineMax + 1 > globalMax) return this.toggle();
          this.filterData(timelineMin, timelineMax + 1);
        }, 3000);
      },
    );
  }

  reset() {
    const { playing, dataDateChunks } = this.state;
    if (playing) this.toggle();
    this.filterData(0, dataDateChunks.length - 1);
  }

  toggleRotate() {
    this.setState({ isRotateState: !this.state.isRotateState });
  }

  render() {
    const {
      loading,
      playing,
      filteredData,
      dataDateChunks,
      timelineMin,
      timelineMax,
      totalStakedValue,
      pastAnalyticsValue,
      foamUSDRate,
      filtering,
      isRotateState,
    } = this.state;

    if (loading) return <p>loading...</p>;

    const [min, max] = [0, dataDateChunks.length - 1];

    return (
      <div>
        <Analytics
          display
          stakedValue={totalStakedValue}
          USDRate={foamUSDRate}
          pastValue={pastAnalyticsValue}
          toggleRotate={this.toggleRotate}
        />
        <Globe
          data={filteredData}
          pointWeight="stakedvalue"
          maxAltVal={10e3}
          interactive={!filtering}
          rotationStatus={isRotateState}
        />
        <TimeSeries
          display
          count={2}
          resetEnabled={!(timelineMin === 0 && timelineMax === dataDateChunks.length - 1)}
          length={filteredData.length || 0}
          minRange={min}
          maxRange={max}
          curMinVal={timelineMin}
          curMaxVal={timelineMax}
          curMinDate={dataDateChunks[timelineMin][0].createdAt}
          curMaxDate={dataDateChunks[timelineMax][0].createdAt}
          initialMinValue={min}
          initialMaxValue={max}
          filterData={this.filterData}
          play={this.toggle}
          reset={this.reset}
          isPlayButton={!playing}
        />
      </div>
    );
  }
}

export default VizDataGlobe;
