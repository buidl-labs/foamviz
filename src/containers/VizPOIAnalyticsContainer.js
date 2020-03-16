import React, { lazy, Suspense } from 'react';
import Loader from '../common-utils/components/Loader';

const VizPOIAnalytics = lazy(() => import('../VizPOIAnalytics'));

const renderLoader = () => <Loader text="Please Wait" />;

export default () => (
    <Suspense fallback={renderLoader()}>
        <VizPOIAnalytics />
    </Suspense>
);
