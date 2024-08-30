import React, { useEffect } from "react";
import BlogMenu from "../../common/BlogMenu";
import HomeMenu from "../../common/HomeMenu";
import ListingMenu from "../../common/ListingMenu";
import PagesMenu from "../../common/PagesMenu";
import UserPagesMenu from "../../common/UserPagesMenu";
import { LogoPng } from "../../imagepath";
import Link from "next/link";
import { useState } from "react";

const Header3 = () => {
  const [scroll, setScroll] = useState(false);
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
        setMenu(!menu)
    }
    
 useEffect(() => {
   window.addEventListener("scroll", () => {
     setScroll(window.scrollY > 85);
   });
   return () => window.removeEventListener('scroll', () => {
    setScroll(window.scrollY > 85);
  });

 }, []);
  return (
    <header
      className={scroll ? "header header-eight fixed" : "header header-eight"}
      onClick={(value) => toggleMobileMenu()}
    >
      <div className="container">
        <nav className="navbar navbar-expand-lg header-nav">
          <div className="navbar-header">
            <Link id="mobile_btn" href ="#" onClick={() => onHandleMobileMenu()}>
              <span className="bar-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </Link>
            <Link href ="/index" className="navbar-brand logo">
              <img src="/img/logo.svg" className="img-fluid" alt="Logo" />
            </Link>
            <Link href ="/index" className="navbar-brand logo-small">
              <img src="/img/logo.svg" className="img-fluid" alt="Logo" />
            </Link>
          </div>
          <div className="main-menu-wrapper">
            <div className="menu-header">
              <Link href ="/index" className="menu-logo">
                <img src="/img/logo.svg" className="img-fluid" alt="Logo" />
              </Link>
              <Link
                id="menu_close"
                className="menu-close"
                href ="#"
                onClick={() => onhandleCloseMenu()}
              >
                {" "}
                <i className="fas fa-times"></i>
              </Link>
            </div>
            <ul className="navbar-nav main-nav my-2 my-lg-0">
              <HomeMenu activeMenu={"Tour"} />
              <ListingMenu />
              <PagesMenu />
              <UserPagesMenu />
              <BlogMenu />
              <li>
                <Link href ="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div className="d-flex align-items-center block-e">
            <div className="cta-btn">
              <Link href ="/login" className="btn">
                sign in /
              </Link>
              <Link href ="/signup" className="btn ms-1">
                {" "}
                register
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header3;
