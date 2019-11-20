import React from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import playButton from '../../assets/imgs/play.svg';
import pauseButton from '../../assets/imgs/pause.svg';

const TimeSeriesSlider = (props) => {
  const {
    display,
    minRange,
    maxRange,
    initialMinValue,
    initialMaxValue,
    curMinVal,
    curMaxVal,
    count,
    filterData,
    length,
    play,
    isPlayButton,
  } = props;

  if (display === false) return null;

  const filterDate = (event) => {
    filterData(event[0], event[1]);
  };

  return (
    <div className="abs-container-bottom main-container-bottom">
      <div className="date-row">
        <div>{length > 0 ? (new Date(curMinVal).toLocaleDateString().split(',')[0]) || curMinVal.toLocaleString().split(',')[0] : ''}</div>
        <div>{length > 0 ? (new Date(curMaxVal).toLocaleDateString().split(',')[0]) || curMaxVal.toLocaleString().split(',')[0] : ''}</div>
      </div>
      <div>
        <button type="button" className="button-img-container">
          <img onClick={play} className="play-pause-btn" alt="PlayPauseButton" src={isPlayButton ? playButton : pauseButton} />
        </button>
      </div>
      <Range
        onChange={filterDate}
        min={minRange}
        max={maxRange}
        value={[curMinVal, curMaxVal]}
        count={count}
        defaultValue={[initialMinValue, initialMaxValue]}
        allowCross={false}
        pushable={false}
        trackStyle={[{ backgroundColor: '#363636' }]}
        handleStyle={[
          {
            backgroundColor: 'black',
            borderRadius: '0',
            border: '0',
            width: '8px',
            padding: '0',
          },
          {
            backgroundColor: 'black',
            borderRadius: '0',
            border: '0',
            width: '8px',
            padding: '0',
          }]}
        activeHandleStyle={[{
          background: 'green',
        },

        ]}
        railStyle={{ backgroundColor: '#D6D6D6' }}
      />
    </div>
  );
};

export default TimeSeriesSlider;
