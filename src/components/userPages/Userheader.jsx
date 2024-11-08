import React, { useState } from "react";
import HomeMenu from "../common/HomeMenu";
import ListingMenu from "../common/Categories";
import PagesMenu from "../common/PagesMenu";
import UserPagesMenu from "../common/UserPagesMenu";
import BlogMenu from "../common/BlogMenu";
import { LogoSvg, profile_img } from "../imagepath";
import Link from "next/link";




const UserHeader = ({parms}) => {
    const [drops,setDrops]=useState(false);
    return (
        <>
            {/* Header */}
            <header className="header">
                <div className="container">
                    <nav className="navbar navbar-expand-lg header-nav">
                        <div className="navbar-header">
                            <Link id="mobile_btn" href ="#">
                                <span className="bar-icon">
                                    <span />
                                    <span />
                                    <span />
                                </span>
                            </Link>
                            <Link href ="/index" className="navbar-brand logo">
                                <img src= "./img/logo.svg" className="img-fluid" alt="Logo" />
                            </Link>
                        </div>
                        <div className="main-menu-wrapper">
                            <div className="menu-header">
                                <Link href ="/index" className="menu-logo">
                                    <img src= "./img/logo.svg" className="img-fluid" alt="Logo" />
                                </Link>
                                <Link
                                    id="menu_close"
                                    className="menu-close"
                                    href ="#"
                                >
                                    {" "}
                                    <i className="fas fa-times" />
                                </Link>
                            </div>
                            <ul className="main-nav">
                                <HomeMenu activeMenu={"Classified"} />
                                <ListingMenu />
                                <PagesMenu />
                                <UserPagesMenu activesMenu={parms}/>
                                <BlogMenu />
                                <li>
                                    <Link href ="/contact">Contact</Link>
                                </li>
                                <li className="login-link">
                                    <Link href ="/signup">Sign Up</Link>
                                </li>
                                <li className="login-link">
                                    <Link href ="login">Sign In</Link>
                                </li>
                            </ul>
                        </div>
                        <ul className="nav header-navbar-rht">
                            <li className="nav-item">
                                <Link
                                    className="nav-link header-login add-listing"
                                    href ="/add-listing"
                                >
                                    <i className="fa-solid fa-plus" /> Add Listing
                                </Link>
                            </li>
                            <li className="nav-item dropdown has-arrow logged-item">
                                <Link
                                    href ="#"
                                    className={`${drops===true ?"dropdown-toggle profile-userlink show " :"dropdown-toggle profile-userlink"}`}
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    onClick={()=>setDrops(!drops)}
                                    // className={`${change1===true ? 'dropdown-menu dropdown-menu-end show' : "dropdown-menu dropdown-menu-end"}`}
                                >
                                    <img src={profile_img} alt="" />
                                    <span>John Doe</span>
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end">
                                    <Link className="dropdown-item" href ="/dashboard">
                                        Dashboard
                                    </Link>
                                    <Link className="dropdown-item" href ="/profile">
                                        Profile Settings
                                    </Link>
                                    <Link className="dropdown-item" href ="/login">
                                        Logout
                                    </Link>
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
            {/* /Header */}
        </>

    );
}
export default UserHeader;