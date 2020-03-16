import React, { lazy, Suspense } from 'react';
import Loader from '../common-utils/components/Loader';

const HomePage = lazy(() => import('../HomePage'));

const renderLoader = () => <Loader text="Please Wait" />;

export default () => (
    <Suspense fallback={renderLoader()}>
        <HomePage />
    </Suspense>
);
