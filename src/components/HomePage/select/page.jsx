import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import CreatableSelect from "react-select/creatable";
import { components } from "react-select";

export default function Select({ value, onChange }) {
  const [options, setOptions] = useState([
    {
      label: "Use current location",
      value: "useMyLocation",
      isCurrentLocation: true,
    },
    // { label: "Kerala", value: "Kerala", isPopular: true },
    // { label: "Tamil Nadu", value: "Tamil Nadu", isPopular: true },
    // { label: "Punjab", value: "Punjab", isPopular: true },
    // { label: "Maharashtra", value: "Maharashtra", isPopular: true },
  ]);

  const [isLocationBlocked, setIsLocationBlocked] = useState(false);

  useEffect(() => {
    if (value === "useMyLocation") {
      getUserLocation();
    }
  }, [value]);

 const getUserLocation = () => {
   if ("geolocation" in navigator) {
     navigator.geolocation.getCurrentPosition(
       (position) => {
         const { latitude, longitude } = position.coords;
         fetchCityName(latitude, longitude);
       },
       (error) => {
         console.error("Error getting location:", error);
         setIsLocationBlocked(true);
         onChange({ label: "Location not available", value: "" });
       }
     );
   } else {
     console.error("Geolocation is not supported by this browser.");
     onChange({ label: "Geolocation not supported", value: "" });
   }
 };

   const handleChange = (newValue) => {
     onChange(newValue ? newValue.value : "");
   };


  const fetchCityName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      const cityName = data.city || data.locality || "Unknown location";

      const newOption = { label: cityName, value: cityName };
      setOptions((prevOptions) => [...prevOptions, newOption]);
      onChange(newOption.value);
    } catch (error) {
      console.error("Error fetching city name:", error);
      onChange("City name not available");
    }
  };

   const CustomOption = (props) => {
     return (
       <components.Option {...props}>
         {props.data.isCurrentLocation ? (
           <div
             style={{ color: "#4A90E2", display: "flex", alignItems: "center" }}
           >
           {/* GPS icon */}
             {props.children}
           </div>
         ) : props.data.isPopular ? (
           <div style={{ display: "flex", alignItems: "center" }}>
          
             {/* Location icon */}
             {props.children}
           </div>
         ) : (
           props.children
         )}
       </components.Option>
     );
   };

   const CustomMenu = (props) => {
     return (
       <components.Menu {...props}>
         {isLocationBlocked && (
           <div style={{ padding: "8px", color: "red", fontSize: "12px" }}>
             Location blocked. Check browser/phone settings.
           </div>
         )}
         <div style={{ padding: "8px", fontWeight: "bold" }}>
           POPULAR LOCATIONS
         </div>
         {props.children}
       </components.Menu>
     );
   };

  const style = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      width: "269px",
      border: state.isFocused ? 0 : 0,
      boxShadow: state.isFocused ? 0 : 0,
      borderRadius: state.isSelected ? "0" : "0px",
      fontSize: "14px",
      "&:hover": {
        border: state.isFocused ? 0 : 0,
        color: "black",
      },
      outline: "none",
      paddingLeft: "0",
    }),
    menu: (base) => ({ ...base, marginTop: "0px" }),
    menuList: (base) => ({ ...base, padding: "0" }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#c10037" : "white",
      fontSize: "14px",
      "&:hover": {
        backgroundColor: "#c10037",
      },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      display: "none",
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.selectProps.menuIsOpen ? "#b7b7b7" : "black",
      transform: state.selectProps.menuIsOpen ? "rotate(-180deg)" : "rotate(0)",
      transition: "250ms",
    }),
  };

  return (
    <CreatableSelect
      className="form-control prl0 select category-select"
      options={options}
      value={options.find((option) => option.value === value) || null}
      onChange={handleChange}
      placeholder="Search city, area or loc..."
      styles={style}
      components={{ Option: CustomOption, Menu: CustomMenu }}
      isClearable
      isSearchable
    />
  );
}
