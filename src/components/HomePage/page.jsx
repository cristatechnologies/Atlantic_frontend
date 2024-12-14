"use client";
import React from "react";

import Carousel from "./slider/Carousel";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "./select/page";
import Banner from "../common/Banner";
import { Flex } from "antd";
import LocationInput from "./LocationInput";
import CarouselActiveDeals from "./Carousel-Active-deals";


const HomePage = () => {
  const [isLight, setIsLight] = useState();
  const [businessData, setBusinessData] = useState(null);
  const [categories, setCategories] = useState();
  const dispatch = useDispatch();
  const [latestBusiness, setLatestBusiness] = useState();
  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [apiData, setApiData] = useState("");
  const router = useRouter();
  const [bgImageUrl, setBgImageUrl] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [dailyOffers, setDailyOffers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [fallbackBusinessData, setFallbackBusinessData] = useState(null);

  // Fetch fallback business data
  const fetchFallbackBusinessData = async () => {
    try {
      const response = await axios.get(`${baseUrl}api/business`);
      if (response.data) {
        setFallbackBusinessData(response.data);
        // If no location-based data, use fallback
        if (!businessData) {
          setBusinessData(response.data);
        }
      }
    } catch (err) {
      console.log("Error fetching fallback business data:", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // Check if both searchText and selectedLocation are not empty
    if (searchText.trim() || selectedLocation) {
      const searchQuery = encodeURIComponent(searchText);
      const locationQuery = encodeURIComponent(selectedLocation);
      router.push(
        `/search-results?query=${searchQuery}&location=${locationQuery}`
      );
    }
  };

  const websiteData = useSelector((state) => state.websiteSetup.data);
  console.log("website data in the homepage ", websiteData);
  useEffect(() => {
    const test = () => {
      setCategories(websiteData?.businessCategories);
    };

    test();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const handleSwitchClick = () => {
      setIsLight((prevState) => !prevState);
    };

    const handleScroll = () => {
      const progressWrap = document.querySelector(".progress-wrap");
      const progressPath = document.querySelector(".progress-wrap path");

      if (progressPath) {
        const pathLength = progressPath.getTotalLength();
        const scrollTop = window.scrollY;
        const docHeight = document.body.clientHeight - window.innerHeight;
        const pctScrolled = scrollTop / docHeight;
        const drawLength = pathLength - pctScrolled * pathLength;
        progressPath.style.strokeDashoffset = drawLength;
      }

      if (progressWrap) {
        if (window.scrollY > 50) {
          progressWrap.classList.add("active-progress");
        } else {
          progressWrap.classList.remove("active-progress");
        }
      }
    };

    const handleProgressClick = (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    const switchElem = document.querySelector(".switch");
    const progressWrap = document.querySelector(".progress-wrap");

    if (switchElem) {
      switchElem.addEventListener("click", handleSwitchClick);
    }

    window.addEventListener("scroll", handleScroll);

    if (progressWrap) {
      progressWrap.addEventListener("click", handleProgressClick);
    }

    return () => {
      if (switchElem) {
        switchElem.removeEventListener("click", handleSwitchClick);
      }
      window.removeEventListener("scroll", handleScroll);
      if (progressWrap) {
        progressWrap.removeEventListener("click", handleProgressClick);
      }
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("light", isLight);
    document.querySelector(".switch")?.classList.toggle("switched", isLight);
  }, [isLight]);

const getUserLocation = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchCityName(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        // If location is blocked, use fallback data
        fetchFallbackBusinessData();
      }
    );
  } else {
    // Geolocation not supported, use fallback data
    fetchFallbackBusinessData();
  }
};

const fetchCityName = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    const data = await response.json();
    const cityName = data.city || data.locality || "Unknown location";

    // Set user location and trigger business search
    setUserLocation({
      city: cityName,
      latitude,
      longitude,
    });

     setSelectedLocation(cityName);

    // Fetch businesses based on detected location
    fetchBusinessesByLocation(cityName);
  } catch (error) {
    console.error("Error fetching city name:", error);
    // If city name fetch fails, use fallback data
    fetchFallbackBusinessData();
  }
};
  const fetchBusinessesByLocation = async (location) => {
    try {
      const response = await axios.get(
        `${baseUrl}api/business?search=&location=${encodeURIComponent(
          location
        )}`
      );

      if (response.data && response.data.length > 0) {
        setBusinessData(response.data);
      } else {
        // If no businesses found for location, use fallback
        fetchFallbackBusinessData();
      }
    } catch (err) {
      console.log("Error fetching businesses by location:", err);
      // If API call fails, use fallback data
      fetchFallbackBusinessData();
    }
  };


  const handleLocationChange = (location) => {
    console.log("Selected location:", location);
    setSelectedLocation(location);
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/latest-business`
        );
        if (response) {
          setLatestBusiness(response.data);
        }
      } catch (err) {
        console.log(
          "An error occurred while fetching the data of the latest business"
        );
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api`
        );
        if (response) {
          setApiData(response.data);
        }
      } catch (err) {
        console.log("An error occurred while fetching the data from the api/");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/business`
        );
        if (response) {
          setBusinessData(response.data);
          setBusinessLength(setBusinessData.length);
        }
      } catch (err) {
        console.log("An error occurred while fetching the data");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Check if apiData and sliders array exist and have at least one item
    if (apiData && apiData.sliders && apiData.sliders.length > 0) {
      setBgImageUrl(`${baseUrl}${apiData.sliders[0].image}`); // Assuming 'imageUrl' is the key for the image path
    }
  }, [apiData]);

  useEffect(() => {
    // Fetch token from local storage on the client side

    const fetchDailyOffers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/daily-offers
`
        );
        setDailyOffers(response.data);
      } catch (error) {
        console.error("Error fetching daily offers:", error);
      }
    };

    fetchDailyOffers();
  }, []);

  return (
    <>
      {/* Banner Section */}

      <section
        className="banner-section position-relative banner-customMade banner-container"
        style={{
          backgroundImage: `url(${bgImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          // Default to cover for larger screens

          backgroundRepeat: "no-repeat",

          height: "auto",
          overflow: "hidden",
        }}
      ></section>

      {/* Mobile Search Section - Rendered below the banner */}
      {/* d-lg-none */}
      <section
        className="mobile-search-section"
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px 0",
        }}
      >
        <div className="container d-flex justify-content-center ">
          <div className="search-box lg-w-60 ">
            <form
              action="listing-grid-sidebar"
              className="d-flex flex-column flex-md-row" // Changed to allow row layout on medium screens and up
              onSubmit={handleSearch}
            >
              <div className="search-input flex-grow-1 me-md-2 mb-2 mb-md-0">
                {" "}
                {/* Added flex-grow and margin utilities */}
                <div className="form-group">
                  <div className="group-img">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="search-input flex-grow-1 me-md-2 mb-2 mb-md-0">
                {" "}
                {/* Added flex-grow and margin utilities */}
                <div className="form-group">
                  <div className="group-img">
                    <LocationInput
                      selectedLocation={selectedLocation}
                      onChange={setSelectedLocation}
                      onLocationChange={handleLocationChange}
                    />
                  </div>
                </div>
              </div>
              <div className="search-btn flex-shrink-0">
                {" "}
                {/* Added flex-shrink to prevent button from growing */}
                <button className="btn btn-primary w-100" type="submit">
                  <i className="fa fa-search" aria-hidden="true"></i> Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      {/* Banner Section */}
      {/* Banner Section */}
      {/* Category Section */}
      {/* <section className="category-section">
        <div className="container">
          <div className="section-heading">
            <div className="row align-items-center">
              <div
                className="col-md-6 aos aos-init aos-animate"
                data-aos="fade-up"
              >
                <h2>
                  Our <span className="title-left magentaCircle">Cat</span>
                  egory
                </h2>
                <p>Buy and Sell Everything from Used Our Top Category</p>
              </div>
              <div
                className="col-md-6 text-md-end aos aos-init aos-animate"
                data-aos="fade-up"
              >
                <Link href="/categories" className="btn  btn-view">
                  View All
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            {websiteData?.businessCategories &&
              websiteData?.businessCategories.map((item, i) => (
                <div className="col-lg-2 col-md-3 col-sm-6" key={i}>
                  <Link
                    href={`/categories/${item.id}`}
                    className="category-links"
                  >
                    <h5>{item.name}</h5>

                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_URL + item.image}`}
                      alt="icons"
                    />
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </section> */}
      {/* Category Section */}
      {/* Featured Ads Section */}
      <Carousel
        businessData={businessData}
        Heading={
          userLocation
            ? `Businesses Near ${userLocation.city}`
            : "Business Near You"
        }
      />
      {/* Featured Ads Section */}
      {/* Popular Location Section */}
      <CarouselActiveDeals
        dailyOffers={dailyOffers}
        color={`#ffff`}
        textColor={`${websiteData?.setting?.secondary_color}`}
        Heading={" Active Offers"}
      />
      {/* Popular Location Section */}
      {/* Latest ads Section */}
      {/* Latest ads Section */}
      {/* CTA Section */}
      {/* CTA Section */}
      {/* Client Testimonial Section */}
      {/* Client Testimonial Section */}
      {/* Partners Section */}
      {/* Partners Section */}
      {/* Pricing Plan Section */}
      {/* <section className="pricingplan-section">
          <div className="section-heading">
            <div className="container">
              <div className="row text-center">
                <h2>
                  Our Pricing <span>Pla</span>n
                </h2>
                <p>checkout these latest cool ads from our members</p>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-lg-3 d-flex col-md-6">
                <div className="price-card flex-fill">
                  <div className="price-head">
                    <div className="price-level">
                      <h6>Intro</h6>
                    </div>
                    <h4>
                      $10 <span>/ month</span>
                    </h4>
                  </div>
                  <div className="price-body">
                    <p>For most business that want to optimize web queries</p>
                    <ul>
                      <li className="active">Basic listing submission</li>
                      <li className="active">One Listing</li>
                      <li className="active">30 days Availabilty</li>
                      <li className="inactive">Limited Support</li>
                      <li className="inactive">Edit your listing</li>
                    </ul>
                    <div>
                      <Link href="/login" className="btn viewdetails-btn">
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 d-flex col-md-6">
                <div className="price-card flex-fill">
                  <div className="price-head">
                    <div className="price-level">
                      <h6>Basic</h6>
                    </div>
                    <h4>
                      $25 <span>/ month</span>
                    </h4>
                  </div>
                  <div className="price-body">
                    <p>For most business that want to optimize web queries</p>
                    <ul>
                      <li className="active">Basic listing submission</li>
                      <li className="active">One Listing</li>
                      <li className="active">30 days Availabilty</li>
                      <li className="inactive">Limited Support</li>
                      <li className="inactive">Edit your listing</li>
                    </ul>
                    <div>
                      <Link href="/login" className="btn viewdetails-btn">
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 d-flex col-md-6">
                <div className="price-card flex-fill">
                  <div className="price-head">
                    <div className="price-level">
                      <h6>Popular</h6>
                    </div>
                    <h4>
                      $50 <span>/ month</span>
                    </h4>
                  </div>
                  <div className="price-body">
                    <p>For most business that want to optimize web queries</p>
                    <ul>
                      <li className="active">Basic listing submission</li>
                      <li className="active">One Listing</li>
                      <li className="active">30 days Availabilty</li>
                      <li className="inactive">Limited Support</li>
                      <li className="inactive">Edit your listing</li>
                    </ul>
                    <div>
                      <Link href="/login" className="btn viewdetails-btn">
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 d-flex col-md-6">
                <div className="price-card flex-fill">
                  <div className="price-head">
                    <div className="price-level">
                      <h6>Enterprise</h6>
                    </div>
                    <h4>
                      $100 <span>/ month</span>
                    </h4>
                  </div>
                  <div className="price-body">
                    <p>For most business that want to optimize web queries</p>
                    <ul>
                      <li className="active">Basic listing submission</li>
                      <li className="active">One Listing</li>
                      <li className="active">30 days Availabilty</li>
                      <li className="inactive">Limited Support</li>
                      <li className="inactive">Edit your listing</li>
                    </ul>
                    <div>
                      <Link href="/login" className="btn viewdetails-btn">
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
      {/* Pricing Plan Section */}
      {/* Blog Section */}
      {/* Blog Section */}
      {/* Footer */}
      {/* Footer */}
      {/* scrollToTop start */}
      <div className="progress-wrap active-progress">
        <svg
          className="progress-circle svg-content"
          width="100%"
          height="100%"
          viewBox="-1 -1 102 102"
        >
          <path
            d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
            style={{
              transition: "stroke-dashoffset 10ms linear 0s",
              strokeDasharray: "307.919px, 307.919px",
              strokeDashoffset: "228.265px",
            }}
          />
        </svg>
      </div>
      {/* scrollToTop end */}
    </>
  );
};

export default HomePage;
