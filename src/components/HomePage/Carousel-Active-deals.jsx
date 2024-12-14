import React, { useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MdAppRegistration } from "react-icons/md";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CarouselActiveDeals({
  dailyOffers,
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
          slidesToShow: 3, // Show 1 slide
        },
      },
      {
        breakpoint: 490, // At screen width of 768px and below
        settings: {
          slidesToShow: 2, // Show 1 slide
        },
      }
    ],
  };

  console.log("carousel page", dailyOffers);
  const slider = useRef();
  return (
    <section
      className="featured-section"
      style={{
        backgroundColor: `${color}`,
      }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 aos aos-init aos-animate" data-aos="fade-up">
            <div className="section-heading">
              <h2 style={{ color: `${textColor}` }}>{`${Heading}`}</h2>
              {/* <p>Checkout these latest coo ads from our members</p> */}
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
                {dailyOffers &&
                  dailyOffers.map((offer, index) => (
                    <div className="card aos" data-aos="fade-up " key={index}>
                      <div className="blog-widget">
                        <Link href={`/active-offers/${offer.slug}`}>
                          <div className="blog-img d-flex justify-content-center">
                            <img
                              src={`${
                                process.env.NEXT_PUBLIC_BASE_URL + offer.image
                              }`}
                              className="img-fluid-custom"
                              alt="blog-img"
                            />
                            {/* <div className="fav-item">
                            <span className="Featured-text">Featured</span>
                            <Link href="#" className="fav-icon">
                            <i className="feather-heart"></i>
                            </Link>
                            </div> */}
                          </div>
                        </Link>
                        <div className="bloglist-content pe-auto">
                          <div className="card-body">
                            <h6>
                              <Link href={`/active-offers/${offer.slug}`}>
                                {offer.title}
                              </Link>
                            </h6>
                            <div className="blog-location-details"></div>
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
