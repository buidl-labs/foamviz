import React, { Component } from "react";
import { layerControl } from "./style";
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

export class LayerControls extends Component {
  _onValueChange(settingName, newValue) {
    const { settings } = this.props;
    // Only update if we have a confirmed change

    if (settings[settingName] !== newValue) {
      // Create a new object so that shallow-equal detects a change
      const altsettingName =
        settingName === "showDensityOfPoints"
          ? "showStakedTokens"
          : "showDensityOfPoints";

      const newSettings = {
        ...this.props.settings,
        [settingName]: newValue
      };

      if (
        settingName === "showDensityOfPoints" ||
        settingName === "showStakedTokens"
      ) {
        newSettings[altsettingName] = !newValue;
      }

      this.props.onChange(newSettings);
    }
  }

  render() {
    const { settings, propTypes = {} } = this.props;

    return (
      <div className="layer-controls" style={layerControl}>
        <div style={{ margin: "20px 20px 0 20px" }}>
          <p>SELECTED</p>
          <h2 style={{ marginTop: "-10px" }}>
            {settings.showDensityOfPoints === true
              ? "Density of Points"
              : "Staked Tokens"}
          </h2>
          <p>OPTIONS</p>
          {Object.keys(settings).map(
            key =>
              propTypes[key].type === "boolean" && (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    cursor: "pointer",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "2px"
                  }}
                >
                  {/* <label>{propTypes[key].displayName}</label> */}
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
              propTypes[key].type === "range" && (
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
          <div className="layout">
            <div
              className="legend"
              style={{ background: "rgb(1, 152, 189)", width: "16.6667%" }}
            ></div>
            <div
              className="legend"
              style={{ background: "rgb(73, 227, 206)", width: "16.6667%" }}
            ></div>
            <div
              className="legend"
              style={{ background: "rgb(216, 254, 181)", width: "16.6667%" }}
            ></div>
            <div
              className="legend"
              style={{ background: "rgb(254, 237, 177)", width: "16.6667%" }}
            ></div>
            <div
              className="legend"
              style={{ background: "rgb(254, 173, 84)", width: "16.6667%" }}
            ></div>
            <div
              className="legend"
              style={{ background: "rgb(209, 55, 78)", width: "16.6667%" }}
            ></div>
          </div>
          <p className="legend-text">
            <span>Low</span>
            <span>High</span>
          </p>
          {/* <div style={{ marginBottom: "250px" }}></div> */}
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
        <a
          id={settingName}
          type="submit"
          value={settingName}
          style={{
            borderBottom: value ? "1px solid white" : null
          }}
          onClick={() => onChange(settingName, !value)}
        >
          {settingName === "showDensityOfPoints"
            ? "Density of Points"
            : "Staked Tokens"}
        </a>
      </div>
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
