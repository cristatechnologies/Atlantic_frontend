"use client";

import React, { useState } from "react";
import Link from "next/link";
import BlogMenu from "../../common/BlogMenu";
import HomeMenu from "../../common/HomeMenu";
import ListingMenu from "../../common/ListingMenu";
import PagesMenu from "../../common/PagesMenu";
import UserPagesMenu from "../../common/UserPagesMenu";
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import Image from "next/image";
const Header = ({ parms }) => {
  const [authData, setAuthData] = useState(null);
  const [drops, setDrops] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const router = useRouter();
  const [logo, setLogo] = useState("");
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
  }, []);
  console.log("the log of the logo is ", logo);

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

  const onhandleCloseMenu = () => {
    var root = document.getElementsByTagName("html")[0];
    root.classList.remove("menu-opened");
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
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  return (
    <header className="header " onClick={(value) => toggleMobileMenu()}>
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
            <Link href="/" className="navbar-brand logo">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}${logo}`}
                alt="logo"
                width={200}
                height={100}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </Link>
          </div>
          <div className="main-menu-wrapper">
            <div className="menu-header">
              <Link href="/" className="menu-logo">
                <img src={`${logo}`} className="img-fluid" alt="Logo" />
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
              <li>
                <Link href="/">Home</Link>
              </li>
              {/* <ListingMenu activeMenu={parms} />
              <PagesMenu activeMenus={parms} />
              <UserPagesMenu />
              <BlogMenu activesMenus={parms} /> */}
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/about-us">About Us</Link>
              </li>
              <li>
                <Link href="/faq">FAQs</Link>
              </li>
              {!isLoggedIn && (
                <>
                  <li className="login-link">
                    <Link href="/signup">Sign Up</Link>
                  </li>
                  <li className="login-link">
                    <Link href="/login">Sign In</Link>
                  </li>
                </>
              )}
              {isLoggedIn && (
                <li className="login-link">
                  <button onClick={handleLogout}>Logout</button>
                </li>
              )}
            </ul>
          </div>
          <ul className="nav header-navbar-rht">
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link header-reg" href="/signup">
                    Sign Up
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link header-login" href="/login">
                    Sign In
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <a
                  className="nav-link header-login"
                  href="#"
                  onClick={handleLogout}
                >
                  Logout
                </a>
              </li>
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
                      src={authData?.user?.image || "/img/pngegg.png"}
                      alt="User profile"
                    />

                    <span>{authData.user?.name}</span>
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end">
                    <Link className="dropdown-item" href="/user/dashboard">
                      Dashboard
                    </Link>
                    <Link className="dropdown-item" href="/user/profile">
                      Profile Settings
                    </Link>
                    {/* <Link className="dropdown-item" href="/login">
                      Logout
                    </Link> */}
                  </div>
                </li>
              </>
            )}

            {isLoggedIn && userType === 2 && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link header-login add-listing"
                    href="/add-listing"
                  >
                    <i className="fa-solid fa-plus"></i> Add Listing
                  </Link>
                </li>
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
                      src={authData?.user?.image || "/img/pngegg.png"}
                      alt="User profile"
                    />

                    <span>{authData.user?.name}</span>
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end">
                    <Link className="dropdown-item" href="/user/dashboard">
                      Dashboard
                    </Link>
                    <Link className="dropdown-item" href="/user/profile">
                      Profile Settings
                    </Link>
                    {/* <Link className="dropdown-item" href="/login">
                      Logout
                    </Link> */}
                  </div>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
