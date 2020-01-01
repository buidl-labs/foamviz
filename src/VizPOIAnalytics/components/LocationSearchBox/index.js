/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef } from 'react';
import '../../index.css';
import { fetchLocationFromMapboxAPI } from '../../utils/helper';

const LocationSearchBox = ({ onLocationSelect = () => {} }) => {

  const [searchedPlaces, setSearchedPlace] = useState([]);
  const inputRef = useRef();

  const onSearch = async (e) => {
    const { value } = e.target;
    if(!value) {
      setSearchedPlace([]);
      return;
    }
    const places = [];
    await fetchLocationFromMapboxAPI(value).then(result => result.forEach(p => {
      places.push({
        name: p.place_name,
        coordinates: p.geometry.coordinates,
      })})
    )
    .catch(e => console.log(e));
    setSearchedPlace(places);
  };

  const navigateMap = (place) => {
    setSearchedPlace([]);
    onLocationSelect(place.coordinates);
    inputRef.current.value = '';
  }

  return (
    <div className="searchBoxControl">
      <div className="container">
        <input
        className="location-input-box box-container"
        type="text"
        placeholder="Enter Location to Navigate"
        onChange={onSearch}
        ref={inputRef}
        />
      </div>
      <div className="search-result-box">
        {
          searchedPlaces.map((place, key) => (
              <p
                key={key} className="searchResults" onClick={() => navigateMap(place)}>{place.name}</p>
            )
          )
        }
      </div>
    </div>
  );
};

export default LocationSearchBox;
