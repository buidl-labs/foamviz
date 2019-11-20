import React from 'react';
import { Link } from 'react-router-dom';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  root: {
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '8px',
  },
});

const HomePage = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <h1>FOAMViz Project</h1>
      <p>
        Current visualizations to study FOAM's TCR data are live on the
        following links:
      </p>
      <div>
        <ul>
          <li>
            <Link to="/poi-analytics">Analytics around density of POI's</Link>
          </li>
          <li>
            <Link to="/cartographer-journey">Journey of a Cartographer</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
