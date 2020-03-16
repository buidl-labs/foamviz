import React, { lazy, Suspense } from 'react';
import Loader from '../common-utils/components/Loader';

const VizCartographerJourney = lazy(() => import('../VizCartographerJourney'));

const renderLoader = () => <Loader text="Please Wait" />;

export default () => (
    <Suspense fallback={renderLoader()}>
        <VizCartographerJourney />
    </Suspense>
);
