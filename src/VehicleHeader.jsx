import React, { useState } from "react";
import crv from "./data/CR-V_trims.json";

function VehicleHeader() {
  const [trimLevel, setTrimLevel] = useState("LX");
  const [exteriorColor, setExteriorColor] = useState("default");
  const [interiorColor, setInteriorColor] = useState("default");

  const changeTrimLevel = (event) => {
    setTrimLevel(event.target.value);
  };

  const changeExterior = (event) => {
    setExteriorColor(event.target.value);
  };
  const changeInterior = (event) => {
    setInteriorColor(event.target.value);
  };


  
  return (
    <div>
      <img
        src="/vehicles/2024/cr-v/MY23-CR-V-trim-jelly-LX-canyon-blue-2x.avif"
        alt={`CR-V ${trimLevel} in ${exteriorColor}`}
      />
      <div>
        <label htmlFor="trim-level">Trim: </label>
        <select id="trim-level" onChange={changeTrimLevel}>
          {Object.keys(crv).map((trim) => (
            <option key={trim} value={trim}>
              {trim}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="exterior">Exterior: </label>
        <select id="exterior" onChange={changeExterior}>
          {crv?.[trimLevel]?.colorOptions.map((color, i) => (
            <option key={i} value={i}>
              {color.exteriorName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="interior">Interior: </label>
        <select id="interior" onChange={changeExterior}>
          {crv?.[trimLevel]?.colorOptions?.[exteriorColor]?.interior.map(
            (interior) => (
              <option key={interior.name} value={interior.name}>
                {interior.name} {interior.type}
              </option>
            )
          )}
        </select>
      </div>
    </div>
  );
}

export default VehicleHeader;
