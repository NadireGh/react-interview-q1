import React, { useState, useEffect } from "react";
import { isNameValid, getLocations } from "./mock-api/apis";
import debounce from 'lodash.debounce';

const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [isNameAvailable, setIsNameAvailable] = useState(true);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [tableData, setTableData] = useState([]);

  // Fetch locations on component mount
  useEffect(() => {
    getLocations().then((locationOptions) => {
      setLocations(locationOptions);
      setSelectedLocation(locationOptions[0])
    });
  }, []);

  // Validate name using debounce as the user types
  const validateNameDebounced = debounce(async (newName) => {
    if (newName && selectedLocation) {
      const isValid = await isNameValid(newName);
      setIsNameAvailable(isValid);
    }
  }, 100);


  // Handle name change and perform validation
  const handleNameChange = async (event) => {
    const newName = event.target.value;
    setName(newName);

     // Validate name using debounce
     validateNameDebounced(newName);
  };

  // Handle location change
  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  // Handle ADD button click
  const handleAddClick = () => {
    if (isNameAvailable && name && selectedLocation) {
      setTableData([...tableData, { name, location: selectedLocation }]);
      // Clear inputs after adding to the table
      setName("");
      setSelectedLocation("");
      setIsNameAvailable(true);
    }
  };

  // Handle CLEAR button click
  const handleClearClick = () => {
    setTableData([]);
    setName("");
    setSelectedLocation(locations[0]);
    setIsNameAvailable(true);
  };

  return (
    <div className="registration-form">
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          className={isNameAvailable ? "valid" : "invalid"}
        />
      </label>
      {!isNameAvailable && (
        <p className="error-message">this name has already been taken</p>
      )}

      <label>
        Location:
        <select value={selectedLocation} onChange={handleLocationChange}>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </label>

      <div>
        <button onClick={handleClearClick}>Clear</button>
        <button onClick={handleAddClick}>Add</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data, index) => (
            <tr key={index}>
              <td>{data.name}</td>
              <td>{data.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegistrationForm;


