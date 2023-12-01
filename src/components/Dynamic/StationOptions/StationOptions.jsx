import React, { useEffect, useState } from "react";
import MetroCard from "../Merto_card/MetroCard";
import { Link, NavLink } from "react-router-dom";
import Loader from "../../Static/Loader/Loader";
import { useParams } from "react-router-dom";
import HomeLoader from "../../Static/Loader/HomeLoader";
import { _getThemeColor } from "../../../config/Config";
import "./StationOptions.css";
import { useDispatch, useSelector } from "react-redux";
import {
  AllStationOfMasterStation,
  stationBetween,
} from "../../../slices/StationSlice";
import { getFare } from "../../../slices/FareSlice";
import { configureStore } from "@reduxjs/toolkit";

const StationOptions = () => {
  const { id, from, to } = useParams();
  const dispatch = useDispatch();
  const [stationOption, setStationOption] = useState({
    From: "",
    To: "",
  });
  const [show, SetShow] = useState(false);
  const [ParamFromStation, setParamFromStation] = useState();
  const [ParamToStation, setParamToStation] = useState();
  const [themColors, setThemColors] = useState(null);
  const [Start_Route_id, setStart_Route_id] = useState(null);
  const [Start_Station_id, setStart_Station_id] = useState(null);
  const [Start_Station_Sno, setStart_Station_Sno] = useState(null);

  const [End_Route_id, setEnd_Route_id] = useState(null);
  const [End_Station_id, setEnd_Station_id] = useState(null);
  const [End_Station_Sno, setEnd_Station_Sno] = useState(null);
  const [SortBetweenData, setSortBetweenData] = useState([]);
  const [RouteChangeMessage, setRouteChangeMessage] = useState(null);

  // ------ get data from redux (start) ------------>
  const fareloading = useSelector((state) => state.fare.loading);
  const Fare = useSelector((state) => state.fare.fare);
  const stationBetweenValue = useSelector(
    (state) => state.station.StationBetween
  );
  const allstatonOfMaster = useSelector(
    (state) => state.station.AllStationMstr
  );

  // console.log("stationBetween", stationBetweenValue);
  // -----------(end)-------------------------------->
  // -------- get color ---------------
  useEffect(() => {
    const themeClr = async () => {
      const themeColor = await _getThemeColor();
      setThemColors(themeColor);
    };
    themeClr();
  }, []);

  /* -------- Call GetAllData ---------------------------------------------------*/
  useEffect(() => {
    from && GetAllData();
  }, [from, to]);

  /* --------getfare call funtion  ---------------------------------------------------*/
  const fareValue = async (from, to) => {
    const fare = dispatch(getFare({ from, to }));
  };
  /* -------- station between  call funtion  ---------------------------------------------------*/
  const stationBitween = async (from, to) => {
    const bitween = dispatch(stationBetween({ from, to }));
  };

  //  -------- call AllStationOfMasterStation method  -----------

  useEffect(() => {
    dispatch(AllStationOfMasterStation(id));
  }, []);

  useEffect(() => {
    // debugger
    if (
      (allstatonOfMaster && allstatonOfMaster !== null) ||
      (allstatonOfMaster && allstatonOfMaster.length !== 0)
    ) {
      if (stationOption.From && stationOption.To) {
        allstatonOfMaster.forEach((item) => {
          if (item.station_Name === stationOption.From) {
            const statrRoute_id = item.route_ID;
            const statrStation_id = item.station_ID;
            const statrSno = item.sno;
            setStart_Route_id(statrRoute_id);
            setStart_Station_id(statrStation_id);
            setStart_Station_Sno(statrSno);
            // console.log("statrRoute_id",statrRoute_id)
          }
          if (item.station_Name === stationOption.To) {
            const endRoute_id = item.route_ID;
            const endStation_id = item.station_ID;
            const endSno = item.sno;

            setEnd_Route_id(endRoute_id);
            setEnd_Station_id(endStation_id);
            setEnd_Station_Sno(endSno);
            // console.log("endRoute_id",endRoute_id)
          }
        });
      } else {
        console.log(" The 'From' and 'To' values are not found!");
      }
    }
  }, [stationOption.From, stationOption.To]);

  let StationVal = [];
  const handleGetValue = () => {
    // debugger
    if (allstatonOfMaster !== null || allstatonOfMaster.length !== 0) {
      if (
        Start_Route_id !== null &&
        End_Route_id !== null &&
        Start_Route_id === End_Route_id
      ) {
        // console.log("Start_Route_id",Start_Route_id);
        // console.log("End_Route_id",End_Route_id);

        allstatonOfMaster.forEach((station) => {
          if (
            station.sno >= Start_Station_Sno &&
            station.sno <= End_Station_Sno
          ) {
            StationVal.push(station.station_Name);
            setSortBetweenData(StationVal);
          } else if (
            station.sno <= Start_Station_Sno &&
            station.sno >= End_Station_Sno
          ) {
            StationVal.push(station.station_Name);
            // ---------- Sort in descending order based on the index ------------
            setSortBetweenData(
              StationVal.sort(
                (a, b) =>
                  allstatonOfMaster.findIndex(
                    (item) => item.station_Name === b
                  ) -
                  allstatonOfMaster.findIndex((item) => item.station_Name === a)
              )
            );
            // ------------ end sort ----------------------
          }
        });
      } else {
        // debugger

        if (
          Start_Route_id !== null &&
          End_Route_id !== null &&
          Start_Route_id !== End_Route_id
        ) {
          let isJunctionSno = null;
          allstatonOfMaster &&
            allstatonOfMaster.forEach((station) => {
              if (station && station.isJunction === "Yes") {
                if (isJunctionSno === null || station.sno < isJunctionSno) {
                  isJunctionSno = station.sno;
                }
              }
            });
          allstatonOfMaster &&
            allstatonOfMaster.forEach((station) => {
              if (station.sno <= isJunctionSno) {
                // console.log(station.station_Name);
                StationVal.push(station.station_Name);
                setSortBetweenData(StationVal);
              }
            });
          const RouteChange = (
            <p style={{ color: "yellow" }}> Here is Route Change </p>
          );
          setRouteChangeMessage(RouteChange);
          StationVal.push(RouteChange);

          console.log("allstatonOfMaster", allstatonOfMaster);
          allstatonOfMaster &&
            allstatonOfMaster.forEach((station) => {
              // debugger
              if (
                station.sno > isJunctionSno &&
                station.sno <= End_Station_Sno &&
                station.route_ID === End_Route_id
              ) {
                console.log("station name ", station.station_Name);
                StationVal.push(station.station_Name);
                setSortBetweenData(StationVal);
              }
            });
        }
      }
    }
  };

  //**********************   end  ********************************

  const GetAllData = () => {
    const cleanFromStation = from
      ? from.replace(/-/g, " ").replace(/ /g, " ")
      : null;
    const cleanToStation = to ? to.replace(/-/g, " ").replace(/ /g, " ") : null;
    const splitcleanToStation = cleanToStation.split("metro station")[0];
    setParamFromStation(cleanFromStation);
    setParamToStation(splitcleanToStation);
    fareValue(cleanFromStation, splitcleanToStation);
    stationBitween(cleanFromStation, splitcleanToStation);
    SetShow(true);
  };

  /* -------- For from Station ---------------------------------------------------*/
  const handleStationChange = (e) => {
    const newStationValue = e.target.value;
    setStationOption((prev) => ({
      ...prev,
      From: newStationValue,
    }));
  };
  /* -------- For to Station ---------------------------------------------------*/
  const handleToChange = (e) => {
    const newToValue = e.target.value;
    setStationOption((prev) => ({
      ...prev,
      To: newToValue,
    }));
  };
  const getStationName = JSON.parse(localStorage.getItem("Station_Name")).name;

  if (allstatonOfMaster === null || allstatonOfMaster.length === 0) {
    return <HomeLoader />;
  }
  return (
    <>
      <div className="container">
        {/* ---------------- Metro Station Select option ---------------------------------------------------*/}
        <div className="row justify-content-center m-0 Rounded-Border-Box">
          <div
            className={`col-md-6 col-10 Fare-Cal`}
            style={{
              background: `linear-gradient(to right, ${
                themColors ? themColors : "initial"
              }, #2d2d47)`,
            }}
          >
            <div>
              <label>From:</label>

              <select
                onChange={handleStationChange}
                style={{
                  background: `linear-gradient(to right, ${
                    themColors ? themColors : "initial"
                  }, #2d2d47)`,
                }}
              >
                <option value={ParamFromStation || ""}>
                  {ParamFromStation || "--Select--"}
                </option>
                {allstatonOfMaster.map((item, index) => {
                  return (
                    <option key={index} value={item?.station_Name}>
                      {item?.station_Name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label>To:</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <select
                onChange={handleToChange}
                style={{
                  background: `linear-gradient(to right, ${
                    themColors ? themColors : "initial"
                  }, #2d2d47)`,
                }}
              >
                <option value={ParamToStation || ""}>
                  {ParamToStation || "--Select--"}
                </option>
                {allstatonOfMaster.map((item, index) => {
                  return (
                    <option key={index} value={item?.station_Name}>
                      {item?.station_Name}
                    </option>
                  );
                })}
                ;
              </select>
            </div>

            <Link
              to={`/metroStation/${id}/from-${encodeURIComponent(
                stationOption.From
              ).replace(/%20/g, "-")}/to-${encodeURIComponent(
                stationOption.To
              ).replace(/%20/g, "-")}-metro-station-${encodeURIComponent(
                getStationName
              ).replace(/%20/g, "-")}`}
              className="btn btn-outline-danger float-end text-warning"
              onClick={handleGetValue}
            >
              Get Fare
            </Link>
          </div>
        </div>
        <br />
        {/*--------------------------------------------------------------------------------------------------- */}
        {/* -------------------- Metro Stations Details ------------------------------------------------------*/}

        <div className="Rounded-Border">
          {fareloading ? (
            <Loader />
          ) : (
            <section className={show ? "details_show" : "details_hide"}>
              <div className="container">
                <div className="row justify-content-center  pt-4 px-3 ">
                  <div
                    className="Fare-Cal"
                    style={{
                      background: `linear-gradient(to right, ${
                        themColors ? themColors : "initial"
                      }, #2d2d47)`,
                    }}
                  >
                    <div className="col-md-12 col-12 ">
                      <div className="row">
                        <div className="col-6 text-white text-center">
                          <h6>Start Station</h6>
                          <p className="m-0">
                            <i className="bi bi-train-front"></i>&nbsp;
                            {Fare[0]?.start_Station}
                          </p>
                        </div>

                        <div className="col-6 text-white text-center">
                          <h6>End Station</h6>
                          <p className="m-0">
                            <i className="bi bi-train-front"></i>&nbsp;
                            {Fare[0]?.end_Station}
                          </p>
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-6 text-white text-center">
                          <h6>Travel Time</h6>
                          <p className="m-0">
                            <i className="bi bi-alarm-fill"></i>&nbsp;
                            {Fare[0]?.travel_Time}
                          </p>
                        </div>

                        <div className="col-6 text-white text-center">
                          <h6>Token Fare</h6>
                          <p className="m-0">
                            ₹&nbsp;
                            {Fare[0]?.fare_Value}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row justify-content-center mt-4 px-3">
                  <div
                    className="Fare-Cal"
                    style={{
                      background: `linear-gradient(to right, ${
                        themColors ? themColors : "initial"
                      }, #2D2D47)`,
                    }}
                  >
                    {/* station summary from accounding to route id */}

                    <div className="col-12 col-md-12">
                      <div className="text-center mt-2 px-5">
                        <h3>Station Summary</h3>
                        <hr />
                      </div>
                      <div className="d-flex justify-content-center align-items-center p-2">
                        <div className="col-md-2 col-2">
                          {/* route start symbol image */}
                          <div className="d-flex justify-content-center">
                             (
                              <i
                                className="bi bi-train-front"
                                style={{
                                  background: "green",
                                  padding: 5,
                                  borderRadius: "100%",
                                }}
                              ></i>
                            ) 
                          </div>

                          {/* route image */}
                          {SortBetweenData.map((items, index) => {
                            return (
                              <div
                                key={index}
                                className="d-flex justify-content-center"
                              >
                                <img
                                  src="/Images/railroad.png"
                                  height="41px"
                                  alt="track"
                                  style={{ filter: "invert(1)" }}
                                />
                              </div>
                            );
                          })}
                          {/* route end symbol icon */}
                          <div className="d-flex justify-content-center">
                           { <i
                              className="bi bi-train-front"
                              style={{
                                background: "red",
                                padding: 5,
                                borderRadius: "100%",
                              }}
                            ></i>}
                          </div>
                        </div>
                        {/* all station from start to end  */}
                        <div className=" col-md-6 col-9">
                          {SortBetweenData.map((items, index) => {
                            return (
                              <h6 className="p-2 text-white" key={index}>
                                {RouteChangeMessage &&
                                RouteChangeMessage ? null : (
                                  <i className="bi bi-train-front"></i>
                                )}
                                &nbsp;&nbsp;
                                <NavLink to={`/details/${items.station_Code}`}>
                                  <span
                                    onClick={() =>
                                      console.log(
                                        "station_code",
                                        items.station_Code
                                      )
                                    }
                                  >
                                    {items}
                                  </span>
                                </NavLink>
                              </h6>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
          {/* ---------------------------------------------------------------------------------------------- */}
          <MetroCard />
        </div>
      </div>
    </>
  );
};

export default StationOptions;
