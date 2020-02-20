import React from 'react';
import CountUp from 'react-countup';
import Slider from 'rc-slider';
import FoamNavbar from '../../common-utils/components/FoamNavbar';

export default ({
  display, stakedValue, USDRate, pastValue, toggleRotate, updateResolution, arrowUp,
}) => {
  if (!display) return null;

  const [resolution, setResolution] = React.useState(4);

  return (
    <div>
      <div className="analytics-panel abs-container-top m-abs-container-top">
        <FoamNavbar
          title="VizDataGlobe"
          info="Part of FOAMViz project"
          arrowUp={arrowUp}
        />
        <div className="main-container-top m-main-container-top">
          <div className="dm-none">
            <CountUp
              delay={0}
              preserveValue
              end={stakedValue}
              duration={1}
              decimals={2}
              formattingFn={(value) => (value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))}
            >
              {({ countUpRef }) => (<p className="mt-0 fs-22 count-bottom-num" ref={countUpRef} />)}
            </CountUp>
            <p className="fs-14 tooltip-key count-bottom">Total FOAM tokens staked on the planet</p>
            <CountUp
              delay={0}
              preserveValue
              end={Number(stakedValue * USDRate).toFixed(2)}
              duration={1}
              decimals={2}
              formattingFn={(value) => (`$ ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`)}
            >
              {({ countUpRef }) => (<p className="fs-22 count-bottom-num mt-2" ref={countUpRef} />)}
            </CountUp>
            <p className="md-1 fs-14 tooltip-key count-bottom">Net value of FOAM tokens staked</p>
          </div>
          <div className="rotation-container">
            <div className="rotation">Rotation:</div>
            <div>
              <label className="switch">
                <input type="checkbox" onChange={toggleRotate} />
                <span className="rotation-slider round" />
              </label>
            </div>
          </div>
          <div className="m-dflex m-mtop2">
            <div className="rotation">Granularity:</div>
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
      </div>
    </div>
  );
};
