import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => (
  <div className="app">
    <p>Welcome to FOAMviz</p>
    <p>Please select a viz to proceed</p>
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
