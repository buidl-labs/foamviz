import React, { useState } from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import playButton from '../../assets/imgs/play.svg';
import pauseButton from '../../assets/imgs/pause.svg';
import resetButton from '../../assets/imgs/undo.svg';
import disabledResetButton from '../../assets/imgs/disableUndo.svg';

const TimeSeriesSlider = (props) => {

  const [disableReset, setState] = useState(true);
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
    timeSliderAtEnd
  } = props;

  if (display === false) return null;

  const filterDate = (event) => {
    filterData(event[0], event[1]);
    if(event[0] == 0 && event[1] == 544) changeResetButtonState(true);
    else changeResetButtonState(false);
  };

  const resetState = () => {
    changeResetButtonState(true);
    reset();
  };

  const playState = () => {
    changeResetButtonState(false);
    play();
  };

  const changeResetButtonState = (state) => setState(state);

  return (
    <div className="abs-container-bottom main-container-bottom">
      <div className="date-row">
        <div>
          <div className="play">
            <button type="button" className="button-img-container">
              <img onClick={playState} className="play-pause-btn" alt="PlayPauseButton" src={isPlayButton ? playButton : pauseButton} />
            </button>
            <button type="button" className="button-img-container">
              <img onClick={!disableReset ? resetState : () => {}} className={!disableReset ? "play-pause-btn" : "disable-reset-btn"} alt="PlayPauseButton" src={!disableReset ? resetButton : disabledResetButton} />
            </button>
            <div>{length > 0 ? (new Date(curMinDate).toLocaleDateString().split(',')[0]) : ''}</div>
          </div>
        </div>
        <div>{length > 0 ? (new Date(curMaxDate).toLocaleDateString().split(',')[0]) : ''}</div>
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
