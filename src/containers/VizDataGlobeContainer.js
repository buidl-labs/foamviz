import React, { lazy, Suspense } from 'react';
import Loader from '../common-utils/components/Loader';

const VizDataGlobe = lazy(() => import('../VizDataGlobe'));

const renderLoader = () => <Loader />;

export default () => (
    <Suspense fallback={renderLoader()}>
        <VizDataGlobe />
    </Suspense>
);
