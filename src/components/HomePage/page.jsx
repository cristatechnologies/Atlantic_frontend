"use client";
import React from "react";
import {
  ArrowBanner,
  BannerArrow,
  Bannerbg,
  BannerEllipse,
  Blog1,
  Blog2,
  Blog3,
  Category10Svg,
  Category11Svg,
  Category12Svg,
  Category2Svg,
  Category3Svg,
  Category4Svg,
  Category5Svg,
  Category6Svg,
  Category7Svg,
  Category8Svg,
  Category9Svg,
  Category1Svg,
  CtaImg,
  Feature2,
  Feature3,
  Feature4,
  Feature5,
  Feature6,
  Feature7,
  Feature8,
  Feature9,
  LocationsAustralia,
  LocationsCanada,
  LocationsChina,
  LocationsFrance,
  LocationsUk,
  LocationsUsa,
  Partners1,
  Partners2,
  Partners3,
  Partners4,
  Partners5,
  Partners6,
  PopularImg,
  ProfileAvatar02,
  ProfileAvatar03,
  ProfileAvatar04,
  ProfileAvatar05,
  ProfileAvatar06,
  ProfileAvatar07,
  ProfileAvatar12,
  ProfileAvatar13,
  ProfileAvatar14,
  Quotes,
  RightImg,
  Testimonial1,
  Testimonial2,
} from "../imagepath";
import Carousel from "./slider/Carousel";
import Footer from "./footer/page";
import Image from "next/image";
import Header from "./header/page";
import Testimonial from "./slider/Testimonial";
import Sponsors from "./slider/Sponsors";
import Select from "./select/page";
import Link from "next/link";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";
const HomePage = () => {
  const [isLight, setIsLight] = useState();
  const [businessData, setBusinessData] = useState(null);
  const [categories, setCategories] = useState();
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      router.push(`/search-results?query=${encodeURIComponent(searchText)}`);
    }
  };
  const [latestBusiness, setLatestBusiness] = useState();

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

  return (
    <>
      {/* Banner Section */}
      <section className="banner-section">
        <div className="banner-circle">
          <img
            src="./img/bannerbg.png"
            className="img-fluid"
            alt="bannercircle"
          />
        </div>
        <div className="container">
          <div className="home-banner">
            <div className="row align-items-center">
              <div className="col-lg-7">
                <div className="section-search aos" data-aos="fade-up">
                  <p className="explore-text">
                    {" "}
                    <span>Explore top-rated attractions</span>
                  </p>
                  <img
                    src="./img/arrow-banner.png"
                    className="arrow-img"
                    alt="arrow"
                  />
                  <h1>
                    Let us help you <br />
                    <span>Find, Buy</span> & Own Dreams
                  </h1>
                  <p>
                    Countrys most loved and trusted classNameified ad listing
                    website classNameified ad.randomised words which don't look
                    even slightly Browse thousand of items near you.
                  </p>
                  <div className="search-box">
                    <form onSubmit={handleSearch} className="d-flex">
                      <div className="search-input">
                        <div className="form-group">
                          <div className="group-img">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search"
                              value={searchText}
                              onChange={(e) => setSearchText(e.target.value)}
                            />
                            <i className="feather-search"></i>
                          </div>
                        </div>
                      </div>
                      <div className="search-btn">
                        <button className="btn btn-primary" type="submit">
                          <i className="fa fa-search" aria-hidden="true"></i>{" "}
                          Search
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="banner-imgs">
                  <img
                    src="./img/Right-img.png"
                    className="img-fluid"
                    alt="bannerimage"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          src="./img/bannerellipse.png"
          className="img-fluid banner-elipse"
          alt="arrow"
        />
        <img
          src="./img/banner-arrow.png"
          className="img-fluid bannerleftarrow"
          alt="arrow"
        />
      </section>
      {/* Banner Section */}

      {/* Category Section */}
      <section className="category-section">
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
      </section>
      {/* Category Section */}

      {/* Featured Ads Section */}
      <Carousel businessData={businessData} />
      {/* Featured Ads Section */}

      {/* Popular Location Section */}
      <section className="popular-locations grid-view featured-slider">
        <div className="popular-circleimg">
          <img
            className="img-fluid"
            src="./img/popular-img.png"
            alt="Popular-sections"
          />
        </div>
        <div className="container">
          <div className="section-heading">
            <h2>
              Latest <span className="whiteCircle">Bus</span>inesses
            </h2>
            <p>
              Start by selecting your favuorite location and explore the goods
            </p>
          </div>
          <div className="lateestads-content">
            <div className="row">
              {latestBusiness &&
                latestBusiness.map((item, i) => (
                  <div className="col-lg-3 col-md-4 col-sm-6 d-flex" key={i}>
                    <div className="card aos flex-fill" data-aos="fade-up">
                      <div className="blog-widget">
                        <div className="blog-img">
                          <Link href="/service-details">
                            <Image
                              src={`${
                                process.env.NEXT_PUBLIC_BASE_URL + item.image
                              }`}
                              width={312}
                              height={252}
                              className="img-fluid"
                              alt="blog-img"
                            />
                          </Link>
                          <div className="fav-item">
                            {/* <span className="Featured-text">Featured</span> */}
                            <Link href="#" className="fav-icon">
                              <i className="feather-heart"></i>
                            </Link>
                          </div>
                        </div>
                        <div className="bloglist-content">
                          <div className="card-body">
                            <div className="blogfeaturelink">
                              {/* <div className="grid-author">
                                  <img src={ProfileAvatar02} alt="author" /> 
                                </div> */}
                              <div className="blog-features text-black">
                                <Link href="#">
                                  <span>
                                    {" "}
                                    <i className="fa-regular fa-circle-stop"></i>{" "}
                                    {item.name}
                                  </span>
                                </Link>
                              </div>
                              <div className="blog-author text-end text-black">
                                <span>
                                  {" "}
                                  <i className="feather-eye"></i> 4000{" "}
                                </span>
                              </div>
                            </div>
                            {/* <h6 className="text-black">
                                <Link href="/service-details">
                                  2017 Gulfsteam Ameri-lite
                                </Link>
                              </h6> */}
                            <div className="blog-location-details text-black">
                              <div className="location-info">
                                <i className="feather-map-pin"></i>{" "}
                                {item.address}
                              </div>
                              <div className="location-info">
                                <i className="fa-solid fa-calendar-days"></i> 06
                                Oct, 2022
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="align-items-center">
            <Link href="/listing-grid-sidebar" className="browse-btn">
              Browse Ads
            </Link>
          </div>
        </div>
      </section>
      {/* Popular Location Section */}

      {/* Latest ads Section */}

      {/* Latest ads Section */}

      {/* CTA Section */}

      {/* CTA Section */}

      {/* Client Testimonial Section */}

      {/* Client Testimonial Section */}

      {/* Partners Section */}
      <div className="partners-section">
        <div className="container">
          {/* <p className="partners-heading">
              Over 5,26,000+ Sponsers being contact with us
            </p> */}
          {/* <Sponsors /> */}
        </div>
      </div>
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
