import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => (
  <div className="app">
    <p className="heading">Welcome to FOAMviz</p>
    <p className="heading">Please select a viz to proceed</p>
    <div>
      <ul>
        <li>
          <Link to="/vizpoianalytics">VizPOIAnalytics</Link>
        </li>
        <li>
          <Link to="/vizcartographerjourney">VizCartographerJourney</Link>
        </li>
      </ul>
    </div>
  </div>
);

export default HomePage;
