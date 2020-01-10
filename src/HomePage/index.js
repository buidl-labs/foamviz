import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { store } from '../global-store';
import fetchViz3Data from '../utils/helper';
import { Box, Image, Flex } from '@chakra-ui/core';

import Card from './components/Card';
import './index.css';

import vizGlobeImage from '../assets/imgs/viz-globe.png';
import vizCartoJourneyImage from '../assets/imgs/viz-journey.png';
import vizPOIImage from '../assets/imgs/viz-poi.png';

const HomePage = () => {
  useEffect(() => {
    console.log('state0');
    store.loading = true;
    fetchViz3Data().then(data => {
      store.loading = false;
      localStorage.setItem('viz3data', JSON.stringify(data));
    });
  }, []);

  const vizes = [vizGlobeImage, vizCartoJourneyImage, vizPOIImage];

  return (
    <div>
      <Helmet>
        <title>FOAMViz Project</title>
      </Helmet>
      <div className="main">
        <div className="body-container">
          <img
            src="https://via.placeholder.com/150/0000FF/808080?Text=Digital.com"
            className="background"
          />
        </div>
        <div className="card-container">
          {vizes.map(v => (
            <Box as="span" px="4" py="4">
              <Image src={v} alt="img" />
            </Box>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
