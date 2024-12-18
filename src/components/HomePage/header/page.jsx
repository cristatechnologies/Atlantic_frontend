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
import { useRef } from "react";


export const useClickOutside = (handler) => {
  const ref = useRef(null);

  useEffect(() => {
    const checkIfClickedOutside = (event) => {
      // If the dropdown is open and the click is outside
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };

    // Add event listener
    document.addEventListener("mousedown", checkIfClickedOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [handler]);

  return ref;
};
const Header = ({ parms }) => {
  const [authData, setAuthData] = useState(null);
  const [drops, setDrops] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const router = useRouter();
  const [logo, setLogo] = useState("");
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const [slug, setSlug] = useState("");
  // useEffect(() => {
  //   const settings = localStorage.getItem("settings");
  //   setLogo(JSON.parse(settings?.logo));
  //   console.log(settings.logo);
  //   console.log("log of the logo is ", settings.logo);
  // });
  const dropdownRef = useClickOutside(() => {
    setDrops(false);
  });

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.access_token;
    setSlug(auth?.user?.business?.slug);
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

    handleDropdownItemClick();
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

  const handleDropdownItemClick = () => {
    setDrops(false); // Close the dropdown
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

  // Function to handle clicks outside of dropdown
 useEffect(() => {
   // Ensure this code runs only on the client side (browser)
   if (typeof window !== "undefined") {
     const handleDropdownOutsideClick = () => {
       const dropdownMenu = document.querySelector(
         ".dropdown-menu.dropdown-menu-end"
       );

       document.addEventListener("click", (event) => {
         if (!dropdownMenu) return;

         const isDropdownOpen = dropdownMenu.classList.contains("show");
         const isClickInsideDropdown = dropdownMenu.contains(event.target);

         if (isDropdownOpen && !isClickInsideDropdown) {
           dropdownMenu.classList.remove("show");
         }
       });
     };

     handleDropdownOutsideClick();

     // Cleanup the event listener on component unmount
     return () => {
       document.removeEventListener("click", handleDropdownOutsideClick);
     };
   }
 }, []); 

  // Call the function to set up the event listener

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
                    style={{ width: "170px", height: "auto" }}
                    alt="Logo"
                    className=""
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
                {/*mobile  business */}
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
                        {/* <li>
                          <Link
                            href="/user/review"
                            onClick={handleMobileMenuItemClick}
                          >
                            <i className="fas fa-columns"></i> Reviews
                          </Link>
                        </li> */}
                        <li>
                          <Link
                            href={`/business-details/${slug}`}
                            onClick={handleMobileMenuItemClick}
                          >
                            <i className="fas fa-user-cog"></i> My Account
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/business-gallery"
                            onClick={handleMobileMenuItemClick}
                          >
                            <i className="fas fa-user-cog"></i>Gallery
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/user/my-offers"
                            onClick={handleMobileMenuItemClick}
                          >
                            <i className="fas fa-user-cog"></i> My Offers
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/user/profile"
                            onClick={handleMobileMenuItemClick}
                          >
                            <i className="fas fa-user-cog"></i> Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/change-password"
                            onClick={handleMobileMenuItemClick}
                          >
                            <i className="fas fa-handshake"></i> Change Password
                          </Link>
                        </li>
                        {/* <li>
                          <Link
                            href="/user/notifications"
                            onClick={handleMobileMenuItemClick}
                          >
                            <i className="fas fa-handshake"></i> Notifications
                          </Link>
                        </li> */}
                        {/* <li>
                          <Link
                            href="/user/delete-account"
                            onClick={handleMobileMenuItemClick}
                          >
                            <i className="fas fa-handshake"></i> Delete Account
                          </Link>
                        </li> */}
                      </ul>
                    </li>
                  </>
                )}
                {/*mobile user */}
                {isLoggedIn && userType === 2 && (
                  <>
                    <li className="d-lg-none has-submenu" ref={dropdownRef}>
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
                            href="/user/profile"
                            onClick={handleMobileMenuItemClick}
                          >
                            <i className="fas fa-user-cog"></i> Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/change-password"
                            onClick={handleMobileMenuItemClick}
                          >
                            <i className="fas fa-user-cog"></i> Change Password
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/user/notifications"
                            onClick={handleMobileMenuItemClick}
                          >
                            <i className="fas fa-user-cog"></i> Notifications
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/user/delete-account"
                            onClick={handleMobileMenuItemClick}
                          >
                            <i className="fas fa-user-cog"></i> Delete Account
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </>
                )}
                {!isLoggedIn && (
                  <>
                    <li className="d-lg-none">
                      <Link href="/signup" onClick={handleMobileMenuItemClick}>
                        Sign Up
                      </Link>
                    </li>
                    <li className="d-lg-none">
                      <Link href="/login" onClick={handleMobileMenuItemClick}>
                        Sign In
                      </Link>
                    </li>
                  </>
                )}
                {isLoggedIn && (
                  <li className="d-lg-none">
                    <Link onClick={handleLogout} href="#">
                      Signout
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
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${logo}`}
                  alt="logo"
                  className="headerLogo"
                />
              </Link>
            </div>

            <ul className="nav header-navbar-rht">
              {!isLoggedIn ? (
                <>
                  <li>
                    <Link
                      className="nav-link header-reg"
                      href="/signup"
                      onClick={handleMobileMenuItemClick}
                    >
                      Sign Up
                    </Link>
                  </li>
                  <li>
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
              )}
              {/*business desktop */}
              {isLoggedIn && userType === 1 && (
                <>
                  <li
                    className="nav-item dropdown has-arrow logged-item "
                    ref={dropdownRef}
                  >
                    <Link
                      href="#"
                      className={`dropdown-toggle profile-userlink ${
                        drops ? "show" : ""
                      }`}
                      onClick={() => setDrops(!drops)}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"

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
                    <div className="dropdown-menu dropdown-menu-end show">
                      {/* <Link
                        className="dropdown-item"
                        href="/user/review"
                        onClick={handleMobileMenuItemClick}
                      >
                        Review
                      </Link> */}

                      <Link
                        className="dropdown-item"
                        href={`/business-details/${slug}`}
                        onClick={handleMobileMenuItemClick}
                      >
                        My Account{" "}
                      </Link>
                      <Link
                        className="dropdown-item"
                        href="/business-gallery"
                        onClick={handleMobileMenuItemClick}
                      >
                        Gallery{" "}
                      </Link>
                      <Link
                        className="dropdown-item"
                        href="/my-offers"
                        onClick={handleMobileMenuItemClick}
                      >
                        My Offers{" "}
                      </Link>
                      <Link
                        className="dropdown-item"
                        href="/user/profile"
                        onClick={handleMobileMenuItemClick}
                      >
                        Profile
                      </Link>

                      <Link
                        className="dropdown-item"
                        href="/change-password"
                        onClick={handleMobileMenuItemClick}
                      >
                        Change Password{" "}
                      </Link>
                      <Link
                        className="dropdown-item"
                        href="#"
                        onClick={handleLogout}
                      >
                        Signout{" "}
                      </Link>
                    </div>
                  </li>
                </>
              )}
              {/*user desktop */}
              {isLoggedIn && userType === 2 && (
                <>
                  <li
                    className="nav-item dropdown has-arrow logged-item"
                    ref={dropdownRef}
                  >
                    <Link
                      href="#"
                      className={`dropdown-toggle profile-userlink ${
                        drops ? "show" : ""
                      }`}
                      onClick={() => setDrops(!drops)}
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
                    <div className="dropdown-menu dropdown-menu-end show">
                      <Link
                        className="dropdown-item"
                        href="/user/profile"
                        onClick={handleMobileMenuItemClick}
                      >
                        Profile 
                      </Link>
                      <Link
                        className="dropdown-item"
                        href="/change-password"
                        onClick={handleMobileMenuItemClick}
                      >
                        Change Password
                      </Link>
                      <Link
                        className="dropdown-item"
                        href="/user/notifications"
                        onClick={handleMobileMenuItemClick}
                      >
                      Notifications
                      </Link>{" "}
                      <Link
                        className="dropdown-item"
                        href="/user/delete-account"
                        onClick={handleMobileMenuItemClick}
                      >
                      Delete Account
                      </Link>{" "}
                      <Link
                        className="dropdown-item"
                        href="#"
                        onClick={handleLogout}
                      >
                        Signout
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
