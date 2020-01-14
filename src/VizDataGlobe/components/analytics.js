import React from 'react';
import CountUp from 'react-countup';
import Slider from 'rc-slider';
import FoamNavbar from '../../common-utils/components/FoamNavbar';

export default ({
  display, stakedValue, USDRate, pastValue, toggleRotate, updateResolution,
}) => {
  if (!display) return null;

  const [resolution, setResolution] = React.useState(4);

  return (
    <div className="analytics-panel abs-container-top ">
      <FoamNavbar
        title="VizDataGlobe"
        info="Part of FOAMviz project"
      />
      <div className="main-container-top">
        <CountUp
          delay={0}
          preserveValue
          end={stakedValue}
          duration={1}
          decimals={2}
          formattingFn={(value) => (value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))}
        >
          {({ countUpRef }) => (<h1 className="mt-0" ref={countUpRef} />)}
        </CountUp>
        <h2>FOAM Tokens Staked</h2>
        <CountUp
          delay={0}
          preserveValue
          end={Number(stakedValue * USDRate).toFixed(2)}
          duration={1}
          decimals={2}
          formattingFn={(value) => (`$ ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`)}
        >
          {({ countUpRef }) => (<h1 ref={countUpRef} />)}
        </CountUp>
        <h2>Net Value Staked</h2>
        <p className="viz-description">This globe represents an aggregate of all points from FOAMs inception till now</p>
        <div className="rotation-container">
          <div className="rotation">Rotation:</div>
          <div>
            <label className="switch">
              <input type="checkbox" onChange={toggleRotate} />
              <span className="rotation-slider round" />
            </label>
          </div>
        </div>
        <div className="rotation" style={{ marginTop: 28 }}>Hex Resolution:</div>
        <br />
        <Slider
          min={2}
          max={7}
          step={1}
          dots
          value={resolution}
          onChange={(r) => {
            setResolution(r);
            updateResolution(r);
          }}
        />
      </div>
    </div>
  );
};
