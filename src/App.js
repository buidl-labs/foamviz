import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { ThemeProvider } from '@chakra-ui/core';

// Pages
import HomePage from './HomePage';
import VizPOIAnalytics from './VizPOIAnalytics';
import VizCartographerJourney from './VizCartographerJourney';
import VizDataGlobe from './VizDataGlobe';

const App = () => (
  <ThemeProvider>
    <Router>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/poi-analytics" component={VizPOIAnalytics} />
      <Route
        exact
        path="/cartographer-journey"
        component={VizCartographerJourney}
      />
      <Route
        path="/cartographer-journey/:id"
        component={VizCartographerJourney}
      />
      <Route exact path="/data-globe" component={VizDataGlobe} />
    </Router>
  </ThemeProvider>
);

export default App;
