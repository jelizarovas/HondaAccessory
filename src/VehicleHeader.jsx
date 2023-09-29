import React, { useState } from "react";
import { ImageProccessor } from "./ImageProccessor";
import { GetPdfButton } from "./GetPdfButton";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import useFetchJSON from "./useFetchJSON";

const direction = [2, 4, 9];

const generateCarImageUrl = (view, model, exteriorColor, interiorColor, options, width = 1400) => {
  const config = `M:${model}$EC:${exteriorColor}$HC:undefined$IC:${interiorColor}$O:${options.join(
    ","
  )}$F:FIFS$ECC:GC$ECX:`;
  return `https://automobiles.honda.com/platform/api/v4/images/exterior/${view}?config=${config}&width=${width}`;
};

function VehicleHeader({
  vehicle,
  trimLevel,
  setTrimLevel,
  exteriorColor = "B-640M",
  setExteriorColor,
  accessoriesData,
  selectedAccessories,
  totalPrice,
  availableTrims,
}) {
  const [view, setView] = useState("02");
  const [interiorColor, setInteriorColor] = useState("BK");

  const { data: colors, loading, error } = useFetchJSON("vehicles/2024/cr-v/colors.json");
  const changeView = (event) => {
    setView(event.target.value);
  };

  const cycleView = () => {
    const currentIndex = views.findIndex(([code, _]) => code === view);
    const nextIndex = (currentIndex + 1) % views.length;
    setView(views[nextIndex][0]);
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
    ...Object.keys(selectedAccessories),
    // "CRV0024001", //
    // "CRV0024002", //
    // "CRV0024003", //
    // "CRV0024004", // Bike Attachment
    // "CRV0024005", // Body Side Molding
    // "CRV0024006", // Crossbars
    // "CRV0024007", //
    // "CRV0024008", // Door visors
    // "CRV0024009", // Ski/Snoboard Attachment
    // "CRV0024010", //
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
    // "CRV0024025",//
    // "CRV0024026", //
    // "CRV0024027", //
    // "CRV0024028", //
    // "CRV0024029", //
    // "CRV0024030", // Black alloy wheels
    // "CRV0024031", //
    // "CRV0024032", // Emblem - HPD
    // "CRV0024033", // Fender Emblems
    // "CRV0024034", // Roof Box - Short
    // "CRV0024035", // Surfboard Attachment
    // "CRV0024036", // Trailer Hitch
    // "CRV0024037", //
    // "CRV0024038", //
    // "CRV0024039", //
    // "CRV0024040", // Emblems, Rear H-Mark and CR-V - Gloss Black
    // "CRV0024041", //
    // "CRV0024042", // Tailgate Spoiler
    // "CRV0024043", //
    // "CRV0024044", //
    // "CRV0024045",//
    // "CRV0024046", //
    // "CRV0024047", //
    // "CRV0024048", //
    // "CRV0024049", // Fender Flares
    // "CRV0024050", // Hood air deflector
    // "CRV0024051", // Kayak Attachment
    // "CRV0024052", //
    // "CRV0024053", // - Moonroof Visor
    // "CRV0024054", //
    // "CRV0024055",//
    // "CRV0024056", // Emblem, SPort - Gloss Black
    // "CRV0024057", //
    // "CRV0024058", //
    // "CRV0024059", //
    // "CRV0024060",//
    // "CRV0024061", //
    // "CRV0024062", // Black Emblems Touring
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
    // "CRV0024075",//
    // "CRV0024076", //
    // "CRV0024077", //
    // "CRV0024078", //
    // "CRV0024079", //
    // "CRV0024080",//
    // "CRV0024081", //
    // "CRV0024082", //
    // "CRV0024083", //
    // "CRV0024084", //
    // "CRV0024085",//
    // "CRV0024086", //Wheel Lug Nuts Set, Black (20 qty)
    // "CRV0024087", //Wheel Lock Nut Chrome
    // "CRV0024088", //Wheel Lock Nut Black
    // "CRV0024089", //Valve Stem Cap H-Mark, Chrome
    // "CRV0024090", //Valve Stem Cap H-Mark, Black
    // "CRV0024091", //Trailer Hitch HFA Adapter (Touring)
    // "CRV0024092", //Trailer Hitch HFA Adapter (Touring)
    // "CRV0024093", //Trailer Hitch Ball - 2-in
    // "CRV0024094", //Trailer Hitch Ball - 1 7/8-in
    // "CRV0024095", //Tent
    // "CRV0024096", //Decal Graphics, HPD
    // "CRV0024097", //Door Handle Protection Film
    // "CRV0024098", //Door Edge Guard
    // "CRV0024099", //Door Edge Film
  ];
  const imageUrl = generateCarImageUrl(view, trimLevel.split(",")[1], exteriorColor, interiorColorCode, options);

  const views = [
    ["02", "Front"],
    ["04", "Side"],
    ["09", "Rear"],
  ];
  return (
    <div className="relative flex flex-col lg:h-screen max-h-screen w-full">
      <div className="flex-grow lg:w-full">
        <ImageWithBackup
          // key={imageUrl}
          src={imageUrl}
          backupSrc="/vehicles/2024/cr-v/MY23-CR-V-trim-jelly-LX-canyon-blue-2x.avif"
          alt={`CR-V ${trimLevel} in ${exteriorColor}`}
        />
      </div>
      <div className="absolute  w-full flex justify-between items-center lg:text-2xl">
        <div className="flex items-center px-6  space-x-6 lg:py-4 uppercase ">
          <TitleDropDown label={"2024"} />
          <TitleDropDown label={"CR-V"} />
          <TitleDropDown label={"AWD"} />
          {/* <TitleDropDown label={trimLevel} /> */}
          <select onChange={changeTrimLevel}>
            {availableTrims.map((trim, i) => (
              <option key={i} value={trim}>
                {trim[0]}
              </option>
            ))}
          </select>
        </div>
        <GetPdfButton
          totalPrice={totalPrice}
          accessoriesData={accessoriesData}
          selectedAccessories={selectedAccessories}
          pdfName="pdfs/CR-V2024-form.pdf"
        />
      </div>
      <div className="absolute bottom-0 w-full">
        <div className=" flex justify-between lg:px-10 lg:py-4 pb-4 px-2 text-xs max-w-full overflow-x-auto">
          <div id="view" className="hidden space-x-2 px-2 lg:flex">
            {views.map(([code, label]) => (
              <button
                className={`${view === code ? "bg-indigo-100" : "bg-slate-100"} px-4 py-2 rounded-lg`}
                key={code}
                value={code}
                onClick={changeView}
              >
                {label}
              </button>
            ))}
          </div>
          <button className={`lg:hidden block bg-indigo-100 px-4 py-1  rounded-lg`} onClick={cycleView}>
            {views.find(([code, _]) => code === view)[1]} {">>"}
          </button>
          <div>
            {/* <label htmlFor="exterior">Exterior: </label> */}
            <select className="px-4 py-1 rounded-lg bg-slate-100 truncate" id="exterior" onChange={changeExterior}>
              {vehicle?.[trimLevel.split(",")[0]]?.colorOptions.map((color, i) => {
                const [exteriorId, interiorIds] = Object.entries(color)[0];

                return (
                  <option
                    key={i}
                    value={colors?.exterior?.[exteriorId]?.code}
                    style={{ backgroundColor: colors?.exterior?.[exteriorId]?.hex }}
                    className="truncate"
                  >
                    {colors?.exterior?.[exteriorId]?.name}
                  </option>
                );
              })}
            </select>
          </div>
          {/* <label htmlFor="trim-level">Trim: </label>
          <select id="trim-level" onChange={changeTrimLevel}>
            {Object.keys(crv).map((trim) => (
              <option key={trim} value={trim}>
                {trim}
              </option>
            ))}
          </select> */}
        </div>

        {/* <div>
          <label htmlFor="interior">Interior: </label>
          <select id="interior" onChange={changeInterior}>
            {crv?.[trimLevel]?.colorOptions?.[exteriorColor]?.interior.map(
              (interior) => (
                <option key={interior.name} value={interior.name}>
                  {interior.name} {interior.type}
                </option>
              )
            )}
          </select>
        </div> */}
      </div>
    </div>
  );
}

function ImageWithBackup({ src, backupSrc, alt }) {
  const transformWrapperRef = React.useRef(null);

  React.useEffect(() => {
    const handleResize = () => {
      if (transformWrapperRef.current) {
        const { setTransform } = transformWrapperRef.current;
        setTransform(0, 0, 1, 0, 0);
        // zoomTo(0, 0, 1);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [srcs, setSrcs] = useState([src]);

  React.useEffect(() => {
    setSrcs((srcArray) => [src, ...srcArray]);
  }, [src]);

  return (
    <TransformWrapper className="fullSizeProd w-full h-full" ref={transformWrapperRef} centerOnInit={true}>
      {/* <div className="relative bg-lime-400 h-full w-full"> */}
      <TransformComponent wrapperClass="fullSizeProd w-full h-full" contentClass="fullSizeProd w-full h-full">
        {/* <div className="relative lg:h-full flex items-center justify-center h-full "> */}
        {/* <img src={src} alt={alt} className="" /> */}
        <img src={src} alt={alt} className="lg:object-fit object-contain transition-all lg:h-full " />
        {/* </div> */}
      </TransformComponent>
      {/* </div> */}
    </TransformWrapper>
  );
}

// function ImageWithBackup({ src, backupSrc, alt }) {
//   const [loadedSrc, setLoadedSrc] = React.useState(src);
//   const [loading, setLoading] = React.useState(false);

//   React.useEffect(() => {
//     setLoading(true);
//     const img = new Image();
//     img.src = src;
//     img.onload = () => {
//       setLoadedSrc(src);
//       setLoading(false);
//     };
//   }, [src]);

//   const handleError = (e) => {
//     if (e.target.src !== backupSrc) {
//       // Avoids looping if backupSrc also fails
//       e.target.src = backupSrc;
//     }
//   };

//   return (
//     // <div
//     //   className="h-full w-full "
//     //   style={{
//     //     backgroundImage: `url(${src})`,
//     //     backgroundPosition: "center",
//     //     backgroundRepeat: "no-repeat" /* prevents the image from repeating */,
//     //     backgroundSize: "cover",
//     //   }}
//     // ></div>
//     <img
//       className={`fade-image ${loading ? "fade-out" : ""}`}
//       src={src}
//       alt={alt}
//       onError={handleError}
//     />
//   );
// }

function TitleDropDown({ label }) {
  return (
    <button
      type="button"
      className="border-b-4 hover:border-indigo-500 opacity-70 hover:opacity-100 cursor-pointer transition-all"
      onClick={(e) => e.preventDefault()}
    >
      {label}
    </button>
  );
}

export default VehicleHeader;
