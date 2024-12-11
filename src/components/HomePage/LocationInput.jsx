'use client'
import React, { useState, useRef, useEffect } from "react";

export default function LocationInput({
  onLocationChange,
  selectedLocation,
  onChange,
}) {
  const [inputValue, setInputValue] = useState(selectedLocation || "");
  const [isLocationBlocked, setIsLocationBlocked] = useState(false);
  const inputRef = useRef(null);


   useEffect(() => {
     setInputValue(selectedLocation || "");
   }, [selectedLocation]);

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
          setInputValue("Location not available");
          onChange("Location not available");
          if (onLocationChange) {
            onLocationChange("Location not available");
          }
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setInputValue("Geolocation not supported");
      onChange("Geolocation not supported");
      if (onLocationChange) {
        onLocationChange("Geolocation not supported");
      }
    }
  };

  const fetchCityName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      const cityName = data.city || data.locality || "Unknown location";
      setInputValue(cityName);
      onChange(cityName);
      if (onLocationChange) {
        onLocationChange(cityName);
      }
    } catch (error) {
      console.error("Error fetching city name:", error);
      setInputValue("City name not available");
      onChange("City name not available");
      if (onLocationChange) {
        onLocationChange("City name not available");
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onChange(value);
    if (onLocationChange) {
      onLocationChange(value);
    }
  };

  const handleUseCurrentLocation = (e) => {
    e.preventDefault()
    getUserLocation();
  };

return (
  <div className="position-relative">
    <div className="d-flex align-items-center position-relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search location..."
        className="form-control form-control-sm " // Increase right padding to make space for icon
        style={
          {
            // Additional padding to make space for the icon
          }
        }
      />
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        className="position-absolute"
        style={{
          right: "30px",
          border: "none",
          background: "none",
          padding: "5px",
          cursor: "pointer",
          height: "100%",
          display: "flex",
          alignItems: "center",
          fontWeight: "bolder",
        }}
        aria-label="Use current location"
      >
        <i className="feather-map-pin" />
      </button>
    </div>
    {isLocationBlocked && (
      <div className="mt-2 small text-danger">
        Location blocked. Check browser/phone settings.
      </div>
    )}
  </div>
);
}
