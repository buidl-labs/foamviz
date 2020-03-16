import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

// Containers
import HomePageContainer from './containers/HomePageContainer';
import VizPOIAnalyticsContainer from './containers/VizPOIAnalyticsContainer';
import VizCartographerJourneyContainer from './containers/VizCartographerJourneyContainer';
import VizDataGlobeContainer from './containers/VizDataGlobeContainer';

const App = () => (
  <Router>
    <Route exact path="/" component={HomePageContainer} />
    <Route exact path="/poi-analytics" component={VizPOIAnalyticsContainer} />
    <Route
      exact
      path="/cartographer-journey"
      component={VizCartographerJourneyContainer}
    />
    <Route
      path="/cartographer-journey/:id"
      component={VizCartographerJourneyContainer}
    />
    <Route exact path="/data-globe" component={VizDataGlobeContainer} />
  </Router>
);

export default App;
