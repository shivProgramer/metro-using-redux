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

  const [betweenStation, setbetweenStation] = useState([]);

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
  let StationVal = [];

  const handleGetValue = () => {
    if (
      startStationRouteId !== null &&
      endStationRouteId !== null &&
      startStationRouteId === endStationRouteId
    ) {
      const allstation = jaipurJsonData.map((station) => {
        if (
          station.station_ID >= startStation_id &&
          station.station_ID <= endStation_id
        ) {
          console.log(" station.station_ID", station.station_ID);
          console.log(
            "startStation_id endStation_id",
            startStation_id,
            endStation_id
          );
          StationVal.push(station.station_Name);
          setbetweenStation(StationVal);
        } else if (
          station.station_ID <= startStation_id &&
          station.station_ID >= endStation_id
        ) {
          StationVal.push(station.station_Name);
          // Sort in descending order based on the index
          setbetweenStation(
            StationVal.sort(
              (a, b) =>
                jaipurJsonData.findIndex((item) => item.station_Name === b) -
                jaipurJsonData.findIndex((item) => item.station_Name === a)
            )
          );
        }
      });
    } else {
      alert(" Route Change Here ");
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

      <div>
        <h2 id="heading" className="ms-3">
          {`Station between ${fromStation} and ${toStation}`}
        </h2>
        {betweenStation.map((stBetween, index) => (
          <>
            <li className="ms-5" key={index}>
              {stBetween}
            </li>
          </>
        ))}
      </div>
    </>
  );
}

export default MetroRouteFinder;
