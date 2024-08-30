import React from "react";
import { useState } from "react";
import Link from "next/link";

const ListingMenu = ({ activeMenu }) => {
  const [menu2, setMenu2] = useState(false);
  return (
    <li className={activeMenu === "/listing-grid" || activeMenu === "/listing-grid-sidebar" || activeMenu === "/listing-list-sidebar" || activeMenu === "/listingmap-list" ||activeMenu === "/listingmap-grid" ? "has-submenu active" : "has-submenu"}>
      <Link href ="" className={menu2 ? 'submenu' : ""}>
        Listings <i className="fas fa-chevron-down" onClick={() => setMenu2(!menu2)}></i>
      </Link>
      <ul className={menu2 ? "submenu d-block" : "submenu"}>
        <li className={activeMenu === "/listing-grid" ? "active" : ""}>
          <Link href ="/listing-grid">Listing Grid</Link>
        </li>
        <li className={activeMenu === "/listing-grid-sidebar" ? "active" : ""}>
          <Link href ="/listing-grid-sidebar">Listing Grid Sidebar</Link>
        </li>
        <li className={activeMenu === "/listing-list-sidebar" ? "active" : ""}>
          <Link href ="/listing-list-sidebar">Listing List Sidebar</Link>
        </li>
        <li className={activeMenu === "/listingmap-list" ? "active" : ""}>
          <Link href ="/listingmap-list">Listing List Map</Link>
        </li>
        <li className={activeMenu === "/listingmap-grid" ? "active" : ""}>
          <Link href ="/listingmap-grid">Listing Grid Map</Link>
        </li>
      </ul>
    </li>
  );
};

export default ListingMenu;
