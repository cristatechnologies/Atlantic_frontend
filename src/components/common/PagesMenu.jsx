import React from "react";
import { useState } from "react";
import Link from "next/link";

const PagesMenu = ({ activeMenus}) => {
  
  

  const [menu3, setMenu3] = useState(false);
  return (
    <li className={activeMenus=== "/about"|| activeMenus=== "/service-details" || activeMenus=== "/pricing" || activeMenus=== "/faq"|| activeMenus=== "/gallery" || activeMenus=== "/categories" || activeMenus=== "/howitworks" || activeMenus=== "/terms-condition" || activeMenus=== "/privacy-policy" ? "has-submenu active" : "has-submenu"}>
      <Link href ="" className={menu3 ? 'submenu' : ""}>
        Pages <i className="fas fa-chevron-down" onClick={() => setMenu3(!menu3)}></i>
      </Link>
      <ul className={menu3 ? "submenu d-block" : "submenu"}>
        <li className={activeMenus=== "/about" ? "active" : ""}>
          <Link href ="/about">About Us</Link>
        </li>
        <li className={activeMenus=== "/service-details" ? "active" : ""}>
          <Link href ="/service-details">Service Details </Link>
        </li>
        <li className={activeMenus=== "/pricing" ? "active" : ""}>
          <Link href ="/pricing">Pricing</Link>
        </li>
        <li className={activeMenus=== "/faq" ? "active" : ""}>
          <Link href ="/faq">FAQ</Link>
        </li>
        <li className={activeMenus=== "/gallery" ? "active" : ""}>
          <Link href ="/gallery">Gallery</Link>
        </li>
        <li className={activeMenus=== "/categories" ? "active" : ""}>
          <Link href ="/categories">Category</Link>
        </li>
        <li className={activeMenus=== "/howitworks" ? "active" : ""}>
          <Link href ="/howitworks">How it Works</Link>
        </li>
        <li className={activeMenus=== "/terms-condition" ? "active" : ""}>
          <Link href ="/terms-condition">Terms & Conditions</Link>
        </li>
        <li className={activeMenus=== "/privacy-policy" ? "active" : ""}>
          <Link href ="/privacy-policy">Privacy Policy</Link>
        </li>
        <li className={activeMenus=== "/error-404" ? "active" : ""}>
          <Link href ="/error-404">404 Error</Link>
        </li>
        <li className={activeMenus=== "/error-500" ? "active" : ""}>
          <Link href ="/error-500">500 Error</Link>
        </li>
      </ul>
    </li>
  );
};

export default PagesMenu;
