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
import vizPOIImage from '../assets/imgs/viz-one.png';
import vizPOIWebP from '../assets/imgs/oneWebP.webp';
import vizPOIWebM from '../assets/gifs/a1.webm';
import vizPOIMp4 from '../assets/gifs/a2.mp4';

import vizCartoJourneyImage from '../assets/imgs/viz-journey.png';
import vizCartoJourneyWebP from '../assets/imgs/twoWebP.webp';
import vizCartoJourneyWebM from '../assets/gifs/b1.webm';
import vizCartoJourneyMp4 from '../assets/gifs/b2.mp4';

import vizGlobeImage from '../assets/imgs/viz-globe.png';
import vizGlobeWebP from '../assets/imgs/threeWebP.webp';
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
          <img alt="The Foamviz Project" src={mainTitle} />
          <img className={anime ? "home-arrow dm-none" : "home-arrow translateY dm-none"} alt="The Foamviz Project" src={arrow} />
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
            <div className="columns move-up">
              <div className="column is-4">
                <h1 className="title">
                  VizPOIAnalytics
                </h1>
                <h2 className="subtitle subinfo">
                  Shows aggreagated POIs according to density or staked value
                </h2>
              </div>
              <div className="column is-8 txt-ctr">
                <Link to="/poi-analytics" className="card-link">
                  <Card
                    imageSrc={vizPOIImage}
                    webpSrc={vizPOIWebP}
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
            <div className="columns move-up">
              <div className="column is-4">
                <h1 className="title">
                  VizCartoJourney
                </h1>
                <h2 className="subtitle subinfo">
                  Shows journey of a cartographer in terms of their plotting on the map
                </h2>
              </div>
              <div className="column is-8 txt-ctr">
                <Link to="/cartographer-journey" className="card-link">
                  <Card
                    imageSrc={vizCartoJourneyImage}
                    webpSrc={vizCartoJourneyWebP}
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
            <div className="columns move-up">
              <div className="column is-4">
                <h1 className="title">
                  VizDataGlobe
                </h1>
                <h2 className="subtitle subinfo">
                  Shows all POIs since inception of FOAM on a globe for a bird eye's view
                </h2>
              </div>
              <div className="column is-8 txt-ctr">
                <Link to="/data-globe" className="card-link">
                  <Card
                    imageSrc={vizGlobeImage}
                    webpSrc={vizGlobeWebP}
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
