import React from "react";
import { Accessories } from "./Accessories";
import VehicleHeader from "./VehicleHeader";
import { ImageProccessor } from "./ImageProccessor";

function App() {
  const [selectedAccessories, setSelectedAccessories] = React.useState({});

  const getTotalPrice = () => {
    const total = Object.values(selectedAccessories).reduce((sum, price) => sum + price, 0);
    return total.toFixed(2);
  };

  console.log(selectedAccessories);
  return (
    <div className="flex flex-col lg:flex-row">
      {/* <ImageProccessor /> */}
      <VehicleHeader selectedAccessories={Object.keys(selectedAccessories)} totalPrice={getTotalPrice()} />
      <Accessories
        selectedAccessories={selectedAccessories}
        setSelectedAccessories={setSelectedAccessories}
      />
    </div>
  );
}

export default App;
