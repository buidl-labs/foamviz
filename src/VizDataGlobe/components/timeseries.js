import React from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import playButton from '../imgs/play.svg';
import pauseButton from '../imgs/pause.svg';
import resetButton from '../imgs/undo.svg';

const TimeSeriesSlider = (props) => {
  const {
    display,
    minRange,
    maxRange,
    initialMinValue,
    initialMaxValue,
    curMinVal,
    curMaxVal,
    curMinDate,
    curMaxDate,
    count,
    filterData,
    length,
    play,
    isPlayButton,
    reset,
  } = props;

  if (display === false) return null;

  const filterDate = (event) => {
    filterData(event[0], event[1]);
  };

  const formatDate = dateStr => {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return (
      <div className="text-white">
        <div>{months[date.getMonth()]}</div>
        <div>{date.getFullYear()}</div>
      </div>
    );
  };

  return (
    <div className="abs-container-bottom main-container-bottom">
      <div className="date-row">
        <div>
          <div className="play">
            <button type="button" className="button-img-container">
              <img onClick={play} className="play-pause-btn" alt="PlayPauseButton" src={isPlayButton ? playButton : pauseButton} />
            </button>
            <button type="button" className="button-img-container">
              <img onClick={reset} className="play-pause-btn" alt="PlayPauseButton" src={resetButton} />
            </button>
            <div>{length > 0 ? formatDate(curMinDate) : ''}</div>
          </div>
        </div>
        <div>{length > 0 ? formatDate(curMaxDate) : ''}</div>
      </div>
      <Range
        onChange={filterDate}
        min={minRange}
        max={maxRange}
        value={[curMinVal, curMaxVal]}
        count={count}
        defaultValue={[initialMinValue, initialMaxValue]}
        allowCross={false}
        pushable={1}
        trackStyle={[{ backgroundColor: '#363636' }]}
        handleStyle={[
          {
            backgroundColor: 'white',
            borderRadius: '10px',
            border: '0',
            width: '8px',
            padding: '0',
          },
          {
            backgroundColor: 'white',
            borderRadius: '10px',
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
