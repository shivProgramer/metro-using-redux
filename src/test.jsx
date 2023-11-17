import React, { useState, useEffect } from "react";
import jaipurJsonData from "./JsonData";

function MetroRouteFinder() {
  // State variables to store input values and result stations
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");

  const [startStationRouteId, setStartStationRouteId] = useState(null);
  const [startStation_id, setStartStationSno] = useState(null);
  const [endStationRouteId, setEndStationRouteId] = useState(null);
  const [endStation_id, setEndStationSno] = useState(null);

 const [betweenStation, setbetweenStation] = useState(null);

  const handleFromChange = (e) => {
    setFromStation(e.target.value);
  };

  const handleToChange = (e) => {
    setToStation(e.target.value);
  };
  useEffect(() => {
    jaipurJsonData.forEach((stationData) => {
      if (stationData.station_Name === fromStation) {
        setStartStationRouteId(stationData.route_ID);
        setStartStationSno(stationData.station_ID);
      }

      if (stationData.station_Name === toStation) {
        setEndStationRouteId(stationData.route_ID);
        setEndStationSno(stationData.station_ID);
      }
    });
  }, [fromStation, toStation]);

       const handleGetValue = () => {
         if(startStationRouteId === endStationRouteId){
            
           }
        };


  return (
    <>
      <div>
        <label>From:</label>
        <select onChange={handleFromChange}>
          <option value={"--Select--"}>{"--Select--"}</option>
          {jaipurJsonData.map((item, index) => (
            <option key={index} value={item?.station_Name}>
              {item?.station_Name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>To:</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <select onChange={handleToChange}>
          <option value="Select">--Select--</option>
          {jaipurJsonData.map((item, index) => (
            <option key={index} value={item?.station_Name}>
              {item?.station_Name}
            </option>
          ))}
        </select>{" "}
        {"  "}
        <button onClick={handleGetValue}>Get value</button>
      </div>
    </>
  );
}

export default MetroRouteFinder;
