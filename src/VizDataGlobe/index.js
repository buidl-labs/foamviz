import React from 'react';
import Geohash from 'latlon-geohash';
import debounce from 'lodash/debounce';
import Globe from './components/globe';
import Analytics from './components/analytics';
import TimeSeries from './components/timeseries';
import { store } from '../global-store';
import fetchViz3Data from '../utils/helper';
import Loader from './components/Loader';
import './index.css';
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';
import CountUp from 'react-countup';
import quesMark from '../assets/imgs/question.svg';

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
      displayValueMobile: true,
      arrowUp: true,
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
    window.onresize = () => {
      if (window.RT) clearTimeout(window.RT);
      window.RT = setTimeout(() => window.location.reload(false), 100);
    };

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
          // console.log('state1');
        } else if (store.loading) {
          // console.log('state2');
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
          // console.log('state3');
          // fetch data and add to storage
          // user has directly jumped here on this url
          refreshed = true;
          fetchViz3Data().then((newData) => {
            localStorage.setItem('viz3data', JSON.stringify(newData));
            resolve(newData);
          });
        }

        if (!refreshed) {
          // console.log('refreshing...');
          this.setState({ fetchingNewData: true });
          fetchViz3Data().then((newData) => {
            const oldData = JSON.parse(localStorage.getItem('viz3data'));
            if (newData.length !== oldData.length) {
              localStorage.setItem('viz3data', JSON.stringify(newData));
              // alert('new data udpated!');
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

  filterData(newMinVal, newMaxVal, cb = () => { }) {
    const { timelineMin, timelineMax } = this.state;

    if (newMinVal !== timelineMin || newMaxVal !== timelineMax) {
      this.setState({
        timelineMin: newMinVal,
        timelineMax: newMaxVal,
        filtering: true,
      }, () => {
        this.updateDataOnGlobe(newMinVal, newMaxVal);
        cb();
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

    this.filterData(
      timelineMin, timelineMax !== globalMax ? timelineMax + 1 : timelineMin,
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
      globeResolution,
      displayValueMobile,
      arrowUp,
    } = this.state;

    if (loading) return <Loader display={loading} />;

    const [min, max] = [0, dataDateChunks.length - 1];

    const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const marks = {};
    const markStyle = {
      color: 'white',
      background: 'black',
      width: 56,
      wordWrap: 'break-word',
      height: 20,
    };
    for (let i = 0; i < dataDateChunks.length; i += 1) {
      const date = new Date(dataDateChunks[i][0].createdAt);
      marks[i] = {
        label: `${months[date.getMonth()]} ${date.getFullYear()}`,
        style: markStyle,
      };
    }

    return (
      <div>
        <div className="i-tooltip"><img alt="help" src={quesMark} width="20px" />
          <span className="i-tooltiptext">Shows all POIs since inception of FOAM on a globe for a bird eye's view</span>
        </div>
        <div className="m-top-info dn m-show">
          {!displayValueMobile ? (<div className="m-foam-token">
            <CountUp
              delay={0}
              preserveValue
              end={totalStakedValue}
              duration={1}
              decimals={2}
              formattingFn={(value) => (value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))}
            >
              {({ countUpRef }) => (<h1 className="mt-0 m-num-title" ref={countUpRef}>123</h1>)}
            </CountUp>
            <h2 className="m-num-sub">FOAM Tokens Staked</h2>
          </div>) :
            (<div className="m-foam-value">
              <p className="dollar">$</p>
              <CountUp
                delay={0}
                preserveValue
                end={Number(totalStakedValue * foamUSDRate).toFixed(2)}
                duration={1}
                decimals={2}
                formattingFn={(value) => (value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))}
              >
                {({ countUpRef }) => (<h1 className="m-num-title" ref={countUpRef}>123</h1>)}
              </CountUp>
              <h2 className="m-num-sub">Net Value Staked</h2>
            </div>)}
          <button
            className="m-button"
            onClick={() => this.setState({ displayValueMobile: !displayValueMobile })}
          >{displayValueMobile ? 'Show FOAM Tokens Staked' : 'Show Net Value Staked'}</button>
        </div>
        <div className="dm-none">
          <Analytics
            display
            stakedValue={totalStakedValue}
            USDRate={foamUSDRate}
            pastValue={pastAnalyticsValue}
            toggleRotate={this.toggleRotate}
            updateResolution={(v) => {
              this.setState({ globeResolution: v });
            }}
          />
        </div>
        <div className="dn m-show">
          <SwipeableBottomSheet
            overflowHeight={220}
            marginTop={128}
            style={{ zIndex: 5 }}
            onChange={() => this.setState({ arrowUp: !arrowUp })}
          >
            <div style={{ height: '380px' }}>
              <Analytics
                display
                arrowUp={arrowUp}
                stakedValue={totalStakedValue}
                USDRate={foamUSDRate}
                pastValue={pastAnalyticsValue}
                toggleRotate={this.toggleRotate}
                updateResolution={(v) => {
                  this.setState({ globeResolution: v });
                }}
              />
              <TimeSeries
                display
                count={2}
                resetEnabled={!(timelineMin === 0 && timelineMax === dataDateChunks.length - 1)}
                length={filteredData.length || 0}
                minRange={min}
                maxRange={max}
                marks={marks}
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
          </SwipeableBottomSheet>
        </div>
        <Globe
          data={filteredData}
          USDRate={foamUSDRate}
          pointWeight="stakedvalue"
          maxAltVal={10e3}
          interactive={!filtering}
          resolution={globeResolution}
          rotationStatus={isRotateState}
        />
        <div className="dm-none">
          <TimeSeries
            display
            count={2}
            resetEnabled={!(timelineMin === 0 && timelineMax === dataDateChunks.length - 1)}
            length={filteredData.length || 0}
            minRange={min}
            maxRange={max}
            marks={marks}
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
      </div>
    );
  }
}

export default VizDataGlobe;
