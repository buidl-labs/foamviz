/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import * as CONSTANTS from './utils/constants';
import './index.css';

function _onValueChange(settingName, newValue, props) {
  const { settings, onChange } = props;
  if (settings[settingName] !== newValue) {
    const altsettingName =
      settingName === 'showDensityOfPoints'
        ? 'showStakedTokens'
        : 'showDensityOfPoints';
    const newSettings = {
      ...settings,
      [settingName]: newValue
    };
    if (
      settingName === 'showDensityOfPoints' ||
      settingName === 'showStakedTokens'
    ) {
      newSettings[altsettingName] = !newValue;
    }
    onChange(newSettings);
  }
}

function LayerControls(props) {
  const { settings, controls } = props;
  return (
    <div className="layercontrol">
      <div className="control-panel-top">
        <p>SELECTED</p>
        <h2 className="m-top-10">
          {settings.showDensityOfPoints === true
            ? 'Density of Points'
            : 'Staked Tokens'}
        </h2>
        <p>OPTIONS</p>
        {Object.keys(settings).map(
          key =>
            controls[key].type === 'boolean' && (
              <div key={key} className="dflex-sbtw cursor-pointer m-2">
                <div>
                  <Setting
                    settingName={key}
                    value={settings[key]}
                    controls={controls[key]}
                    onChange={(p1, p2) => _onValueChange(p1, p2, props)}
                  />
                </div>
              </div>
            )
        )}
      </div>
      <hr className="control-panel-divider" />
      <div className="control-panel-bottom">
        <p>CONTROL PANEL</p>
        {Object.keys(settings).map(
          key =>
            controls[key].type === 'range' && (
              <div key={key} className="dflex-sbtw cursor-pointer m-2">
                <p className="m-0">{controls[key].displayName}</p>
                <div>
                  <Setting
                    settingName={key}
                    value={settings[key]}
                    controls={controls[key]}
                    onChange={(p1, p2) => _onValueChange(p1, p2, props)}
                  />
                </div>
              </div>
            )
        )}
        <div className="layout">
          {CONSTANTS.legendColors.map(value => {
            return (
              <div
                key={value}
                className="legend"
                style={{ background: `${value}`, width: '16.6667%' }}
              />
            );
          })}
        </div>
        <p className="legend-text">
          <span>Low</span>
          <span>High</span>
        </p>
      </div>
    </div>
  );
}

function Setting(props) {
  const { controls } = props;
  if (controls && controls.type) {
    switch (controls.type) {
      case 'range':
        return <Slider {...props} />;
      case 'boolean':
        return <Checkbox {...props} />;
      default:
        return <input {...props} />;
    }
  }
}

const Checkbox = ({ settingName, value, onChange }) => {
  return (
    <div key={settingName}>
      <div className="input-group">
        <button
          id={settingName}
          type="submit"
          className="look-like-link"
          value={settingName}
          style={{
            borderBottom: value ? '1px solid white' : null
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
};

const Slider = ({ settingName, value, controls, onChange }) => {
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
            onChange={e => onChange(settingName, Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default LayerControls;
