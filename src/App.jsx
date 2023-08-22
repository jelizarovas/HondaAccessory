import React from "react";
import { Accessories } from "./Accessories";
import VehicleHeader from "./VehicleHeader";

function App() {
  const [selectedAccessories, setSelectedAccessories] = React.useState({});
  console.log(selectedAccessories);
  return (
    <div className="flex">
      <VehicleHeader selectedAccessories={Object.keys(selectedAccessories)} />
      <Accessories
        selectedAccessories={selectedAccessories}
        setSelectedAccessories={setSelectedAccessories}
      />
    </div>
  );
}

export default App;
