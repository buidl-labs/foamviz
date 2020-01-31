import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { store } from '../global-store';
import fetchViz3Data from '../utils/helper';

import Card from './components/Card';
import './index.css';
import 'bulma/css/bulma.css';

// background cover
import neonWorldBG from '../assets/imgs/background.png';
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
  const [anime, setCount] = useState(true);
  useEffect(() => {
    store.loading = true;
    fetchViz3Data().then((data) => {
      store.loading = false;
      localStorage.setItem('viz3data', JSON.stringify(data));
    });
  }, []);
  setInterval(() => {
    setCount(!anime)
  }, 1000)

  return (
    <div className="home-page">
      <Helmet>
        <title>FOAMViz Project</title>
      </Helmet>
      <div className="head-container mb-7">
        <div className="main-title-container">
          <img alt="The FOAMViz Project" src={mainTitle} />
          <img className={anime ? "home-arrow dm-none" : "home-arrow translateY dm-none"} alt="The FOAMViz Project" src={arrow} />
        </div>
        <picture>
          <source sizes="100%" srcSet={neonWorldBGWebP} type="image/webp" />
          <source sizes="100%" srcSet={neonWorldBG} type="image/jpeg" />
          <img alt="bg" src={neonWorldBG} width="100%" height="100vh" />
        </picture>
      </div>
      <section className="hero is-success is-fullheight bg-one">
        <div className="hero-body">
          <div className="container">
            <div className="columns move-up is-desktop">
              <div className="column is-5">
                <div className="make-it-center">
                  <h1 className="viz-title">
                    Analyze <br /> POI Activity by <br /> density
                  </h1>
                  <br />
                  <h2 className="subtitle subinfo">
                  For the curious lot amongst the FOAM users this interactive tool will help answer the following questions: <br />
                  <br /> 1. What are the low-density and high-density areas near me? Around the planet? 
                  <br /> 2. What is the distribution of staked POI’s across these points? 
                  <br /> 3. Do low-density areas have higher staked value of FOAM tokens?
                  </h2>
                </div>
              </div>
              <div className="column is-7 txt-ctr">
                <Link to="/poi-analytics" className="card-link">
                  <Card
                    mp4Src={vizPOIMp4}
                    webmSrc={vizPOIWebM}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="hero is-info is-fullheight bg-two">
        <div className="hero-body">
          <div className="container">
            <div className="columns move-up is-desktop">
              <div className="column is-5">
                <div className="make-it-center">
                  <h1 className="viz-title">
                  Visualize <br /> Cartographer’s <br /> Journey
                  </h1>
                  <br />
                  <h2 className="subtitle subinfo">
                  Cartographers are an integral part of the FOAM ecosystem. This interactive tool allows you to view their journey in a time machine manner.
                  <br /> <br />Whiz through their journey flying through various countries and plotting points. 
                  <br />Find out the attributes of places the cartographer is most passionate about.
                  <br />Or just sit back and hit play watching a small simulation of their journey!
                  </h2>
                </div>
              </div>
              <div className="column is-7 txt-ctr">
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
            <div className="columns move-up is-desktop">
              <div className="column is-5">
                <div className="make-it-center">
                  <h1 className="viz-title">
                  Visualize <br /> evolution of <br /> FOAM Ecosystem <br /> on planetary scale
                  </h1>
                  <br />
                  <h2 className="subtitle subinfo">
                  This interactive tool will provide an overview of the amount staked in POI’s all over the globe from the inception of FOAM to now. 
                  <br /> <br /> Questions that will help FOAM users answer: 
                  <br /> <br /> 1. Which geography has the most activity? 
                  <br /> 2. Staking patterns across geography?
                  </h2>
                </div>
              </div>
              <div className="column is-7 txt-ctr">
                <Link to="/data-globe" className="card-link">
                  <Card
                    mp4Src={vizGlobeMp4}
                    webmSrc={vizGlobeWebM}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
