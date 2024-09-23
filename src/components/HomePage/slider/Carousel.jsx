import React, { useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Feature2,
  Feature3,
  Feature4,
  Feature5,
  Feature9,
  ProfileAvatar02,
  ProfileAvatar04,
  ProfileAvatar05,
  ProfileAvatar06,
} from "../../imagepath";
import Slider from "react-slick";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Carousel({ businessData }) {
  const [error, setError] = useState(null);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    lazyLoad: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  console.log("carousel page", businessData);
  const slider = useRef();
  return (
    <section className="featured-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 aos aos-init aos-animate" data-aos="fade-up">
            <div className="section-heading">
              <h2>
                Featu<span className="title-right magentaCircle">red</span> Ads
              </h2>
              <p>Checkout these latest coo ads from our members</p>
            </div>
          </div>
          <div className="col-md-6 text-md-end aos" data-aos="fade-up">
            <div className="owl-nav mynav2">
              <button
                type="button"
                role="presentation"
                className="owl-prev"
                onClick={() => {
                  console.log(slider?.current);
                  slider?.current?.slickPrev();
                }}
              >
                <i className="fa-solid fa-angle-left"></i>
              </button>
              <button
                type="button"
                role="presentation"
                className="owl-next"
                onClick={() => slider?.current?.slickNext()}
              >
                <i className="fa-solid fa-angle-right"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div>
              <Slider
                ref={slider}
                {...settings}
                className=" featured-slider grid-view"
              >
                {businessData &&
                  businessData.map((item, index) => (
                    <div className="card aos" data-aos="fade-up " key={index}>
                      <div className="blog-widget">
                        <div className="blog-img">
                          <Link href={`business-details/${item.id}`}>
                            <img
                              src={`${
                                process.env.NEXT_PUBLIC_BASE_URL + item.image
                              }`}
                              className="img-fluid"
                              alt="blog-img"
                            />
                          </Link>
                          <div className="fav-item">
                            <span className="Featured-text">Featured</span>
                            <Link href="#" className="fav-icon">
                              <i className="feather-heart"></i>
                            </Link>
                          </div>
                        </div>
                        <div className="bloglist-content">
                          <div className="card-body">
                            <div className="blogfeaturelink">
                              <div className="grid-author">
                                {/* <img src={ProfileAvatar02} alt="author" /> */}
                              </div>
                              <div className="blog-features">
                                <Link href={`business-details/${item.id}`}>
                                  <span>
                                    {" "}
                                    <i className="fa-regular fa-circle-stop"></i>{" "}
                                    {item.business_category.name}
                                  </span>
                                </Link>
                              </div>
                              <div className="blog-author text-end">
                                <span>
                                  {" "}
                                  <i className="feather-eye"></i>4000{" "}
                                </span>
                              </div>
                            </div>
                            <h6>
                              <Link href={`business-details/${item.id}`}>
                                {item.name}
                              </Link>
                            </h6>
                            <div className="blog-location-details">
                              <div className="location-info">
                                <i className="feather-map-pin"></i>{" "}
                                {item.address}
                              </div>
                              <div className="location-info">
                                <i className="fa-regular fa-calendar-days"></i>{" "}
                                06 Oct, 2022
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
