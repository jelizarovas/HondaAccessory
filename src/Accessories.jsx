import React from "react";
import accessories from "./data/CR-V+AccessoriesPrice.json";
import ReactMarkdown from "react-markdown";

export const Accessories = () => {
  const [selectedAccessories, setSelectedAccessories] = React.useState({});

  const handleCheckboxChange = (accessory, price, event) => {
    const updatedSelection = { ...selectedAccessories };

    if (event.target.checked) {
      updatedSelection[accessory] = price;
    } else {
      delete updatedSelection[accessory];
    }

    setSelectedAccessories(updatedSelection);
  };

  const getTotalPrice = () => {
    const total = Object.values(selectedAccessories).reduce(
      (sum, price) => sum + price,
      0
    );
    return total.toFixed(2);
  };

  const selectAll = () => {
    const allAccessories = {};
    Object.keys(accessories).forEach((category) => {
      Object.entries(accessories[category]).forEach(([accessory, price]) => {
        allAccessories[accessory] = price;
      });
    });
    setSelectedAccessories(allAccessories);
  };

  const selectNone = () => {
    setSelectedAccessories({});
  };

  return (
    <div>
      Accessories
      <button onClick={selectAll}>Select All</button>
      <button onClick={selectNone}>Select None</button>
      {Object.keys(accessories).map((category) => (
        <div key={category}>
          <h4 className="bg-slate-200">{category}</h4>
          <ul>
            {Object.entries(accessories[category]).map(
              ([accessoryName, accessory]) => {
                return (
                  <Accessory
                    accessoryName={accessoryName}
                    accessory={accessory}
                    selectedAccessories={selectedAccessories}
                    handleCheckboxChange={handleCheckboxChange}
                  />
                );
              }
            )}
          </ul>
        </div>
      ))}
      <div>Total Price: ${getTotalPrice()}</div>
    </div>
  );
};

const Accessory = ({
  accessoryName,
  accessory,
  selectedAccessories,
  handleCheckboxChange,
  ...props
}) => {
  const [isOpen, setOpen] = React.useState(false);

  const timerRef = React.useRef(null);
  const infoRef = React.useRef(null);
  const handleClickOutside = (event) => {
    if (infoRef.current && !infoRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setOpen(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setOpen(false);
  };

  const markdownText =
    accessory?.description && accessory.description.split("\n").join("  \n");

  return (
    <li key={accessoryName} className="relative cursor-pointer">
      <label className="select-none cursor-pointer">
        <input
          type="checkbox"
          checked={selectedAccessories.hasOwnProperty(accessoryName)}
          onChange={(event) =>
            handleCheckboxChange(accessoryName, accessory.price, event)
          }
        />{" "}
        <span>
          {" "}
          {accessoryName} - ${accessory.price || accessory}
        </span>
        <span
          aria-label="information"
          className="px-2 cursor-pointer"
          //   onMouseEnter={handleMouseEnter}
          //   onMouseLeave={handleMouseLeave}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          ref={infoRef}
        >
          🛈
        </span>
      </label>
      {isOpen && (
        <div
          className="absolute left-3 max-w-lg bg-white z-10 p-2 border"
          //   onClick={() => setOpen(false)}
        >
          <img src={accessory.image} className="w-36" />
          <ReactMarkdown className="text-xs">{markdownText}</ReactMarkdown>
        </div>
      )}
    </li>
  );
};
