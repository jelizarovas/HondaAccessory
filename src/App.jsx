import React from "react";
import { Accessories } from "./Accessories";
import VehicleHeader from "./VehicleHeader";
// import accessories from "./data/CR-V+AccessoriesPrice.json";

import { ImageProccessor } from "./ImageProccessor";
import useFetchJSON from "./useFetchJSON";

function App() {
  const { data: accessories, loading, error } = useFetchJSON("vehicles/2024/cr-v/accessories.json");
  const { data: vehicle } = useFetchJSON("vehicles/2024/cr-v/trims.json");

  const [selectedAccessories, setSelectedAccessories] = React.useState({});

  const getTotalPrice = () => {
    const total = Object.values(selectedAccessories).reduce((sum, price) => sum + price, 0);
    return total.toFixed(2);
  };

  console.log(selectedAccessories);
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
