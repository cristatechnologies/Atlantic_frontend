import React, { useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MdAppRegistration } from "react-icons/md";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



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
    responsive: [
      {
        breakpoint: 1200, // At screen width of 1200px and below
        settings: {
          slidesToShow: 3, // Show 3 slides
        },
      },
      {
        breakpoint: 992, // At screen width of 992px and below
        settings: {
          slidesToShow: 2, // Show 2 slides
        },
      },
      {
        breakpoint: 768, // At screen width of 768px and below
        settings: {
          slidesToShow: 1, // Show 1 slide
        },
      },
    ],
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
                <FontAwesomeIcon icon={faAngleRight} rotation={180} />
              </button>
              <button
                type="button"
                role="presentation"
                className="owl-next"
                onClick={() => slider?.current?.slickNext()}
              >
                <FontAwesomeIcon icon={faAngleRight} />
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
                          {/* <div className="fav-item">
                            <span className="Featured-text">Featured</span>
                            <Link href="#" className="fav-icon">
                              <i className="feather-heart"></i>
                            </Link>
                          </div> */}
                        </div>
                        <div className="bloglist-content pe-auto">
                          <div className="card-body">
                            <div className="blogfeaturelink">
                              <div className="grid-author">
                                <img
                                  src={`${
                                    process.env.NEXT_PUBLIC_BASE_URL +
                                    item.image
                                  }`}
                                  alt="author"
                                />
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
                                  <MdAppRegistration />
                                  {item.reg_no}
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
                              {/* <div className="location-info"> */}
                              {/* <i className="fa-regular fa-calendar-days"></i>{" "} */}
                              {/* 06 Oct, 2022
                              </div> */}
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
