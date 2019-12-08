import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { store } from '../global-store';
import fetchViz3Data from '../utils/helper';

import Card from './components/Card';
import './index.css';

import vizGlobeImage from '../assets/imgs/viz-globe.png';
import vizCartoJourneyImage from '../assets/imgs/viz-journey.png';
import vizPOIImage from '../assets/imgs/viz-poi.png';

const HomePage = () => {
  const classes = useStyles();
  useEffect(() => {
    console.log('state0');
    store.loading = true;
    fetchViz3Data().then((data) => {
      store.loading = false;
      localStorage.setItem('viz3data', JSON.stringify(data));
    });
  }, []);

  return (
    <div>
    <Helmet>
      <title>FOAMViz Project</title>
    </Helmet>
    <div className="head-container">
      <h1 className="main-title">foam-viz</h1>
      <h4 className="main-info">Data Visualization over FOAM's TCR data</h4>
    </div>
    <div className="body-container">
      <div className="card-container">
        <div>
        <Link to="/poi-analytics" className="card-link">
          <Card 
            imageSrc={vizPOIImage}
            title="POI Analytics"
            description="This visualization shows aggreagated POIs according to density or staked value"
          />
        </Link>
        </div>
        <div>
        <Link to="/cartographer-journey" className="card-link">
          <Card
            imageSrc={vizCartoJourneyImage}
            title="Cartographer's Journey"
            description="This visualization shows journey of a cartographer in terms of their plotting on the map"
          />
        </Link>
        </div>
        <div>
        <Link to="/data-globe" className="card-link">
          <Card 
            imageSrc={vizGlobeImage}
            title="Data Globe"
            description="This visualization shows all POIs since inception of FOAM on a globe for a bird eye's view"
          />
        </Link>
        </div>
      </div>
    </div>
  </div>
  );
};

export default HomePage;
