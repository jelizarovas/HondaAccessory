import { useReducer, useEffect, useCallback } from "react";
import useFetchJSON from "./useFetchJSON";

const initialState = {
  originalData: null,
  editedData: null,
  isModified: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ORIGINAL":
      return {
        ...state,
        originalData: action.payload,
        editedData: action.payload,
        isModified: false,
      };
    case "EDIT":
      const updatedData = setIn(state.editedData, action.payload.path, action.payload.value);
      console.log({ updatedData });
      return {
        ...state,
        editedData: updatedData,
        isModified: JSON.stringify(state.originalData) !== JSON.stringify(updatedData),
      };
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
}

function setIn(object, path, value) {
  const keys = path.split(".");
  let index = 0;
  let temp = object;

  while (index < keys.length) {
    // Check if the current key is of the form someArray[someIndex]
    if (/^[a-zA-Z_]\w*\[\d+\]$/.test(keys[index])) {
      let [arrayKey, arrayIndex] = keys[index].match(/^([a-zA-Z_]\w*)\[(\d+)\]$/).slice(1);
      temp[arrayKey] = temp[arrayKey] || [];
      temp = temp[arrayKey];

      if (index === keys.length - 1) {
        // If this is the last key, set the value
        temp[arrayIndex] = value;
      } else {
        // Else, ensure this index contains an object or array for the next key
        temp[arrayIndex] = temp[arrayIndex] || (/\d+/.test(keys[index + 1]) ? [] : {});
        temp = temp[arrayIndex];
      }
    } else {
      if (index === keys.length - 1) {
        temp[keys[index]] = value;
      } else {
        temp[keys[index]] = temp[keys[index]] || {};
        temp = temp[keys[index]];
      }
    }

    index++;
  }

  return object;
}

export default function useEditableJSON(path) {
  const { data, loading, error } = useFetchJSON(path);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_ORIGINAL", payload: data });
    }
  }, [data]);

  const onChange = useCallback((e) => {
    const { name, type, checked } = e.target;
    const value = type === "checkbox" ? checked : e.target.value;
    console.log({ value, name });
    dispatch({ type: "EDIT", payload: { path: name, value } });
  }, []);

  return {
    ...state,
    loading,
    error,
    onChange,
  };
}
