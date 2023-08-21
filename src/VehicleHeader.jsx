import React, { useState } from "react";
import crv from "./data/CR-V_trims.json";

const direction = [2, 4, 9];

const generateCarImageUrl = (
  view,
  model,
  exteriorColor,
  interiorColor,
  options,
  width = 1400
) => {
  const config = `M:${model}$EC:${exteriorColor}$HC:undefined$IC:${interiorColor}$O:${options.join(
    ","
  )}$F:FIFS$ECC:GC$ECX:`;
  return `https://automobiles.honda.com/platform/api/v4/images/exterior/${view}?config=${config}&width=${width}`;
};

function VehicleHeader() {
  const [trimLevel, setTrimLevel] = useState("LX");
  const [view, setView] = useState("02");
  const [exteriorColor, setExteriorColor] = useState("default");
  const [interiorColor, setInteriorColor] = useState("default");

  const changeView = (event) => {
    setView(event.target.value);
  };
  const changeTrimLevel = (event) => {
    setTrimLevel(event.target.value);
  };

  const changeExterior = (event) => {
    setExteriorColor(event.target.value);
  };
  const changeInterior = (event) => {
    setInteriorColor(event.target.value);
  };

  const model = "RS3H4RJW";
  const exteriorColorCode = "NH-904M";
  const interiorColorCode = "BK";
  const options = [
    // "CRV0024001", //
    // "CRV0024002", //
    // "CRV0024003", //
    // "CRV0024004", // Bike Attachment
    // "CRV0024005", // Body Side Molding
    // "CRV0024006", // Crossbars
    // "CRV0024007", //
    // "CRV0024008", // Door visors
    // "CRV0024009", // Ski/Snoboard Attachment
    // "CRV0024010",
    // "CRV0024011", //
    // "CRV0024012", // 18-INCH HPD™ BRONZE ALLOY WHEELS
    // "CRV0024013", //
    // "CRV0024014", // Front Lower Trim
    // "CRV0024015", // Roof Basket
    // "CRV0024016", //
    // "CRV0024017", //
    // "CRV0024018", //
    // "CRV0024019", // Lower Door Trim
    // "CRV0024020", // Splash guards
    // "CRV0024021", //
    // "CRV0024022", //
    // "CRV0024023", // Roof rails
    // "CRV0024024", // Running Boards
    // "CRV0024025",
    // "CRV0024026", //
    // "CRV0024027", //
    // "CRV0024028", //
    // "CRV0024029", //
    // "CRV0024030", //Black alloy wheels
    // "CRV0024031", //
    // "CRV0024032", //
    // "CRV0024033", // Fender Emblems
    // "CRV0024034", // Roof Box - Short
    // "CRV0024035", // Surfboard Attachment
    // "CRV0024036", //
    // "CRV0024037", //
    // "CRV0024038", //
    // "CRV0024039", //
    // "CRV0024040",
    // "CRV0024041", //
    // "CRV0024042", // Tailgate Spoiler
    // "CRV0024043", //
    // "CRV0024044", //
    // "CRV0024045",
    // "CRV0024046", //
    // "CRV0024047", //
    // "CRV0024048", //
    // "CRV0024049", // Fender Flares
    // "CRV0024050", // Hood air deflector
    // "CRV0024051", // Kayak Attachment
    // "CRV0024052", //
    // "CRV0024053", // - Moonroof Visor
    // "CRV0024054", //
    // "CRV0024055",
    // "CRV0024056", //
    // "CRV0024057", //
    // "CRV0024058", //
    // "CRV0024059", //
    // "CRV0024060",
    // "CRV0024061", //
    // "CRV0024062", //
    // "CRV0024063", //
    // "CRV0024064", //
    // "CRV0024065", //Crossbars
    // "CRV0024066", // Kayak attachment
    // "CRV0024067", // Ski/Snowboard Attachment
    // "CRV0024068", //
    // "CRV0024069", // Surfboard Attachment
    // "CRV0024070", // Bike Attachment
    // "CRV0024071", // Roof Basket
    // "CRV0024072", // Roof Box - Short
    // "CRV0024073", //
    // "CRV0024074", //
    // "CRV0024075",
    // "CRV0024076", //
    // "CRV0024077", //
    // "CRV0024078", //
    // "CRV0024079", //
    // "CRV0024080",
    // "CRV0024081", //
    // "CRV0024082", //
    // "CRV0024083", //
    // "CRV0024084", //
    // "CRV0024085",
    // "CRV0024086", //
    // "CRV0024087", //
    // "CRV0024088", //
    // "CRV0024089", //
    // "CRV0024090",
    // "CRV0024091", //
    // "CRV0024092", //
    // "CRV0024093", //
    // "CRV0024094", //
    // "CRV0024095",
    // "CRV0024096", //
    // "CRV0024097", //
    // "CRV0024098", //
    // "CRV0024099", //
  ];

  const imageUrl = generateCarImageUrl(
    view,
    model,
    exteriorColor,
    interiorColorCode,
    options
  );

  return (
    <div>
      <ImageWithBackup
        src={imageUrl}
        backupSrc="/vehicles/2024/cr-v/MY23-CR-V-trim-jelly-LX-canyon-blue-2x.avif"
        alt={`CR-V ${trimLevel} in ${exteriorColor}`}
      />
      <div>
        <label htmlFor="view">View: </label>
        <select id="view" onChange={changeView}>
          {[
            ["02", "Front"],
            ["04", "Side"],
            ["09", "Rear"],
          ].map(([code, label]) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
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
            <option key={i} value={color.exteriorCode}>
              {color.exteriorName} - {color.exteriorCode}
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

function ImageWithBackup({ src, backupSrc, alt }) {
  const [loadedSrc, setLoadedSrc] = React.useState(src);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setLoadedSrc(src);
      setLoading(false);
    };
  }, [src]);

  const handleError = (e) => {
    if (e.target.src !== backupSrc) {
      // Avoids looping if backupSrc also fails
      e.target.src = backupSrc;
    }
  };

  return (
    <img
      className={`fade-image ${loading ? "fade-out" : ""}`}
      src={src}
      alt={alt}
      onError={handleError}
    />
  );
}

export default VehicleHeader;
