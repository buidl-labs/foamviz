import React from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

const TimeSeriesSlider = (props) => {
  const {
    display,
    // data,
    minRange,
    maxRange,
    // curMinVal,
    // curMaxVal,
    // count,
    filterDate,
    length,
  } = props;
  // const currMin = new Date(props.currMin);
  // const currMax = new Date(props.currMax);

  if (display === false) return null;

  //   const currMin = new Date(currMin);
  //     const currMax = new Date(currMax);

  return (
    <div className="abs-container-bottom main-container-bottom">
      <div className="date-row">
        <div>{length > 0 ? (new Date(minRange).toLocaleDateString().split(',')[0]) || minRange.toLocaleString().split(',')[0] : ''}</div>
        <div>{length > 0 ? (new Date(maxRange).toLocaleDateString().split(',')[0]) || maxRange.toLocaleString().split(',')[0] : ''}</div>
      </div>
      <Range
        onChange={filterDate}
        min={minRange}
        max={maxRange}
        // value={[minRange + 10000000, maxRange - 10000000]}
        count={2}
        defaultValue={[minRange, maxRange]}
        allowCross={false}
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
