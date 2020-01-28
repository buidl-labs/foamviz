import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { store } from '../global-store';
import fetchViz3Data from '../utils/helper';
// import AOS from 'aos';
// import 'aos/dist/aos.css';

import Card from './components/Card';
import './index.css';

import vizGlobeImage from '../assets/imgs/viz-globe.png';
import vizGlobeGIF from '../assets/gifs/three.gif';
import vizCartoJourneyImage from '../assets/imgs/viz-journey.png';
import vizCartoJourneyGif from '../assets/gifs/two.gif';
import vizPOIImage from '../assets/imgs/viz-one.png';
import vizPOIGif from '../assets/gifs/one.gif';
import neonWorldBG from '../assets/imgs/background.png';
import neonWorldBGWebP from '../assets/imgs/backgroundWebP.webp';

const HomePage = () => {
  useEffect(() => {
    // AOS.init();
    store.loading = true;
    fetchViz3Data().then((data) => {
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
          <p className="above-main-title">THE</p>
          <p className="main-title">FOAMVIZ</p>
          <p className="below-main-title">PROJECT</p>
        </div>
        {/* <img alt="bg" src={neonWorldBG} width="100%" height="100vh" /> */}
        <picture>
          <source sizes="100%" srcSet={neonWorldBGWebP} type="image/webp" />
          <source sizes="100%" srcSet={neonWorldBG} type="image/jpeg" />
          <img alt="bg" src={neonWorldBG} width="100%" height="100vh" />
        </picture>
      </div>
      <section className="hero is-success is-fullheight bg-one">
        <div className="hero-body">
          <div className="container">
            <div className="columns move-up">
              <div className="column is-4">
                <h1 className="title">
        VizPOIAnalytics
                </h1>
                <h2 className="subtitle subinfo">
                Shows aggreagated POIs according to density or staked value
                </h2>
              </div>
              <div className="column is-8">
                <Link to="/poi-analytics" className="card-link">
                  <Card
                    imageSrc={vizPOIImage}
                    gifSrc={vizPOIGif}
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
            <div className="columns move-up">
              <div className="column is-4">
                <h1 className="title">
        VizCartoJourney
                </h1>
                <h2 className="subtitle subinfo">
                Shows journey of a cartographer in terms of their plotting on the map
                </h2>
              </div>
              <div className="column is-8">
                <Link to="/cartographer-journey" className="card-link">
                  <Card
                    imageSrc={vizCartoJourneyImage}
                    gifSrc={vizCartoJourneyGif}
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
            <div className="columns move-up">
              <div className="column is-4">
                <h1 className="title">
        VizDataGlobe
                </h1>
                <h2 className="subtitle subinfo">
                Shows all POIs since inception of FOAM on a globe for a bird eye's view
                </h2>
              </div>
              <div className="column is-8">
                <Link to="/data-globe" className="card-link">
                  <Card
                    imageSrc={vizGlobeImage}
                    gifSrc={vizGlobeGIF}
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
