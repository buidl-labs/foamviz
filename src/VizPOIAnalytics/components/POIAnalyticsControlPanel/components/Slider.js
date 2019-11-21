import React from 'react';

const Slider = ({
  settingName, value, controls, onChange,
}) => {
  const { max = 100 } = controls;
  return (
    <div key={settingName}>
      <div className="input-group">
        <div>
          <input
            className="slider"
            type="range"
            id={settingName}
            min={0}
            max={max}
            step={max / 100}
            value={value}
            onChange={(e) => onChange(settingName, Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default Slider;
