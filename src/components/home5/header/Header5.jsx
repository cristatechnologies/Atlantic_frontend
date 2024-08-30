import React from "react";
import Link from "next/link";
import BlogMenu from "../../common/BlogMenu";
import HomeMenu from "../../common/HomeMenu";
import ListingMenu from "../../common/ListingMenu";
import PagesMenu from "../../common/PagesMenu";
import UserPagesMenu from "../../common/UserPagesMenu";


const Header5 = () => {
  return (
    <header className="header header-four">
      <div className="container">
        <nav className="navbar navbar-expand-lg header-nav">
          <div className="navbar-header">
            <Link id="mobile_btn" href ="#">
              <span className="bar-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </Link>
            <Link href ="index.html" className="navbar-brand logo">
              <img src="./img/logo.svg" className="img-fluid" alt="Logo" />
            </Link>
          </div>
          <div className="main-menu-wrapper">
            <div className="menu-header">
              <Link href ="index.html" className="menu-logo">
                <img src="./img/logo.svg" className="img-fluid" alt="Logo" />
              </Link>
              <Link id="menu_close" className="menu-close" href ="#">
                {" "}
                <i className="fas fa-times"></i>
              </Link>
            </div>
            <ul className="main-nav">
              <HomeMenu activeMenu={"Business"} />
              <ListingMenu />
              <PagesMenu />
              <UserPagesMenu />
              <BlogMenu />
              <li>
                <Link href ="/contact">Contact</Link>
              </li>
              <li className="login-link">
                <Link href ="/signup">Sign Up</Link>
              </li>
            </ul>
          </div>
          <ul className="nav header-navbar-rht nav">
            <li className="nav-item">
              <div className="cta-btn">
                <Link href ="/login" className="btn">
                  <i className="feather-user"></i> sign in /
                </Link>
                <Link href ="/signup" className="btn ms-1">
                  {" "}
                  register
                </Link>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header5;
