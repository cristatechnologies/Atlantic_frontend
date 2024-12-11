"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
// import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { toast } from "react-toastify";
import StarRatings from "react-star-ratings";



const BusinessDashboardComponent = () => {
  const [length, setLength] = useState(null);
  const [change, setChange] = useState(false);
  const [change1, setChange1] = useState(false);
   const [reviews, setReviews] = useState([]);
   const [slug,setSlug] = useState("")
  
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem("auth"));
        const token = auth?.access_token;
        setSlug(auth?.user?.business?.slug);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/daily-offers?token=${token}`
        );
        setLength(response.data.length);
      } catch (error) {
        console.error("Error fetching offers:", error);
        toast.error("Failed to fetch offers");
      }
    };

    fetchOffers();
  }, []);

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


   useEffect(() => {
     // Replace with your actual API endpoint

       const auth = JSON.parse(localStorage.getItem("auth") || "null");
       const token = auth?.access_token;
       const id = auth?.user?.business?.id
     const fetchReviews = async () => {
       try {
         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/user/business-reviews/${id}?token=${token}`);
         const data = await response.json();
         setReviews(data.reviews);
       } catch (error) {
         console.error("Failed to fetch reviews", error);
       }
     };

     fetchReviews();
   }, []);

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
                <Link href="/business-gallery">
                  <i className="feather-user" /> <span>Your Gallery</span>
                </Link>
              </li>
              <li>
                <Link href="/your-deals">
                  <i className="feather-list" /> <span>Your Deals</span>
                </Link>
              </li>
              <li>
                <Link href={`/business-details/${slug}`}>
                  <i className="feather-list" /> <span>Your Page</span>
                </Link>
              </li>
              <li>
                <Link href="/login">
                  <i className="feather-power" />
                  <span onClick={handleLogout}>Logout</span>
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
            <div className="row dashboard-info">
              {/* <div className="col-lg-6 d-flex">
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
              </div> */}
              <div className="col-lg-12 d-flex">
                <div className="card dash-cards w-100">
                  <div className="card-header">
                    <h4>Visitor Review</h4>
                    {/* <div className="card-dropdown">
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
                    </div> */}
                  </div>
                  <div className="card-body">
                    {reviews.length > 0 ? (
                      <ul className="review-list">
                        {reviews.map((review) => (
                          <li key={review.id} className="review-box">
                            <div className="review-profile">
                              <div className="review-img">
                                <img
                                  src={
                                    review.user.image
                                      ? `${process.env.NEXT_PUBLIC_BASE_URL}${review.user.image}`
                                      : "/img/pngegg.png"
                                  } // Fallback image if null
                                  className="img-fluid"
                                  alt={review.user.name}
                                />
                              </div>
                            </div>
                            <div className="review-details">
                              <h6>{review.user.name}</h6>
                              <div className="rating-star">
                                <StarRatings
                                  rating={review?.rating || 0}
                                  starRatedColor="#FFD700"
                                  starDimension="18px"
                                  starSpacing="0.1px"
                                  numberOfStars={5}
                                  name="rating"
                                />
                              </div>
                              {/* <div>by: {review.user.name}</div> */}

                              <p>{review.reviews}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No reviews found.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessDashboardComponent;
