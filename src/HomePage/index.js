import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { store } from '../global-store';
import fetchViz3Data from '../utils/helper';
import Img from 'react-image';

import Card from './components/Card';
import './index.css';
import 'bulma/css/bulma.css';

// background cover
import neonWorldBG from '../assets/imgs/background.png';
import neonWorldBlur from '../assets/imgs/background_blur.jpg';
import neonWorldBGWebP from '../assets/imgs/backgroundWebP.webp';
import mainTitle from '../assets/imgs/mainlogo2.svg';
import arrow from '../assets/imgs/down-arrow.svg';

// viz images and movies
import vizPOIWebM from '../assets/gifs/a1.webm';
import vizPOIMp4 from '../assets/gifs/a2.mp4';

import vizCartoJourneyWebM from '../assets/gifs/b1.webm';
import vizCartoJourneyMp4 from '../assets/gifs/b2.mp4';

import vizGlobeWebM from '../assets/gifs/c1.webm';
import vizGlobeMp4 from '../assets/gifs/c2.mp4';

const HomePage = () => {
  useEffect(() => {
    store.loading = true;
    fetchViz3Data().then(data => {
      store.loading = false;
      localStorage.setItem('viz3data', JSON.stringify(data));
    });
  }, []);

  return (
    <div className="home-page">
      <Helmet>
        <title>FOAMViz Project</title>
      </Helmet>
      <div className="head-container mb-7">
        <div className="main-title-container">
          <Img loader={<p className="card-link viz-title">The FOAMViz Project</p>} src={[mainTitle]} />
          <img
            className="home-arrow dm-none"
            alt="The FOAMViz Project"
            src={arrow}
          />
        </div>
        <Img
          container={children => {
            return <div className="transition fadeIn">{children}</div>;
          }}
          src={[neonWorldBGWebP, neonWorldBG]}
          loader={<img alt="bg" src={neonWorldBlur} width="100%" />}
        />
      </div>
      <section className="hero bg-about">
        <div className="centralised">
          <h1 className="viz-title">
            About FOAMViz Project:
            </h1>
          <br />
          <p className="subinfo">
            A suit of
            <a rel="noopener noreferrer" target="_blank" className="underline-link" href="https://github.com/buidl-labs/foamviz">
              open source</a> visualization tools over FOAM TCR's data to analyze ecosystem activity on 
              <a rel="noopener noreferrer" target="_blank" className="underline-link" href="https://foam.space">
              FOAM's map
            </a>.
            </p>
        </div>
      </section>
      <section className="hero is-success is-fullheight bg-one">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-desktop">
              <div className="column is-5">
                <div className="make-it-center">
                  <h1 className="viz-title">
                    <Link to="/poi-analytics" className="card-link">
                      Analyze <br /> POI Activity by <br /> density
                    </Link>
                  </h1>
                  <br />
                  <h2 className="subtitle subinfo">
                    For the curious lot amongst the FOAM users this interactive
                    tool will help answer the following questions: <br />
                    <br />
                    <ul>
                      <li>
                        What are the low-density and high-density areas near me?
                        Around the planet?
                      </li>
                      <li>
                        What is the distribution of staked POI’s across these
                        points?
                      </li>
                      <li>
                        Do low-density areas have higher staked value of FOAM
                        tokens?
                      </li>
                    </ul>
                  </h2>
                </div>
              </div>
              <div className="column is-6 txt-ctr">
                <Link to="/poi-analytics" className="card-link">
                  <Card mp4Src={vizPOIMp4} webmSrc={vizPOIWebM} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="hero is-info is-fullheight bg-two">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-desktop">
              <div className="column is-5">
                <div className="make-it-center">
                  <h1 className="viz-title">
                    <Link to="/cartographer-journey" className="card-link">
                      Visualize <br /> Cartographer’s <br /> Journey
                    </Link>
                  </h1>
                  <br />
                  <h2 className="subtitle subinfo">
                    Cartographers are an integral part of the FOAM ecosystem.
                    This interactive tool allows you to view their journey in a
                    time machine manner.
                    <br /> <br />
                    <ul>
                      <li>
                        Whiz through their journey flying through various
                        countries and plotting points.
                      </li>
                      <li>
                        Find out the attributes of places the cartographer is
                        most passionate about.
                      </li>
                      <li>
                        {' '}
                        Or just sit back and hit play watching a small
                        simulation of their journey!
                      </li>
                    </ul>
                  </h2>
                </div>
              </div>
              <div className="column is-6 txt-ctr">
                <Link to="/cartographer-journey" className="card-link">
                  <Card
                    mp4Src={vizCartoJourneyMp4}
                    webmSrc={vizCartoJourneyWebM}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="hero is-link is-fullheight bg-three">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-desktop">
              <div className="column is-5">
                <div className="make-it-center">
                  <h1 className="viz-title">
                    <Link to="/data-globe" className="card-link">
                      Visualize <br /> evolution of <br /> FOAM Ecosystem <br />{' '}
                      on planetary scale
                    </Link>
                  </h1>
                  <br />
                  <h2 className="subtitle subinfo">
                    This interactive tool will provide an overview of the amount
                    staked in POI’s all over the globe from the inception of
                    FOAM to now.
                    <br /> <br /> Questions that will help FOAM users answer:{' '}
                    <br /> <br />
                    <ul>
                      <li>Which geography has the most activity?</li>
                      <li>Staking patterns across geography?</li>
                    </ul>
                  </h2>
                </div>
              </div>
              <div className="column is-6 txt-ctr">
                <Link to="/data-globe" className="card-link">
                  <Card mp4Src={vizGlobeMp4} webmSrc={vizGlobeWebM} />
                </Link>
              </div>
            </div>
            <p className="buidl-labs-signature">
              Made with <span style={{ color: 'orangered' }}>&hearts;</span> by team <a target="_blank" rel="noopener noreferrer" href="http://buidllabs.io/" className="card-link">@BUIDL Labs</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
