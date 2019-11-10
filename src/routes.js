import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import HomePage from './HomePage';
import VizPOIAnalytics from './VizPOIAnalytics';
import VizCartographerJourney from './VizCartographerJourney';

export default () => (
  <Router>
    <Route exact path="/" component={HomePage} />
    <Route exact path="/vizpoianalytics" component={VizPOIAnalytics} />
    <Route exact path="/vizcartographerjourney" component={VizCartographerJourney} />
  </Router>
);
