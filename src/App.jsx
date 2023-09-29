import React from "react";
import { Accessories } from "./Accessories";
import VehicleHeader from "./VehicleHeader";
// import accessories from "./data/CR-V+AccessoriesPrice.json";

import { ImageProccessor } from "./ImageProccessor";
import useFetchJSON from "./useFetchJSON";
import useQueryParams from "./useQueryParams";

function App() {
  const { data: accessories, loading, error } = useFetchJSON("vehicles/2024/cr-v/accessories.json");
  const { data: vehicle } = useFetchJSON("vehicles/2024/cr-v/trims.json");

  const { getParam, setParam, removeParam } = useQueryParams();

  console.log("initial", getParam("trimLevel"), getParam("exteriorColor"));
  const [selectedAccessories, setSelectedAccessories] = React.useState({});
  const [trimLevel, setTrimLevel] = React.useState(getParam("trimLevel") || "LX,RS3H2REW");
  const [exteriorColor, setExteriorColor] = React.useState(getParam("exteriorColor") || "B-640M");

  React.useEffect(() => {
    console.log(trimLevel, exteriorColor);
    if (getParam("trimLevel") !== trimLevel) setParam("trimLevel", trimLevel);
    if (getParam("exteriorColor") !== exteriorColor) setParam("exteriorColor", exteriorColor);
  }, [trimLevel, exteriorColor]);

  // React.useEffect(() => {

  //     setParam("trimLevel", trimLevel);
  //     setParam("exteriorColor", exteriorColor);

  // }, [trimLevel, exteriorColor, setParam,]);

  let availableTrims = [];
  if (vehicle) availableTrims = Object.entries(vehicle).map(([name, value]) => [name, value.trimCode]);

  const getTotalPrice = () => {
    const total = Object.values(selectedAccessories).reduce((sum, price) => sum + price, 0);
    return total.toFixed(2);
  };

  // console.log(selectedAccessories);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className="flex flex-col lg:flex-row">
      {/* <ImageProccessor /> */}
      <VehicleHeader
        vehicle={vehicle}
        accessoriesData={accessories}
        selectedAccessories={selectedAccessories}
        totalPrice={getTotalPrice()}
        trimLevel={trimLevel}
        setTrimLevel={setTrimLevel}
        exteriorColor={exteriorColor}
        setExteriorColor={setExteriorColor}
        availableTrims={availableTrims}
      />
      <Accessories
        accessories={accessories}
        selectedAccessories={selectedAccessories}
        setSelectedAccessories={setSelectedAccessories}
      />
    </div>
  );
}

export default App;
