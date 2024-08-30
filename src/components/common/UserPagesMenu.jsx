import React from "react";
import { useState } from "react";
import Link from "next/link";

const UserPagesMenu = ({ activesMenu }) => {
  const [menu4, setMenu4] = useState(false);
  return (
    <li className={activesMenu=== "/dashboard" || activesMenu=== "/profile" || activesMenu=== "/add-listing" || activesMenu=== "/reviews" || activesMenu=== "/messages" || activesMenu=== "/my-listing" || activesMenu=== "/bookmarks" ? "has-submenu active" : "has-submenu"}>
      <Link href ="" className={menu4 ? 'submenu' : ""}>
        User Pages <i className="fas fa-chevron-down" onClick={() => setMenu4(!menu4)}></i>
      </Link>
      <ul className={menu4 ? "submenu d-block" : "submenu"}>
        <li className={activesMenu === "/dashboard" ? "active" : ""}>
          <Link href ="/dashboard">Dashboard</Link>
        </li>
        <li className={activesMenu === "/profile" ? "active" : ""}>
          <Link href ="/profile">Profile</Link>
        </li>
        <li className={activesMenu === "/my-listing" ? "active" : ""}>
          <Link href ="/my-listing">My Listing</Link>
        </li>
        <li className={activesMenu === "/bookmarks" ? "active" : ""}>
          <Link href ="/bookmarks">Bookmarks</Link>
        </li>
        <li className={activesMenu === "/messages" ? "active" : ""}>
          <Link href ="/messages">Messages</Link>
        </li>
        <li className={activesMenu === "/reviews" ? "active" : ""}>
          <Link href ="/reviews">Reviews</Link>
        </li>
        <li className={activesMenu === "/add-listing" ? "active" : ""}>
          <Link href ="/add-listing">Add Listing</Link>
        </li>
      </ul>
    </li>
  );
};

export default UserPagesMenu;
