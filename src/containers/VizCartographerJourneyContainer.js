import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Loader from '../common-utils/components/Loader';

const VizCartographerJourney = lazy(() => import('../VizCartographerJourney'));

const renderLoader = () => <Loader />;

export default () => (
  <Suspense fallback={renderLoader()}>
    <Router>
      <Route
        exact
        path="/cartographer-journey"
        component={VizCartographerJourney}
      />
      <Route
        path="/cartographer-journey/:id"
        component={VizCartographerJourney}
      />
    </Router>
  </Suspense>
);
