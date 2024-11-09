"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
// import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { toast } from "react-toastify"; 
import { useRouter } from "next/navigation";


const UserDashboardComponent = () => {
  const [length, setLength] = useState(null);
  const [change, setChange] = useState(false);
  const [change1, setChange1] = useState(false);
 const router = useRouter();

  
  
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
    <>
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center text-center">
            <div className="col-md-12 col-12">
              <h2 className="breadcrumb-title">Dashboard</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Dashboard
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadscrumb Section */}
      {/* Dashboard Content */}
      <div className="dashboard-content">
        <div className="container">
          <div className="">
            <ul className="dashborad-menus">
              <li className="active">
                <Link href="/user/dashboard">
                  <i className="feather-grid" /> <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link href="/user/profile">
                  <i className="feather-user" /> <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link href="/active-deals">
                  <i className="feather-list" /> <span>Active Deals</span>
                </Link>
              </li>

              <li>
                <Link href="/login">
                  <i className="feather-power" />{" "}
                  <a onClick={handleLogout}>Logout</a>
                </Link>
              </li>
            </ul>
          </div>
          <div className="dashboard-details">
            {/* <div className="row">
                <div className="col-lg-3 col-md-3">
                  <div className="card dash-cards">
                    <div className="card-body">
                      <div className="dash-top-content">
                        <div className="dashcard-img">
                          <img
                            src={"/img/icons/verified.svg"}
                            className="img-fluid"
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="dash-widget-info">
                        <h6>Active Listing</h6>
                        <h3 className="counter">{length}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3">
                  <div className="card dash-cards">
                    <div className="card-body">
                      <div className="dash-top-content">
                        <div className="dashcard-img">
                          <img
                            src={"/img/testIcon/blog-writing-svgrepo-com.svg"}
                            className="img-fluid"
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="dash-widget-info">
                        <h6>Total Reviews</h6>
                        <h3>15230</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3">
                  <div className="card dash-cards">
                    <div className="card-body">
                      <div className="dash-top-content">
                        <div className="dashcard-img">
                          <img src={"chat"} className="img-fluid" alt="" />
                        </div>
                      </div>
                      <div className="dash-widget-info">
                        <h6>Messages</h6>
                        <h3>15</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3">
                  <div className="card dash-cards">
                    <div className="card-body">
                      <div className="dash-top-content">
                        <div className="dashcard-img">
                          <img
                            src={"/img/testIcon/blog-writing-svgrepo-com.svg"}
                            className="img-fluid"
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="dash-widget-info">
                        <h6>Bookmark</h6>
                        <h3>30</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            {/* <div className="row dashboard-info">
              <div className="col-lg-6 d-flex">
                <div className="card dash-cards w-100">
                  <div className="card-header">
                    <h4>Page Views</h4>
                    <div className="card-dropdown">
                      <ul>
                        <li className="nav-item dropdown has-arrow logged-item">
                          <Link
                            href="#"
                            className="dropdown-toggle pageviews-link"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            onClick={() => setChange(!change)}
                          >
                            <span>This week</span>
                          </Link>
                          <div
                            className={`${
                              change === true
                                ? "dropdown-menu dropdown-menu-end show"
                                : "dropdown-menu dropdown-menu-end"
                            }`}
                          >
                            <Link
                              className="dropdown-item"
                              href="javascript:void();"
                            >
                              Next Week
                            </Link>
                            <Link
                              className="dropdown-item"
                              href="javascript:void()"
                            >
                              Last Month
                            </Link>
                            <Link
                              className="dropdown-item"
                              href="javascript:void()"
                            >
                              Next Month
                            </Link>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card-body">
                      <div id="review-chart">
                        <ReactApexChart
                          options={optionss}
                          series={optionss.series}
                          type="radar"
                          height={350}
                        />
                      </div>
                    </div>
                </div>
              </div>
              <div className="col-lg-6 d-flex">
                <div className="card dash-cards w-100">
                  <div className="card-header">
                    <h4>Visitor Review</h4>
                    <div className="card-dropdown">
                      <ul>
                        <li className="nav-item dropdown has-arrow logged-item">
                          <Link
                            href="#"
                            className="dropdown-toggle pageviews-link"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            onClick={() => setChange1(!change1)}
                          >
                            <span>All Listing</span>
                          </Link>
                          <div
                            className={`${
                              change1 === true
                                ? "dropdown-menu dropdown-menu-end show"
                                : "dropdown-menu dropdown-menu-end"
                            }`}
                          >
                            <Link className="dropdown-item" href="#">
                              Next Week
                            </Link>
                            <Link className="dropdown-item" href="#">
                              Last Month
                            </Link>
                            <Link className="dropdown-item" href="#">
                              Next Month
                            </Link>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="card-body">
                    <ul className="review-list">
                      <li className="review-box">
                        <div className="review-profile">
                          <div className="review-img">
                            <img
                              src={"ProfileAvatar11"}
                              className="img-fluid"
                              alt="img"
                            />
                          </div>
                        </div>
                        <div className="review-details">
                          <h6>Joseph</h6>
                          <div className="rating">
                            <div className="rating-star">
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                            </div>
                            <div>
                                <i className="fa-sharp fa-solid fa-calendar-days" />{" "}
                                4 months ago
                              </div>
                            <div>by: Demo Test</div>
                          </div>
                          <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. It has been the industry's
                            standard dummy.
                          </p>
                        </div>
                      </li>
                      <li className="review-box">
                        <div className="review-profile">
                          <div className="review-img">
                            <img
                              src={"ProfileAvatar01"}
                              className="img-fluid"
                              alt="img"
                            />
                          </div>
                        </div>
                        <div className="review-details">
                          <h6>Dev</h6>
                          <div className="rating">
                            <div className="rating-star">
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                              <i className="fas fa-star filled" />
                            </div>
                            <div>
                                <i className="fa-sharp fa-solid fa-calendar-days" />{" "}
                                4 months ago
                              </div>
                            <div>by: Demo Test</div>
                          </div>
                          <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. It has been the industry's
                            standard dummy.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboardComponent;
