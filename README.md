# FOAMViz

> A suit of open source visualization tools over FOAM TCR's data to analyze ecosystem activity on [FOAM's map](https://foam.space/).

This project is deployed live at [https://foamviz.surge.sh](https://foamviz.surge.sh)

## Table of contents
- [About FOAMViz project](#about)
  - [What is FOAMViz?](#what)
  - [Why FOAMViz?](#why)
- [Our three visualizations](#three_viz)
  - [Statistics around POI's](#viz_one)
  - [Cartographer's Journey](#viz_two)
  - [Evolution of FOAM on planetary scale](#viz_three)
- [Running the project locally](#run_locally)
- [⛏️ Built Using](#built_using)
- [✍️ Authors](#authors)

## About FOAMViz project <a name = "about"></a>

###  What is FOAMViz? <a name = "what"></a>

FOAM’s Spatial Index & Visualizer has become a fascinating playground for people collaboratively coming to consensus around location data in a decentralized fashion.

This project focuses on the visualization of FOAM TCR’s data by providing visualization tools and experiments that let’s the community view the data in a more visual way.

###  Why FOAMViz? <a name = "why"></a>

The blockchain and crypto ecosystem is already as complex for an average joe to understand. And when the user can’t visualize how things work, they can’t really wrap their heads around the concept.

Because of the way the human brain processes information, using charts or graphs to visualize large amounts of complex data is easier than poring over raw numbers. Data visualization is a quick, easy way to convey concepts in a universal manner.

These tools + visualizations would help all users - including power users - to go through the data in a more visual way than currently possible.

## Our three visualizations  <a name = "three_viz"></a>

Repo constains these three visualizations

- Statistics around POI's
- Cartographer's Journey
- Evolution of FOAM on planetary scale

###  Statistics around POI's <a name = "viz_one"></a>

![image](https://user-images.githubusercontent.com/32517802/77971908-9d5b5900-730d-11ea-9d7e-e8915ba13ed4.png)

For the curious lot amongst the FOAM users [this interactive tool](https://foamviz.surge.sh/#/poi-analytics) will help answer the following questions:

- What are the low-density and high-density areas near me? Around the planet?
- What is the distribution of staked POI’s across these points?
- Do low-density areas have higher staked value of FOAM tokens?

###  Cartographer's Journey <a name = "viz_two"></a>

![image](https://user-images.githubusercontent.com/32517802/77971849-6e44e780-730d-11ea-8705-8ffaba0d6a1d.png)

Cartographers are an integral part of the FOAM ecosystem. [This interactive tool](https://foamviz.surge.sh/#/cartographer-journey) allows you to view their journey in a time machine manner.

- Whiz through their journey flying through various countries and plotting points.
- Find out the attributes of places the cartographer is most passionate about.
- Or just sit back and hit play watching a small simulation of their journey!

###  Evolution of FOAM on planetary scale <a name = "viz_three"></a>

![image](https://user-images.githubusercontent.com/32517802/77971633-d34c0d80-730c-11ea-9cfc-cf5c067caa34.png)

[This interactive tool](https://dev.foamviz.surge.sh/#/data-globe) will provide an overview of the amount staked in POI’s all over the globe from the inception of FOAM to now.

Questions that will help FOAM users answer:

- Which geography has the most activity?
- Staking patterns across geography?

##  Steps to run the project locally in development mode are: <a name = "run_locally"></a>

1. Fork and clone the repository in your system and navigate to the project directory.
2. Setup an ```.env``` file in root of the project with ```REACT_APP_MAPBOX_ACCESS_TOKEN``` and provide your mapbox token.
3. Install all the project dependencies using ```npm install``` command.
4. Run ```npm start``` to start the local server. Open ```http://localhost:3000``` to view the project in the browser.

## ⛏️ Built Using <a name = "built_using"></a>

-   [React JS](https://reactjs.org/) - A JavaScript library for building user interfaces
-   [Deck GL](https://deck.gl/) - Large scale WebGL-powered data visualization
-   [Mapbox GL JS](https://www.mapbox.com/) - A JavaScript library that uses WebGL to render interactive maps
-   [FOAM APIs](https://f-o-a-m.github.io/foam.developer/index.html) - Official APIs built on [FOAM's map](https://foam.space/)
-   [Blocklytics FOAM API](https://docs.blocklytics.org/apis/foam-map-api) - APIs built for [FOAM tools](https://foam.tools/)
-   [React Globe GL](https://vasturiano.github.io/react-globe.gl/) - Globe Data Visualization using ThreeJS/WebGL
-   [Surge](https://surge.sh/) - CLI for web publishing

## ✍️ Authors <a name = "authors"></a>

-   [@prastut](https://github.com/prastut/)
-   [@dhruv10](https://github.com/dhruv10)