import React from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

const TimeSeriesSlider = (props) => {
  const {
    display, minDate, maxDate, onSliderValueChange, currMin, currMax,
  } = props;

  if (display === false) return null;

  //   const currMin = new Date(currMin);
  //     const currMax = new Date(currMax);

  return (
    <div className="abs-container-bottom main-container-bottom">
      <Range
        onAfterChange={onSliderValueChange}
        minDate={minDate}
        maxDate={maxDate}
        count={2}
        defaultValue={[minDate, maxDate]}
        allowCross
        trackStyle={[{ backgroundColor: '#363636' }]}
        handleStyle={[{
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
