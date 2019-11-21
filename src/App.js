import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Pages
import HomePage from './HomePage';
import VizPOIAnalytics from './VizPOIAnalytics';
import VizCartographerJourney from './VizCartographerJourney';

const App = () => (
  <Router>
    <Route exact path="/" component={HomePage} />
    <Route exact path="/poi-analytics" component={VizPOIAnalytics} />
    <Route
      exact
      path="/cartographer-journey"
      component={VizCartographerJourney}
    />
    <Route
      exact
      path="/cartographer-journey/:id"
      component={VizCartographerJourney}
    />
  </Router>
);

export default App;
