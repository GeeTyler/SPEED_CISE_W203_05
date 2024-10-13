"use client"

import React from 'react';
import Intro from './_components/intro';
import LatestArticles from './_components/LatestArticles';

const HomePage: React.FC = () => {
    return (
        <div>
            <Intro />
            <LatestArticles />
        </div>
    );
};

export default HomePage;