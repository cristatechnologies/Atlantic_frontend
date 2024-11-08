import React from "react";
import { useState } from "react";
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
  return (
    <li
      className={
        activeMenu === "/categories" ||
        activeMenu === "/categories" ||
        activeMenu === "/categories" ||
        activeMenu === "/categories" ||
        activeMenu === "/categories"
          ? "has-submenu active"
          : "has-submenu"
      }
    >
      <Link href="/categories" className={menu2 ? "submenu" : ""}>
        Categories
        {/* <FontAwesomeIcon
          icon={faChevronDown}
          onClick={() => setMenu2(!menu2)}
        /> */}
      </Link>
      <ul className={menu2 ? "submenu d-block" : "submenu"}>
        {websiteData?.businessCategories.map((item, index) => (
          <li
            className={activeMenu === `/categories/${item.id}` ? "active" : ""}
            key={index}
          >
            <Link href={`/categories/${item.id}`}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default Categories;
