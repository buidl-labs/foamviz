import React from 'react';

const Selector = ({ settingName, value, onChange }) => (
  <div key={settingName}>
    <div className="input-group">
      <button
        id={settingName}
        type="submit"
        className="look-like-link"
        value={settingName}
        style={{
          borderBottom: value ? '1px solid white' : null,
        }}
        onClick={() => onChange(settingName, !value)}
      >
        {settingName === 'showDensityOfPoints'
          ? 'Density of Points'
          : 'Staked Tokens'}
      </button>
    </div>
  </div>
);

export default Selector;
