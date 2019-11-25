/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';

import '../../index.css';
import { fetchLocationFromMapboxAPI } from '../../utils/helper';

const LocationSearchBox = () => {

  const [searchedPlaces, setSearchedPlace] = useState([]);

  const onSearch = async (e) => {
    const { value } = e.target;
    if(!value) {
      setSearchedPlace([]);
      return;
    }
    const places = [];
    await fetchLocationFromMapboxAPI(value).then(result => result.map(p =>
      places.push({
        name: p.place_name
      }))
    );
    setSearchedPlace(places);
  };

  const navigateMap = (place) => {
    console.log(place)
  }

  return (
    <div className="searchBoxControl">
      <div className="container">
        <input
        className="location-input-box box-container"
        type="text"
        placeholder="Enter Location to Navigate"
        onChange={onSearch}
        />
      </div>
      <div>
        {
          searchedPlaces.map((place, key) => (
              <p key={key} className="searchResults" onClick={navigateMap(place.name)}>{place.name}</p>
            )
          )
        }
      </div>
    </div>
  );
};

export default LocationSearchBox;
