/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

// Components Imports
import Selector from './components/Selector';
import Slider from './components/Slider';
import Legend from './components/Legend';
import FoamNavbar from '../../../common-utils/components/FoamNavbar';

// Constant Imports
import { LEGEND_COLORS } from '../../utils/constants';

import '../../index.css';

const Setting = (props) => {
  const { controls } = props;
  if (controls && controls.type) {
    switch (controls.type) {
      case 'range':
        return <Slider {...props} />;
      case 'boolean':
        return <Selector {...props} />;
      default:
        return <input {...props} />;
    }
  }
};

const onValueChange = (settingName, newValue, props) => {
  const { settings, onChange } = props;
  if (settings[settingName] !== newValue) {
    const altsettingName = settingName === 'showDensityOfPoints'
      ? 'showStakedTokens'
      : 'showDensityOfPoints';
    const newSettings = {
      ...settings,
      [settingName]: newValue,
    };
    if (
      settingName === 'showDensityOfPoints'
      || settingName === 'showStakedTokens'
    ) {
      newSettings[altsettingName] = !newValue;
    }
    onChange(newSettings);
  }
};

const POIAnalyticsControlPanel = (props) => {
  const { settings, controls } = props;
  return (
    <div className="layercontrol">
      <FoamNavbar
        title="VizPOIAnalytics"
        info="Part of FOAMviz project"
      />
      <div className="control-panel-top">
        <p>SELECTED</p>
        <h2 className="m-top-10">
          {settings.showDensityOfPoints === true
            ? 'Density of Points'
            : 'Staked Tokens'}
        </h2>
        <p>OPTIONS</p>
        {Object.keys(settings).map(
          (key) => controls[key].type === 'boolean' && (
          <div key={key} className="dflex-sbtw cursor-pointer m-2">
            <div>
              <Setting
                settingName={key}
                value={settings[key]}
                controls={controls[key]}
                onChange={(p1, p2) => onValueChange(p1, p2, props)}
              />
            </div>
          </div>
          ),
        )}
      </div>
      <hr className="control-panel-divider" />
      <div className="control-panel-bottom">
        <p>CONTROL PANEL</p>
        {Object.keys(settings).map(
          (key) => controls[key].type === 'range' && (
          <div key={key} className="dflex-sbtw cursor-pointer m-2">
            <p className="m-0">{controls[key].displayName}</p>
            <div>
              <Setting
                settingName={key}
                value={settings[key]}
                controls={controls[key]}
                onChange={(p1, p2) => onValueChange(p1, p2, props)}
              />
            </div>
          </div>
          ),
        )}
        <Legend legendColors={LEGEND_COLORS} />
      </div>
    </div>
  );
};

export default POIAnalyticsControlPanel;
