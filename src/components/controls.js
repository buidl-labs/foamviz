import React, { Component } from "react";
import { mapStylePicker, layerControl } from "./style";
import "./Home.css";

export const HEXAGON_CONTROLS = {
  showDensityOfPoints: {
    displayName: "Density of Points",
    type: "boolean",
    value: true
  },
  showStakedTokens: {
    displayName: "Staked Tokens",
    type: "boolean",
    value: false
  },
  radius: {
    displayName: "Radius",
    type: "range",
    value: 250,
    step: 50,
    min: 50,
    max: 1000
  },
  coverage: {
    displayName: "Coverage",
    type: "range",
    value: 0.7,
    step: 0.1,
    min: 0,
    max: 1
  },
  upperPercentile: {
    displayName: "Upper Percentile",
    type: "range",
    value: 100,
    step: 0.1,
    min: 80,
    max: 100
  }
};

const MAPBOX_DEFAULT_MAPSTYLES = [
  { label: "Streets V10", value: "mapbox://styles/mapbox/streets-v10" },
  { label: "Outdoors V10", value: "mapbox://styles/mapbox/outdoors-v10" },
  { label: "Light V9", value: "mapbox://styles/mapbox/light-v9" },
  { label: "Dark V9", value: "mapbox://styles/mapbox/dark-v9" },
  { label: "Satellite V9", value: "mapbox://styles/mapbox/satellite-v9" },
  {
    label: "Satellite Streets V10",
    value: "mapbox://styles/mapbox/satellite-streets-v10"
  },
  {
    label: "Navigation Preview Day V4",
    value: "mapbox://styles/mapbox/navigation-preview-day-v4"
  },
  {
    label: "Navitation Preview Night V4",
    value: "mapbox://styles/mapbox/navigation-preview-night-v4"
  },
  {
    label: "Navigation Guidance Day V4",
    value: "mapbox://styles/mapbox/navigation-guidance-day-v4"
  },
  {
    label: "Navigation Guidance Night V4",
    value: "mapbox://styles/mapbox/navigation-guidance-night-v4"
  }
];

export function MapStylePicker({ currentStyle, onStyleChange }) {
  return (
    <select
      className="map-style-picker"
      style={mapStylePicker}
      value={currentStyle}
      onChange={e => onStyleChange(e.target.value)}
    >
      {MAPBOX_DEFAULT_MAPSTYLES.map(style => (
        <option key={style.value} value={style.value}>
          {style.label}
        </option>
      ))}
    </select>
  );
}

export class LayerControls extends Component {
  _onValueChange(settingName, newValue) {
    const { settings } = this.props;
    // Only update if we have a confirmed change
    if (settings[settingName] !== newValue) {
      // Create a new object so that shallow-equal detects a change
      const newSettings = {
        ...this.props.settings,
        [settingName]: newValue
      };

      this.props.onChange(newSettings);
    }
  }

  render() {
    const { title, settings, propTypes = {} } = this.props;

    return (
      <div className="layer-controls" style={layerControl}>
        <div style={{ margin: "20px 20px 0 20px" }}>
          <p>SELECTED</p>
          <h2 style={{ marginTop: "-10px" }}>Density of Points</h2>
          <p>OPTIONS</p>
          {title && <h4>{title}</h4>}
          {Object.keys(settings).map(
            key =>
              propTypes[key].type == "boolean" && (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "2px"
                  }}
                >
                  <label>{propTypes[key].displayName}</label>
                  <div>
                    <Setting
                      settingName={key}
                      value={settings[key]}
                      propType={propTypes[key]}
                      onChange={this._onValueChange.bind(this)}
                    />
                  </div>
                </div>
              )
          )}
        </div>
        <hr className="control-panel-divider" />
        <div style={{ margin: "0 20px 20px 20px" }}>
          <p>CONTROL PANEL</p>
          {Object.keys(settings).map(
            key =>
              propTypes[key].type == "range" && (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "2px"
                  }}
                >
                  <label>{propTypes[key].displayName}</label>
                  <div>
                    <Setting
                      settingName={key}
                      value={settings[key]}
                      propType={propTypes[key]}
                      onChange={this._onValueChange.bind(this)}
                    />
                  </div>
                </div>
              )
          )}
          <div style={{ marginBottom: "250px" }}></div>
        </div>
      </div>
    );
  }
}

const Setting = props => {
  const { propType } = props;
  if (propType && propType.type) {
    switch (propType.type) {
      case "range":
        return <Slider {...props} />;
      case "boolean":
        return <Checkbox {...props} />;
      default:
        return <input {...props} />;
    }
  }
};

const Checkbox = ({ settingName, value, onChange }) => {
  return (
    <div key={settingName}>
      <div className="input-group">
        {/* <button
          id={settingName}
          value={value}
          onClick={e => onClick}
        >
          {settingName}
        </button> */}
        <input
          type="checkbox"
          id={settingName}
          checked={value}
          onChange={e => onChange(settingName, e.target.checked)}
        />
      </div>
      {console.log("settingname and value: ", settingName, value)}
    </div>
  );
};

const Slider = ({ settingName, value, propType, onChange }) => {
  const { max = 100 } = propType;

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
