import React, { useState, useEffect } from "react";
import useEditableJSON from "../useEditableJSON";

function TrimEdit() {
  const { originalData, editedData, isModified, loading, error, onChange } = useEditableJSON(
    "vehicles/2024/cr-v/trims.json"
  );
  const [savedStatus, setSavedStatus] = useState("");

  //   const availableTrims = ["All", ...getAvailableTrims(originalData)];
  //   const [inputName, setInputName] = useState("LX.colorOptions[2].exteriorName");

  const handleSave = async () => {
    const timestamp = new Date().getTime();
    const response = await fetch("/api/save-trims", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: editedData, filename: `trims ${timestamp}.json` }),
    });

    if (response.ok) {
      setSavedStatus("Saved successfully!");
    } else {
      setSavedStatus("Failed to save. Try again.");
    }
  };

  if (loading) return <div>Loading...</div>;

  const handleKeyChange = (path, newKey) => {
    // Logic to change a key at the specific path in jsonData
  };
  const paddingConstant = 10; // Adjust as needed

  const renderArray = (arr, path, depth) => (
    <div style={{ paddingLeft: `${depth * paddingConstant}px` }}>
      {arr.map((item, index) => (
        <div className=" flex" key={index}>
          {renderJSON(item, `${path}[${index}]`, depth + 1)}
        </div>
      ))}
      {/* <button>+ Add to {path}</button> */}
      {/* Button to add a new item to the array */}
    </div>
  );

  const renderObject = (obj, path, depth) => (
    <div style={{ paddingLeft: `${depth * paddingConstant}px` }}>
      {Object.entries(obj).map(([key, value]) => (
        <div key={key} className="flex justify-start   hover:bg-indigo-200 hover:bg-opacity-20">
          <KeyComponent value={key} />

          {renderJSON(value, `${path}.${key}`, depth + 1, key)}
        </div>
      ))}
      {/* <button>+ Add to {path}</button> */}

      {/* Button to add a new key-value pair to the object */}
    </div>
  );

  const renderColorOptions = (arr, path, depth) => (
    <div>
      {arr.map((color) => (
        <ColorOptions color={color} />
      ))}
      <button type="butoon" onClick={() => console.log(obj)}>
        COLORS
      </button>
    </div>
  );

  const renderPrimitive = (value, path, depth) => {
    if (typeof value === "boolean") {
      return (
        // <div style={{ paddingLeft: depth * paddingConstant }}>
        <input type="checkbox" name={removeLeadingDot(path)} checked={value} onChange={onChange} />
        // </div>
      );
    } else {
      return (
        // <div style={{ paddingLeft: depth * paddingConstant }}>
        <label htmlFor={path} className="flex flex-col">
          {/* <span> {path}</span> */}
          <input
            type="text"
            className="border w-46 mx-1"
            name={removeLeadingDot(path)}
            value={value}
            onChange={onChange}
          />
        </label>
        // </div>
      );
    }
  };

  const renderJSON = (data, path = "", depth = 0, key) => {
    if (key && key === "colorOptions") return renderColorOptions(data, path, depth);
    if (Array.isArray(data)) {
      return renderArray(data, path, depth);
    } else if (typeof data === "object" && data !== null) {
      return renderObject(data, path, depth);
    } else {
      return renderPrimitive(data, path, depth);
    }
  };

  return (
    <div className="flex flex-col text-xs">
      {/* <input type="text" onChange={(e) => setInputName(e.target.value)} value={inputName} />
      {editedData && (
        <input
          onChange={onChange}
          name={inputName}
          //   value={editedData.LX.colorOptions[2].exteriorName}
          value={parseInputStringToObject(editedData, inputName)}
        />
      )} */}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {editedData && (
        <>
          {/* <pre>{JSON.stringify(editedData, null, 2)}</pre> */}
          {/* <div>{renderJSON(editedData)}</div> */}
          <button onClick={handleSave} className="bg-green-500 py-2 px-4 max-w-xs ">
            Save Data
          </button>
          {savedStatus && <p>{savedStatus}</p>}
        </>
      )}
    </div>
  );
}

export default TrimEdit;

function removeLeadingDot(path) {
  return path.startsWith(".") ? path.slice(1) : path;
}

function parseInputStringToObject(data, path) {
  const keys = path.split(".");
  let index = 0;
  let temp = data;

  while (index < keys.length) {
    if (/^[a-zA-Z_]\w*\[\d+\]$/.test(keys[index])) {
      let [arrayKey, arrayIndex] = keys[index].match(/^([a-zA-Z_]\w*)\[(\d+)\]$/).slice(1);
      if (temp[arrayKey]) {
        temp = temp[arrayKey][arrayIndex];
      } else {
        // if the path doesn't exist in the data, return undefined
        return undefined;
      }
    } else {
      temp = temp[keys[index]];
    }

    index++;
  }

  return temp || "";
}

const KeyComponent = ({ value, ...props }) => {
  return (
    <div className="group w-32 ">
      <span>{camelToTitleCase(value)}</span>
    </div>
  );
};

function camelToTitleCase(str) {
  return (
    str
      // Insert a space before all caps
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      // Uppercase the first character
      .replace(/^./, (char) => char.toUpperCase())
  );
}

// function getAvailableTrims(data) {
//   return Object.keys(data);
// }

const ColorOptions = ({ color }) => {
  return (
    <div>
      <input type="text" className="w-48 border p-1 rounded " value={color?.exteriorName || ""} />
      <input type="text" className="w-16 border p-1 rounded " value={color?.exteriorCode || ""} />
      <input type="text" className="w-16 border p-1 rounded " value="FFF000" />
      <div>
        <InteriorColor colors={color?.interior} />
      </div>
    </div>
  );
};

const InteriorColor = ({ colors }) => {
  return (
    <div>
      {colors.map((color) => (
        <div>{`${color.name} ${color.type} (${color.code})`}</div>
      ))}
    </div>
  );
};
