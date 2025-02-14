import React, { useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Link from "next/link";
import { useState } from "react";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CarouselActiveDeals({
  dailyOffers,
  color,
  textColor,
  Heading,
}) {
  const slider = useRef();

  const settings = {
    dots: false,
    autoplay: true,
    arrows: false,
    infinite: false,
    lazyLoad: true,
    speed: 1000,
    slidesToShow: 4,
    initialSlide: 0,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 490,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const OfferCard = ({ offer }) => (
    <div className="card aos" data-aos="fade-up">
      <div className="blog-widget">
        <Link href={`/active-offers/${offer.slug}`}>
          <div className="blog-img d-flex justify-content-center">
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL + offer.image}`}
              className="img-fluid-custom"
              alt="blog-img"
            />
          </div>
        </Link>
        <div className="bloglist-content pe-auto">
          <div className="card-body">
            <h6>
              <Link href={`/active-offers/${offer.slug}`}>{offer.title}</Link>
            </h6>
            <div className="blog-location-details"></div>
          </div>
        </div>
      </div>
    </div>
  );

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
              <h2 style={{ color: `${textColor}` }}>{Heading}</h2>
            </div>
          </div>
          {dailyOffers?.length >= 2 && (
            <div className="col-md-6 text-md-end aos" data-aos="fade-up">
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
            {dailyOffers?.length >= 2 ? (
              <Slider
                ref={slider}
                {...settings}
                className="featured-slider grid-view"
              >
                {dailyOffers.map((offer, index) => (
                  <OfferCard key={index} offer={offer} />
                ))}
              </Slider>
            ) : (
              <div className="row">
                {dailyOffers?.map((offer, index) => (
                  <div key={index} className="col-md-4 col-sm-3 mb-4">
                    <OfferCard offer={offer} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
