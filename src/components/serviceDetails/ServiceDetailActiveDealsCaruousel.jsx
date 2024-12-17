import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import styles from "./ServiceDetailActive-deals.module.css";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const ServiceDetailActiveDealsCaruousel = ({ data }) => {
  const slider = useRef();

  const settings = {

    arrows: false,
    autoplay: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="col-md-12 text-md-end aos" data-aos="fade-up">
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
      <Slider ref={slider} {...settings}>
        {data &&
          data.map((item, index) => (
            <div key={index} className={styles.slideItem}>
              <Link href={`/active-offers/${item.slug}`}>
                <div className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_URL + item.image}`}
                      alt={`Active Offers ${index + 1}`}
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.cardTitle}>
                    <h3>{item.title}</h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </Slider>
    </div>
  );
};

export default ServiceDetailActiveDealsCaruousel;
