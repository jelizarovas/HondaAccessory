import React from "react";
import ReactMarkdown from "react-markdown";
import { MdSavings } from "react-icons/md";

export const Accessories = ({ accessories, selectedAccessories, setSelectedAccessories }) => {
  const [search, setSearch] = React.useState("");

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
    const total = Object.values(selectedAccessories).reduce((sum, price) => sum + price, 0);
    return total.toFixed(2);
  };

  // const selectAll = () => {
  //   const allAccessories = {};
  //   Object.keys(accessories).forEach((category) => {
  //     Object.entries(accessories[category]).forEach(([accessory, price]) => {
  //       allAccessories[accessory] = price;
  //     });
  //   });
  //   setSelectedAccessories(allAccessories);
  // };

  const selectNone = () => {
    setSelectedAccessories({});
  };

  return (
    <div className="flex relative w-full  lg:max-w-lg overflow-y-auto  h-screen shadow-2xl   py-2">
      <div className="mx-auto">
        <div className="flex flex-col  bg-white w-full px-2">
          <div className="flex justify-between items-center">
            <div className=" flex-grow flex items-center text-2xl text-black">
              <span>🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-2xl py-4 ring-0 outline-none w-full flex-grow px-2"
                placeholder="Accessories"
              />
            </div>
            <div className="flex items-center space-x-2">
              {/* <button onClick={selectAll}>Select All</button> */}
              <button className="hover:underline whitespace-nowrap" onClick={selectNone}>
                Select None
              </button>
            </div>
          </div>
          {/* <div className="">Total Price: ${getTotalPrice()}</div> */}
        </div>
        <div className="flex flex-col overflow-y ">
          {Object.keys(accessories).map((category) => (
            <div key={category}>
              <h4 className="bg-slate-200">{category}</h4>
              <ul>
                {Object.entries(accessories[category])
                  .filter(([accessoryName, accessory]) => accessory.name.includes(search))
                  .map(([accessoryName, accessory]) => {
                    return (
                      <Accessory
                        accessoryName={accessoryName}
                        accessory={accessory}
                        selectedAccessories={selectedAccessories}
                        handleCheckboxChange={handleCheckboxChange}
                      />
                    );
                  })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Accessory = ({ accessoryName, accessory, selectedAccessories, handleCheckboxChange, ...props }) => {
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

  const markdownText = accessory?.description && accessory.description.split("\n").join("  \n");

  return (
    <li key={accessoryName} className="relative cursor-pointer ">
      <label className="select-none cursor-pointer flex items-center space-x-2 py-0.5 px-2 hover:bg-indigo-100 transition-all">
        <input
          type="checkbox"
          checked={selectedAccessories.hasOwnProperty(accessoryName)}
          onChange={(event) => handleCheckboxChange(accessoryName, accessory.price, event)}
        />
        <span>
          {accessory?.name || accessoryName} ${accessory.price || accessory}
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
