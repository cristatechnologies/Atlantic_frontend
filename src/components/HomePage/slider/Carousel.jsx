import React, { useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MdAppRegistration } from "react-icons/md";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Carousel({
  businessData = [],
  color,
  textColor,
  Heading,
}) {
  const [error, setError] = useState(null);

  const settings = {
    dots: false,
    autoplay: true,
    arrows: false,
    infinite: true,
    lazyLoad: true,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  console.log("carousel page", businessData);
  const slider = useRef();

  // Render individual cards without carousel if less than 5 items
  const renderBusinessCards = () => {
    if (!businessData || businessData.length === 0) {
      return <div className="text-center py-4">No businesses to display</div>;
    }

    return (
      <div className="row">
        {businessData.map((item, index) => (
          <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={index}>
            <div className="card aos h-100" data-aos="fade-up">
              <div className="blog-widget h-100">
                <div className="blog-img d-flex justify-content-center">
                  <Link href={`business-details/${item.slug}`}>
                    <img
                      src={
                        item.image?.trim() !== ""
                          ? `${process.env.NEXT_PUBLIC_BASE_URL + item.image}`
                          : `${process.env.NEXT_PUBLIC_BASE_URL}${item.business_category.image}`
                      }
                      className="img-fluid-custom"
                      alt="logo"
                      style={{ maxHeight: "150px", objectFit: "contain" }}
                    />
                  </Link>
                </div>
                <div className="bloglist-content pe-auto">
                  <div className="card-body">
                    <div className="blogfeaturelink">
                      <div className="blog-features display-screen-size">
                        <Link href={`business-details/${item.slug}`}>
                          <span>
                            <i className="fa-regular fa-circle-stop"></i>{" "}
                            {item.business_category?.name || "N/A"}
                          </span>
                        </Link>
                      </div>
                    </div>
                    <h6>
                      <Link href={`business-details/${item.slug}`}>
                        {item.name || "N/A"}
                      </Link>
                    </h6>
                    <div className="blog-location-details">
                      {(item.business_city?.name ||
                        item.business_state?.name) && (
                        <div className="location-info">
                          <i className="feather-map-pin"></i>{" "}
                          {item.business_city?.name && (
                            <>
                              {item.business_city.name}
                              {item.business_state?.name && ", "}
                            </>
                          )}
                          {item.business_state?.name &&
                            item.business_state.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Handle different states
  const renderContent = () => {
    if (businessData === null) {
      // Location not fetched yet
      return <div className="text-center py-4">Detecting your location...</div>;
    }

    if (businessData === undefined) {
      // Error in fetching location
      return <div className="text-center py-4">No location fetched</div>;
    }

    if (businessData.length === 0) {
      // Location fetched but no businesses
      return <div className="text-center py-4">No businesses near you</div>;
    }

    // We have businesses to show
    return businessData.length >= 5 ? (
      <Slider
        ref={slider}
        {...settings}
        className="featured-slider grid-view"
      >
        {businessData.map((item, index) => (
          <div className="card aos" data-aos="fade-up" key={index}>
            <div className="blog-widget">
              <div className="blog-img d-flex justify-content-center">
                <Link href={`business-details/${item.slug}`}>
                  <img
                    src={
                      item.image?.trim() !== ""
                        ? `${process.env.NEXT_PUBLIC_BASE_URL + item.image}`
                        : `${process.env.NEXT_PUBLIC_BASE_URL}${item.business_category.image}`
                    }
                    className="img-fluid-custom"
                    alt="logo"
                  />
                </Link>
              </div>
              <div className="bloglist-content pe-auto">
                <div className="card-body">
                  <div className="blogfeaturelink">
                    <div className="blog-features display-screen-size">
                      <Link href={`business-details/${item.slug}`}>
                        <span>
                          <i className="fa-regular fa-circle-stop"></i>{" "}
                          {item.business_category?.name || "N/A"}
                        </span>
                      </Link>
                    </div>
                  </div>
                  <h6>
                    <Link href={`business-details/${item.slug}`}>
                      {item.name || "N/A"}
                    </Link>
                  </h6>
                  <div className="blog-location-details">
                    {(item.business_city?.name ||
                      item.business_state?.name) && (
                      <div className="location-info">
                        <i className="feather-map-pin"></i>{" "}
                        {item.business_city?.name && (
                          <>
                            {item.business_city.name}
                            {item.business_state?.name && ", "}
                          </>
                        )}
                        {item.business_state?.name &&
                          item.business_state.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    ) : (
      renderBusinessCards()
    );
  };

  return (
    <section
      className="featured-section-one"
      style={{ backgroundColor: `${color}` }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 aos aos-init aos-animate" data-aos="fade-up">
            <div className="section-heading">
              <h2 style={{ color: `${textColor}` }}>{`${Heading}`}</h2>
            </div>
          </div>
          {businessData && businessData.length >= 5 && (
            <div className="col-md-6 text-md-end  aos" data-aos="fade-up">
              <div className="owl-nav mynav2">
                <button
                  type="button"
                  role="presentation"
                  className="owl-prev"
                  onClick={() => slider?.current?.slickPrev()}
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
          )}
        </div>
        <div className="row">
          <div className="col-md-12">
            {renderContent()}
          </div>
        </div>
      </div>
    </section>
  );
}