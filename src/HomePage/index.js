import React from 'react';
import { Link } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import { Helmet } from 'react-helmet';

const useStyles = createUseStyles({
  root: {
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '8px',
    color: 'white',
  },
  subInfo: {
    color: '#d3d3d3',
  },
  link: {
    color: 'white',
  },
});

const HomePage = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Helmet>
        <title>FOAMViz Project</title>
      </Helmet>
      <h1>FOAMViz Project</h1>
      <p className={classes.subInfo}>
        Current visualizations to study FOAM's TCR data are live on the
        following links:
      </p>
      <div>
        <ul>
          <li>
            <Link to="/poi-analytics" className={classes.link}>
              Analytics around density of POI's
            </Link>
          </li>
          <li>
            <Link to="/cartographer-journey" className={classes.link}>
              Journey of a Cartographer
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
