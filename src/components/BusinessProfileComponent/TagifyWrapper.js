import React, { useRef, useEffect } from "react";
import Tagify from "@yaireo/tagify"; // Importing the core Tagify library

const TagifyWrapper = ({ value, onChange, settings }) => {
  const inputRef = useRef();
  const tagifyRef = useRef();

  useEffect(() => {
    // Initialize Tagify on the input element
    tagifyRef.current = new Tagify(inputRef.current, settings);

    // Set initial value
    tagifyRef.current.loadOriginalValues(value);

    // Listen to 'add' event to retain focus on input
    tagifyRef.current.on("add", () => {
      inputRef.current.focus();
    });

    // Handle onChange event
    tagifyRef.current.on("change", (e) => {
      console.log("Tagify change event data:", e.detail.value);
      onChange(e.detail.value);
    });

    // Cleanup Tagify instance on component unmount
    return () => {
      tagifyRef.current.destroy();
      tagifyRef.current = null;
    };
  }, [value, settings, onChange]);

  return (
    <input
      ref={inputRef}
      defaultValue={value} // Set the initial value of the input
      className="tagify-input" // Optional: custom class for styling
      autoFocus // Keep focus on input initially
    />
  );
};

export default TagifyWrapper;
