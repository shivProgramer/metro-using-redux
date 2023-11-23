{
    if (fromStation !== null && toStation !== null) {
      debugger
      const fromStationIndex = jaipurJsonData.findIndex((item) =>
        item.station_Name.toLowerCase() === fromStation.toLowerCase()
      );
    
      const toStationIndex = jaipurJsonData.findIndex((item) =>
        item.station_Name.toLowerCase() === toStation.toLowerCase()
      );
    
      if (fromStationIndex !== -1 && toStationIndex !== -1 && fromStationIndex < toStationIndex) {
        const stationsBetween = jaipurJsonData.slice(fromStationIndex + 1, toStationIndex);
        console.log("Stations between", fromStation, "and", toStation, ":", stationsBetween);
      } else {
        console.log("Invalid station names or order.");
      }
    } else {
      console.log("Please provide both fromStation and toStation.");
    }
    
    let IsJunStation;
      if (
        startStationRouteId !== null &&
        endStationRouteId !== null &&
        startStationRouteId !== endStationRouteId
      ){
       
       for(let i of jaipurJsonData){
        if(i.isJunction === "Yes"){
          IsJunStation = i
          console.log(" isJunction Find", i.station_Name);
          console.log(" IsJunStation", IsJunStation);
        }
       }
      } 
  }