import React, { lazy, Suspense } from 'react';
import Loader from '../common-utils/components/Loader';

const VizDataGlobe = lazy(() => import('../VizDataGlobe'));

const renderLoader = () => <Loader text="Please wait, while we are fetching your data..." />;

export default () => (
    <Suspense fallback={renderLoader()}>
        <VizDataGlobe />
    </Suspense>
);
