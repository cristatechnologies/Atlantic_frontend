"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";

import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setupAction } from "@/store/websiteSetup";
import Image from "next/image";
import Categories from "../../common/Categories";
import { useRef } from "react";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";

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
  const menuRef = useRef(null);
  const websiteData = useSelector((state) => state.websiteSetup.data);
  const [authData, setAuthData] = useState(null);
  const [drops, setDrops] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const router = useRouter();
  const [logo, setLogo] = useState("");
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const [slug, setSlug] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileCategories, setMobileCategories] = useState(false);
  const [dropdownState, setDropdownState] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // useEffect(() => {
  //   const settings = localStorage.getItem("settings");
  //   setLogo(JSON.parse(settings?.logo));
  //   console.log(settings.logo);
  //   console.log("log of the logo is ", settings.logo);
  // });
  const dropdownRef = useClickOutside(() => {
    setDrops(false);
    setMobileDropdown(false);
  });

  const handleModalClose = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const handleItemClick = () => {
    // Close the dropdown when an item is clicked
    setMobileCategories(false);
    onhandleCloseMenu();
  };

  const dropdownClickHandler = () => {
    // Close the dropdown when an item is clicked
    setDropdownState(false);
    onhandleCloseMenu();
  };

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        handleModalClose();
      }
    };

    if (showDeleteModal) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showDeleteModal, handleModalClose]);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.access_token;
    setSlug(auth?.user?.business?.slug);
    const settings = localStorage.getItem("settings");
    if (settings) {
      const settingsData = JSON.parse(settings);
      setLogo(settingsData?.logo);
    }
  }, []);

  const handleDeleteAccount = async () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.access_token;

    if (token) {
      axios
        .delete(`${process.env.NEXT_PUBLIC_BASE_URL}api/user/remove-account`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          toast.success("Account deleted successfully");
          localStorage.removeItem("auth");
          setIsLoggedIn(false);
          setUserType(null);
          setShowDeleteModal(false);
          router.push("/login");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to delete account");
          setShowDeleteModal(false);
        });
    }
  };

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

  // const onHandleMobileMenu = () => {
  //   var root = document.getElementsByTagName("html")[0];
  //   root.classList.add("menu-opened");
  // };

  const handleMobileMenuItemClick = () => {
    // Close both mobile dropdown and main mobile menu
    setTimeout(() => setDrops(false), 300);
    setMobileDropdown(false);
    // handleDropdownItemClick();
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
      // Check if we clicked outside the menu wrapper
      if (
        document.documentElement.classList.contains("menu-opened") && // Check if menu is open
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest("#mobile_btn") // Exclude the mobile menu button
      ) {
        onhandleCloseMenu();
      }
    };

    // Add both mouse and touch events
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      // Clean up
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  //  const onHandleMobileMenu = () => {
  //    setIsMenuOpen(!isMenuOpen);
  //    toggleMobileMenu(!isMenuOpen);
  //  };

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

  const onHandleMobileMenu = (e) => {
    e?.preventDefault();
    var root = document.documentElement;
    if (!root.classList.contains("menu-opened")) {
      root.classList.add("menu-opened");
    }
  };

  const onhandleCloseMenu = () => {
    var root = document.documentElement;
    root.classList.remove("menu-opened");
    setMobileDropdown(false);
    setMobileCategories(false);
    setDropdownState(false);
  };

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768); // Adjust the width as needed
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call initially to set the state based on the initial screen size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Call the function to set up the event listener

  return (
    <header className="header w-full">
      <style jsx>{``}</style>
      <div className="" style={{ marginLeft: "3px", marginRight: "10px" }}>
        <div className=" w-full">
          <nav className="navbar navbar-expand-lg header-nav w-full">
            <div className="main-menu-wrapper" ref={menuRef}>
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
                <li
                  className={`custom-dropdown ${isDropdownOpen ? "open" : ""}`}
                  ref={dropdownRef}
                >
                  <Link
                    className={`dropdown-item ${
                      isSmallScreen
                        ? `submenu ${dropdownState ? "show" : ""}`
                        : ""
                    }`}
                    onClick={toggleDropdown}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "inherit",
                      fontFamily: "inherit",
                      fontWeight: "600",
                    }}
                    href={"#"}
                  >
                    Categories
                  </Link>
                  <div className="category-dropdown-menu ">
                    {websiteData?.businessCategories.map((item, index) => (
                      <div
                        key={index}
                        className="category-dropdown-item-wrapper "
                      >
                        <Link
                          className="dropdown-item"
                          href={`/categories/${item.slug}`}
                          onClick={() => {
                            handleItemClick();
                            closeDropdown();
                          }}
                        >
                          {item.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                </li>
                <li className="d-lg-none has-submenu">
                  <a
                    className="mobile-category-menu category-userlink"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMobileCategories(!mobileCategories);
                    }}
                    href="#"
                  >
                    <div className="category-info">
                      <div className="category-info-left">
                        <span className="category-name">Categories</span>
                      </div>
                      <i
                        className={`feather-arrow-${
                          mobileCategories ? "up" : "down"
                        }`}
                      ></i>
                    </div>
                  </a>
                  <ul
                    className={`category-submenu ${
                      mobileCategories ? "show" : ""
                    }`}
                  >
                    {websiteData?.businessCategories.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={`/categories/${item.slug}`}
                          onClick={() => {
                            handleItemClick();
                            setMobileCategories(false);
                          }}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <Link
                    href="/active-offers"
                    onClick={handleMobileMenuItemClick}
                  >
                    Active Offers{" "}
                  </Link>
                </li>
                {/*mobile business */}

                {isLoggedIn && userType === 1 && (
                  <li className="d-lg-none has-submenu">
                    <a
                      className="mobile-user-menu profile-userlink cocolorBlacklor"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDropdownState(!dropdownState);
                      }}
                      href="/categories"
                    >
                      <div className="user-info">
                        <div className="user-info-left">
                          <img
                            src={
                              authData.user.image
                                ? `${process.env.NEXT_PUBLIC_BASE_URL}${authData?.user?.image}`
                                : "/img/pngegg.png"
                            }
                            alt="User profile"
                          />
                          <span className="user-name">
                            {authData.user?.name}
                          </span>
                        </div>
                        <i
                          className={`feather-arrow-${
                            dropdownState ? "up" : "down"
                          }`}
                        ></i>
                      </div>
                    </a>
                    <ul
                      className={`submenu ${dropdownState ? "show" : ""}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <li>
                        <Link
                          onClick={dropdownClickHandler}
                          href={`/business-details/${slug}`}
                        >
                          My Account
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={dropdownClickHandler}
                          href="/business-gallery"
                        >
                          Gallery
                        </Link>
                      </li>
                      <li>
                        <Link onClick={dropdownClickHandler} href="/my-offers">
                          My Offers
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={dropdownClickHandler}
                          href="/user/profile"
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={dropdownClickHandler}
                          href="/change-password"
                        >
                          Change Password
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={(e) => {
                            dropdownClickHandler();
                            setShowDeleteModal(true);
                          }}
                          href="#"
                        >
                          Delete Account
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
                {/*mobile user */}
                {/*add the add business for small screen*/}
                {isLoggedIn && userType === 2 && (
                  <>
                    <li className="d-lg-none has-submenu">
                      <a
                        className="mobile-user-menu profile-userlink cocolorBlacklor"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDropdownState(!dropdownState);
                        }}
                        href="/categories"
                      >
                        <div className="user-info">
                          <div className="user-info-left">
                            <img
                              src={
                                authData.user.image
                                  ? `${process.env.NEXT_PUBLIC_BASE_URL}${authData?.user?.image}`
                                  : "/img/pngegg.png"
                              }
                              alt="User profile"
                            />
                            <span className="user-name">
                              {authData.user?.name}
                            </span>
                          </div>
                          <i
                            className={`feather-arrow-${
                              dropdownState ? "up" : "down"
                            }`}
                          ></i>
                        </div>
                      </a>
                      <ul
                        className={`submenu ${dropdownState ? "show" : ""}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <li>
                          <Link
                            onClick={dropdownClickHandler}
                            href="/user/profile"
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            onClick={dropdownClickHandler}
                            href="/change-password"
                          >
                            Change Password
                          </Link>
                        </li>
                        <li>
                          <Link
                            onClick={dropdownClickHandler}
                            href="/user/notifications"
                          >
                            Notifications
                          </Link>
                        </li>
                        <li>
                          <Link
                            onClick={(e) => {
                              e.preventDefault();
                              setShowDeleteModal(true);
                              handleItemClick();
                            }}
                            href="#"
                          >
                            Delete Account
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
            {isLoggedIn && userType === 2 ? (
            <div className="navbar-header-2">
              <div >
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
              </div>
              <div>

           
              <Link href="/" className="">
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${logo}`}
                  alt="logo"
                  className="headerLogo"
                  style={{paddingLeft:"30px"}}
                />
              </Link>
              </div>
             
              <div className="d-lg-none">
                <Link
                  href="/user/add-business"
                  onClick={handleMobileMenuItemClick}             
                >
                  <img
                    src="/Add business 1.png"
                    alt="Add Business"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "contain",
                    }}
                  />
                </Link>
              </div>
            
            </div>):
           (  <div className="navbar-header">
              
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
        
             
        
            </div>)}

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
                      <Link
                        className="dropdown-item"
                        href={`/business-details/${slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setTimeout(() => setDrops(false), 300);
                          router.push(`/business-details/${slug}`);
                        }}
                      >
                        My Account
                      </Link>
                      <Link
                        className="dropdown-item"
                        href="/business-gallery"
                        onClick={(e) => {
                          e.preventDefault();
                          setTimeout(() => setDrops(false), 300);
                          router.push("/business-gallery");
                        }}
                      >
                        Gallery
                      </Link>
                      <Link
                        className="dropdown-item"
                        href="/my-offers"
                        onClick={(e) => {
                          e.preventDefault();
                          setTimeout(() => setDrops(false), 300);
                          router.push("/my-offers");
                        }}
                      >
                        My Offers
                      </Link>
                      <Link
                        className="dropdown-item"
                        href="/user/profile"
                        onClick={(e) => {
                          e.preventDefault();
                          setTimeout(() => setDrops(false), 300);
                          router.push("/user/profile");
                        }}
                      >
                        Profile
                      </Link>
                      <Link
                        className="dropdown-item"
                        href="/change-password"
                        onClick={(e) => {
                          e.preventDefault();
                          setTimeout(() => setDrops(false), 300);
                          router.push("/change-password");
                        }}
                      >
                        Change Password
                      </Link>
                      <Link
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setTimeout(() => setDrops(false), 300);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete Account
                      </Link>
                      <Link
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setTimeout(() => setDrops(false), 300);
                          handleLogout(e);
                        }}
                      >
                        Signout
                      </Link>
                    </div>
                  </li>
                </>
              )}
              {/*user desktop */}
              {isLoggedIn && userType === 2 && (
                <>
                  <li className="d-lg-only">
                    <Link
                      href="/user/add-business"
                      onClick={handleMobileMenuItemClick}
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src="/Add business 1.png"
                        alt="Add Business"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "contain",
                        }}
                      />
                    </Link>
                  </li>
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
                        href="/user/profile"
                        className="dropdown-item"
                        onClick={(e) => {
                          e.preventDefault();
                          setTimeout(() => setDrops(false), 300);

                          router.push("/user/profile");
                        }}
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
                      {/* <Link
                        className="dropdown-item"
                        href="/user/add-business"
                        onClick={handleMobileMenuItemClick}
                      >
                      Add Business
                      </Link>{" "} */}
                      <Link
                        className="dropdown-item"
                        href="/user/notifications"
                        onClick={handleMobileMenuItemClick}
                      >
                        Notifications
                      </Link>{" "}
                      <Link
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setTimeout(() => setDrops(false), 300);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete Account
                      </Link>
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
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </header>
  );
};

export default Header;
