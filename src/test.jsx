import React, { useState } from "react";
import jaipurJsonData from "./JsonData";
function MetroRouteFinder() {
  // State variables to store input values and result stations
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [resultStations, setResultStations] = useState([]);
  // Event handler for 'From' input change
  const handleFromChange = (e) => {
    setFromStation(e.target.value);
  };
  // Event handler for 'To' input change
  const handleToChange = (e) => {
    setToStation(e.target.value);
  };
  // Function to check if Sno values are in increasing order
  const isIncreasingOrder = (start, end) => start < end;
  // Function to sort stations based on Sno values and order
  const getSortedStations = (stations, isIncreasing) => {
    return isIncreasing
      ? stations.sort((a, b) => a.sno - b.sno)
      : stations.sort((a, b) => b.sno - a.sno);
  };
  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Find indices of 'From' and 'To' stations in the data
    const fromIndex = jaipurJsonData.findIndex(
      (station) => station.station_Name === fromStation
    );
    const toIndex = jaipurJsonData.findIndex(
      (station) => station.station_Name === toStation
    );

    // Check if both 'From' and 'To' stations are found
    if (fromIndex !== -1 && toIndex !== -1) {
      // Get Sno values for 'From' and 'To' stations
      const startSno = jaipurJsonData[fromIndex].sno;
      const endSno = jaipurJsonData[toIndex].sno;
      // Determine if Sno values are in increasing order
      const increasingOrder = isIncreasingOrder(startSno, endSno);
      // Filter stations based on Sno values and create a list of JSX elements
      const stationsBetween = jaipurJsonData
        .filter((station) => {
          if (increasingOrder) {
            return station.sno >= startSno && station.sno <= endSno;
          } else {
            return station.sno <= startSno && station.sno >= endSno;
          }
        })
        .map((station, index, array) => {
          // Sort the stations based on Sno values
          const sortedStations = getSortedStations(
            array,
            isIncreasingOrder(startSno, endSno)
          );
          // Check for junction stations and insert a 'Route Change' message
          if (
            index > 0 &&
            index < array.length - 1 &&
            station.isJunction === "Yes"
          ) {
            return (
              <React.Fragment key={index}>
                <li>
                  <strong>Route Change Here</strong>
                </li>
                {sortedStations.map((sortedStation) => (
                  <li key={sortedStation.sno}>{sortedStation.station_Name}</li>
                ))}
              </React.Fragment>  
            );
          } else {
            return <li key={station.sno}>
                  {station.station_Name}
              </li>;
          }
        });
      // Update state with the result stations
      setResultStations(stationsBetween);
    } else {
      // If 'From' or 'To' stations are not found, reset the result stations
      setResultStations([]);
    }
  };
  // JSX structure for the component
  return (
    <div>
      {/* Form for user input and submission */}
      <form onSubmit={handleSubmit}>
        <label>
          From:
          <input type="text" value={fromStation} onChange={handleFromChange} />
        </label>
        <label>
          To:
          <input type="text" value={toStation} onChange={handleToChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {/* Display result stations if available */}
      {resultStations.length > 0 && (
        <div>
          <h2>
            Stations between {fromStation} and {toStation}:
          </h2>
          <ul>{resultStations}</ul>
        </div>
      )}
    </div>
  );
}

export default MetroRouteFinder;
