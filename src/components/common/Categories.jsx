import React from "react";
import { useState,useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
library.add(fab);

const Categories = ({ activeMenu }) => {
  const [menu2, setMenu2] = useState(false);
  const websiteData = useSelector((state) => state.websiteSetup.data);



  const [mobileDropdown, setMobileDropdown] = useState(false);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileDropdown && !event.target.closest(".has-submenu")) {
        setMobileDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [mobileDropdown]);

 const handleItemClick = () => {
   // Close the dropdown when an item is clicked
   setMobileDropdown(false);
 };
  
  return (
    <>
      <li className="has-submenu">
        <a
          className="mobile-user-menu profile-userlink"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMobileDropdown(!mobileDropdown);
          }}
          href="/categories"
        >
          Categories
          <i className={`feather-arrow-${mobileDropdown ? "up" : "down"}`}></i>
        </a>
        <ul
          className={`submenu ${mobileDropdown ? "show" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {websiteData?.businessCategories.map((item, index) => (
            <li key={index}>
              <Link onClick={handleItemClick} href={`/categories/${item.slug}`}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    </>
  );
};

export default Categories;
