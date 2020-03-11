/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef } from 'react';
import '../../index.css';
import { fetchLocationFromMapboxAPI } from '../../utils/helper';

const LocationSearchBox = ({ onLocationSelect = () => {} }) => {

  const [searchedPlaces, setSearchedPlace] = useState([]);
  const [curSelected, setCurrentKey] = useState(-1);
  const inputRef = useRef();

  const navigateMap = (place) => {
    setSearchedPlace([]);
    onLocationSelect(place.coordinates);
    inputRef.current.value = '';
  }

  const keyUp = (e) => {
    if(!e.target.value) {
      setSearchedPlace([]);
      return;
    }
  }

  const onSearch = async (e) => {
    const { target, keyCode, key } = e;
    if(!target.value) {
      setSearchedPlace([]);
      return;
    }

    if (keyCode ===  38 && key === "ArrowUp") {
      e.preventDefault();
      return setCurrentKey(Math.max(0, curSelected - 1));
    } else if (keyCode === 40) {
      return setCurrentKey(Math.min(searchedPlaces.length - 1, curSelected + 1));
    } else if (keyCode === 13) {
      return navigateMap(searchedPlaces[curSelected]);
    }

    const places = [];
    await fetchLocationFromMapboxAPI(target.value).then(result => result.forEach(p => {
      places.push({
        name: p.place_name,
        coordinates: p.geometry.coordinates,
      })})
    )
    .catch(e => console.log(e));
    setSearchedPlace(places);
  };

  return (
    <div className="searchBoxControl">
      <div className="container">
        <input
        className="location-input-box box-container"
        type="text"
        placeholder="Enter Location to Navigate"
        onKeyDown={onSearch}
        onKeyUp={keyUp}
        ref={inputRef}
        />
      </div>
      <div className="search-result-box">
        {
          searchedPlaces.map((place, key) => (
              <p
                key={key} className={key === curSelected ? "searchResults search-navigate": "searchResults"} onClick={() => navigateMap(place)}>{place.name}</p>
            )
          )
        }
      </div>
    </div>
  );
};

export default LocationSearchBox;
