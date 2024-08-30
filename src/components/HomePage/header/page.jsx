"use client";

import React, { useState } from "react";
import Link from "next/link";
import BlogMenu from "../../common/BlogMenu";
import HomeMenu from "../../common/HomeMenu";
import ListingMenu from "../../common/ListingMenu";
import PagesMenu from "../../common/PagesMenu";
import UserPagesMenu from "../../common/UserPagesMenu";

const Header = ({ parms }) => {
  const onHandleMobileMenu = () => {
    var root = document.getElementsByTagName("html")[0];
    root.classList.add("menu-opened");
  };

  const onhandleCloseMenu = () => {
    var root = document.getElementsByTagName("html")[0];
    root.classList.remove("menu-opened");
  };
  const [menu, setMenu] = useState(false);
  const toggleMobileMenu = () => {
    setMenu(!menu);
  };
  return (
    <header className="header" onClick={(value) => toggleMobileMenu()}>
      <div className="container">
        <nav className="navbar navbar-expand-lg header-nav">
          <div className="navbar-header">
            <Link id="mobile_btn" href="#" onClick={() => onHandleMobileMenu()}>
              <span className="bar-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </Link>
            <Link href="/index" className="navbar-brand logo">
              <img src="./img/logo.svg" className="img-fluid" alt="Logo" />
            </Link>
          </div>
          <div className="main-menu-wrapper">
            <div className="menu-header">
              <Link href="/index" className="menu-logo">
                <img src="./img/logo.svg" className="img-fluid" alt="Logo" />
              </Link>
              <Link
                id="menu_close"
                className="menu-close"
                href="#"
                onClick={() => onhandleCloseMenu()}
              >
                {" "}
                <i className="fas fa-times"></i>
              </Link>
            </div>
            <ul className="main-nav">
              <HomeMenu activeMenu={"Classified"} />
              <ListingMenu activeMenu={parms} />
              <PagesMenu activeMenus={parms} />
              <UserPagesMenu />
              <BlogMenu activesMenus={parms} />
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li className="login-link">
                <Link href="/signup">Sign Up</Link>
              </li>
              <li className="login-link">
                <Link href="/login">Sign In</Link>
              </li>
            </ul>
          </div>
          <ul className="nav header-navbar-rht">
            <li className="nav-item">
              <Link className="nav-link header-reg" href="/signup">
                Sign Up
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link header-login" href="/login">
                {" "}
                Sign In
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link header-login add-listing"
                href="/add-listing"
              >
                <i className="fa-solid fa-plus"></i> Add Listing
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
