"use client";

import React, { useState } from "react";
import Link from "next/link";

import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setupAction } from "@/store/websiteSetup";
import Image from "next/image";
import Categories from "../../common/Categories";
const Header = ({ parms }) => {
  const [authData, setAuthData] = useState(null);
  const [drops, setDrops] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const router = useRouter();
  const [logo, setLogo] = useState("");
  const [mobileDropdown, setMobileDropdown] = useState(false);
  // useEffect(() => {
  //   const settings = localStorage.getItem("settings");
  //   setLogo(JSON.parse(settings?.logo));
  //   console.log(settings.logo);
  //   console.log("log of the logo is ", settings.logo);
  // });

  useEffect(() => {
    const settings = localStorage.getItem("settings");
    if (settings) {
      const settingsData = JSON.parse(settings);
      setLogo(settingsData?.logo);
    }
  });


  const handleDropdownClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    setDropdownOpen(!dropdownOpen);
  };
  useEffect(() => {
    const authJson = localStorage.getItem("auth");
    if (authJson) {
      const userData = JSON.parse(authJson);
      setIsLoggedIn(true);
      setUserType(userData.user.user_type);
      setAuthData(userData);
    } else {
      setIsLoggedIn(false);
      setUserType(null);
    }
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("auth");
    setIsLoggedIn(!!user);
  }, []);

  const onHandleMobileMenu = () => {
    var root = document.getElementsByTagName("html")[0];
    root.classList.add("menu-opened");
  };

  const handleMobileMenuItemClick = () => {
    // Close both mobile dropdown and main mobile menu
    onhandleCloseMenu();
  };
  const onhandleCloseMenu = () => {
    var root = document.getElementsByTagName("html")[0];
    root.classList.remove("menu-opened");
    // Reset menu state
    setMenu(false);
    setMobileDropdown(false);
  };

  const [menu, setMenu] = useState(false);
  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    const authJson = localStorage.getItem("auth");
    if (authJson) {
      const auth = JSON.parse(authJson);
      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/logout?token=${auth.access_token}`
        );
        localStorage.removeItem("auth");
        setIsLoggedIn(false);
        setUserType(null);
        router.push("/login");
         onhandleCloseMenu();
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

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
  return (
    <header className="header w-full" onClick={(value) => toggleMobileMenu()}>
      <div className="" style={{ marginLeft: "3px", marginRight: "10px" }}>
        <div className=" w-full">
          <nav className="navbar navbar-expand-lg header-nav w-full">
            <div className="main-menu-wrapper">
              <div className="menu-header">
                <Link href="/" className="menu-logo">
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${logo}`}
                    style={{ maxWidth: "100%", height: "auto" }}
                    alt="Logo"
                  />
                </Link>
                <Link
                  id="menu_close"
                  className="menu-close"
                  href="#"
                  onClick={() => onhandleCloseMenu()}
                >
                  {" "}
                  <i className="feather-x" />
                </Link>
              </div>
              <ul className="main-nav">
                <Categories activeMenu={parms} />
                {/*
              <PagesMenu activeMenus={parms} />
              <UserPagesMenu />
              <BlogMenu activesMenus={parms} /> */}

                <li>
                  <Link
                    href="/active-offers"
                    onClick={handleMobileMenuItemClick}
                  >
                    Active Offers{" "}
                  </Link>
                </li>

                {isLoggedIn && userType === 1 && (
                  <>
                    <li className="d-lg-none has-submenu">
                      <a
                        href="#"
                        className="mobile-user-menu profile-userlink"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation(); // Stop event bubbling
                          setMobileDropdown(!mobileDropdown);
                        }}
                      >
                        <div className="user-info">
                          <img
                            src={
                              `${process.env.NEXT_PUBLIC_BASE_URL}${authData?.user?.business?.image}` ||
                              "/img/pngegg.png"
                            }
                            alt="User profile"
                          />
                          <span className="user-name">
                            {authData.user?.business?.name}
                          </span>
                          <i
                            className={`feather-arrow-${
                              mobileDropdown ? "up" : "down"
                            }`}
                          ></i>
                        </div>
                      </a>
                      <ul
                        className={`submenu ${mobileDropdown ? "show" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMobileDropdown(false);
                        }}
                      >
                        <li>
                          <Link
                            href="/user/dashboard"
                            onClick={handleMobileMenuItemClick}
                          >
                            <i className="fas fa-columns"></i> Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/user/profile"
                            onClick={handleMobileMenuItemClick}
                          >
                            <i className="fas fa-user-cog"></i> Profile Settings
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/your-deals"
                            onClick={handleMobileMenuItemClick}
                          >
                            <i className="fas fa-handshake"></i> Your Deals
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </>
                )}
                {isLoggedIn && userType === 2 && (
                  <>
                    <li className="d-lg-none has-submenu">
                      <a
                        href="#"
                        className="mobile-user-menu profile-userlink"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setMobileDropdown(!mobileDropdown);
                        }}
                      >
                        <div className="user-info">
                          <div className="user-info-left">
                            <img
                              src={
                                `${process.env.NEXT_PUBLIC_BASE_URL}${authData?.user?.image}` ||
                                "/img/pngegg.png"
                              }
                              alt="User profile"
                            />
                            <span className="user-name">
                              {authData.user?.name}
                            </span>
                          </div>
                          <i
                            className={`feather-arrow-${
                              mobileDropdown ? "up" : "down"
                            }`}
                          ></i>
                        </div>
                      </a>
                      <ul
                        className={`submenu ${mobileDropdown ? "show" : ""}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <li>
                          <Link
                            href="/user/dashboard"
                            onClick={handleMobileMenuItemClick}
                          >
                            <i className="fas fa-columns"></i> Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/user/profile"
                            onClick={handleMobileMenuItemClick}
                          >
                            <i className="fas fa-user-cog"></i> Profile Settings
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </>
                )}
                {!isLoggedIn && (
                  <>
                    <li className="login-link">
                      <Link href="/signup" onClick={handleMobileMenuItemClick}>
                        Sign Up
                      </Link>
                    </li>
                    <li className="login-link">
                      <Link href="/login" onClick={handleMobileMenuItemClick}>
                        Sign In
                      </Link>
                    </li>
                  </>
                )}
                {isLoggedIn && (
                  <li className="login-link">
                    <Link onClick={handleLogout} href="#">
                      Logout
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <div className="navbar-header">
              <Link
                id="mobile_btn"
                href="#"
                onClick={() => onHandleMobileMenu()}
              >
                <span className="bar-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </Link>
              <Link href="/" className="">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${logo}`}
                  alt="logo"
                  width="270"
                  height="65"
                  objectFit="scale-down"
                />
              </Link>
            </div>
            {/* <div class="btn-group">
            <button type="button" class="btn btn-danger">
              Action
            </button>
            <button
              type="button"
              class="btn btn-danger dropdown-toggle dropdown-toggle-split"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span class="sr-only">Toggle Dropdown</span>
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item" href="#">
                Action
              </a>
              <a class="dropdown-item" href="#">
                Another action
              </a>
              <a class="dropdown-item" href="#">
                Something else here
              </a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">
                Separated link
              </a>
            </div>
          </div> */}
            <ul className="nav header-navbar-rht">
              {!isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link header-reg"
                      href="/signup"
                      onClick={handleMobileMenuItemClick}
                    >
                      Sign Up
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link header-login"
                      href="/login"
                      onClick={handleMobileMenuItemClick}
                    >
                      Sign In
                    </Link>
                  </li>
                </>
              ) : (
                <></>
                // <li className="nav-item">
                //   <a
                //     className="nav-link header-login"
                //     href="#"
                //     onClick={handleLogout}
                //   >
                //     Logout
                //   </a>
                // </li>
              )}
              {isLoggedIn && userType === 1 && (
                <>
                  <li className="nav-item dropdown has-arrow logged-item">
                    <Link
                      href="#"
                      className={`${
                        drops === true
                          ? "dropdown-toggle profile-userlink show "
                          : "dropdown-toggle profile-userlink"
                      }`}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      onClick={() => setDrops(!drops)}
                      // className={`${change1===true ? 'dropdown-menu dropdown-menu-end show' : "dropdown-menu dropdown-menu-end"}`}
                    >
                      <img
                        src={
                          `${process.env.NEXT_PUBLIC_BASE_URL}${authData?.user?.business?.image}` ||
                          "/img/pngegg.png"
                        }
                        alt="User profile"
                      />

                      <span>{authData.user?.business?.name}</span>
                    </Link>
                    <div className="dropdown-menu dropdown-menu-end">
                      <Link
                        className="dropdown-item"
                        href="/user/dashboard"
                        onClick={handleMobileMenuItemClick}
                      >
                        Dashboard
                      </Link>
                      <Link
                        className="dropdown-item"
                        href="/user/profile"
                        onClick={handleMobileMenuItemClick}
                      >
                        Profile Settings
                      </Link>
                      <Link
                        className="dropdown-item"
                        href="/your-deals"
                        onClick={handleMobileMenuItemClick}
                      >
                        Your Deals{" "}
                      </Link>
                      <Link
                        className="dropdown-item"
                        href="#"
                        onClick={handleLogout}
                      >
                        Logout{" "}
                      </Link>
                    </div>
                  </li>
                </>
              )}

              {isLoggedIn && userType === 2 && (
                <>
                  <li className="nav-item dropdown has-arrow logged-item">
                    <Link
                      href="#"
                      className={`${
                        drops === true
                          ? "dropdown-toggle profile-userlink show "
                          : "dropdown-toggle profile-userlink"
                      }`}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      onClick={() => setDrops(!drops)}
                      // className={`${change1===true ? 'dropdown-menu dropdown-menu-end show' : "dropdown-menu dropdown-menu-end"}`}
                    >
                      <img
                        src={
                          authData.user.image
                            ? `${process.env.NEXT_PUBLIC_BASE_URL}${authData?.user?.image}`
                            : "/img/pngegg.png"
                        }
                        alt="User profile"
                      />

                      <span>{authData.user?.name}</span>
                    </Link>
                    <div className="dropdown-menu dropdown-menu-end">
                      <Link
                        className="dropdown-item"
                        href="/user/dashboard"
                        onClick={handleMobileMenuItemClick}
                      >
                        Dashboard
                      </Link>
                      <Link
                        className="dropdown-item"
                        href="/user/profile"
                        onClick={handleMobileMenuItemClick}
                      >
                        Profile Settings
                      </Link>
                      <Link
                        className="dropdown-item"
                        href="#"
                        onClick={handleLogout}
                      >
                        Logout
                      </Link>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
