import React, { useState, useEffect } from "react";
import useEditableJSON from "../useEditableJSON";

function TrimEdit() {
  const { originalData, editedData, isModified, loading, error, onChange } = useEditableJSON(
    "vehicles/2024/cr-v/accessories.json"
  );
  const [savedStatus, setSavedStatus] = useState("");
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

  const handleValueChange = (path, value) => {
    console.log(value, path);
    // Similar to the setIn function to update nested properties
    // Implement logic to set the value at the specific path in jsonData
  };

  const handleKeyChange = (path, newKey) => {
    // Logic to change a key at the specific path in jsonData
  };
  const paddingConstant = 10; // Adjust as needed
  const renderArray = (arr, path, depth) => (
    <div style={{ paddingLeft: `${depth * paddingConstant}px` }}>
      {arr.map((item, index) => (
        <div key={index}>{renderJSON(item, `${path}[${index}]`, depth + 1)}</div>
      ))}
      <button>+ Add to {path}</button>
      {/* Button to add a new item to the array */}
    </div>
  );

  const renderObject = (obj, path, depth) => (
    <div style={{ paddingLeft: `${depth * paddingConstant}px` }}>
      {Object.entries(obj).map(([key, value]) => (
        <div key={key}>
          <input type="text" value={key} onChange={(e) => handleKeyChange(`${path}.${key}`, e.target.value)} />:{" "}
          {renderJSON(value, `${path}.${key}`, depth + 1)}
        </div>
      ))}
      <button>+ Add to {path}</button>

      {/* Button to add a new key-value pair to the object */}
    </div>
  );

  const renderPrimitive = (value, path, depth) => {
    if (typeof value === "boolean") {
      return (
        <div style={{ paddingLeft: depth * paddingConstant }}>
          <input type="checkbox" checked={value} onChange={(e) => handlePrimitiveChange(path, e.target.checked)} />
        </div>
      );
    } else {
      return (
        <div style={{ paddingLeft: depth * paddingConstant }}>
          <label htmlFor={path} className="flex flex-col">
            {path}
            <input
              type="text"
              className="border w-1/2"
              name={removeLeadingDot(path)}
              value={value}
              onChange={(e) => {
                console.log({ name: e.target.name, value: e.target.value });
                onChange(e);
              }}
            />
          </label>
        </div>
      );
    }
  };

  const renderJSON = (data, path = "", depth = 0) => {
    if (Array.isArray(data)) {
      return renderArray(data, path, depth);
    } else if (typeof data === "object" && data !== null) {
      return renderObject(data, path, depth);
    } else {
      return renderPrimitive(data, path, depth);
    }
    //   const newPath = (subPath) => (path ? `${path}.${subPath}` : subPath);

    // if (Array.isArray(data)) return renderArray(data, path, depth);
    // else if (typeof data === "object") return renderObject(data, path, depth);
    // else if (typeof data === "string") {
    //   // console.log(path, data)
    //   return (
    //     <input
    //       type="text"
    //       className="border w-1/2"
    //       name={path}
    //       value={data}
    //       onChange={(e) => {
    //         console.log({ name: e.target.name, value: e.target.value });
    //         onChange(e);
    //       }}
    //     />
    //   );
    // } else if (typeof data === "boolean") {
    //   return <input type="checkbox" checked={data} onChange={(e) => handleValueChange(path, e.target.checked)} />;
    // }
    // // Handle other data types if needed
  };

  return (
    <div className="flex flex-col">
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
          <div>{renderJSON(editedData)}</div>;<button onClick={handleSave}>Save Data</button>
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
