import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./ServiceDetailCarousel.module.css";
import Link from "next/link";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const ServiceDetailCaruouselGallery = ({ data }) => {
  const sliderRef = useRef(null);

  const settings = {
 
   arrows:false,
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
  const slider = useRef();
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
      {/* <div className={styles.navigationButtons}>
        <button
          className={`btn btn-outline-secondary ${styles.prevButton}`}
          onClick={() => sliderRef.current?.slickPrev()}
        >
          ←
        </button>
        <button
          className={`btn btn-outline-secondary ${styles.nextButton}`}
          onClick={() => sliderRef.current?.slickNext()}
        >
          →
        </button>
      </div> */}

      <Slider ref={slider} {...settings}>
        {data &&
          data.map((item, index) => (
            <div key={index} className={styles.slideItem}>
              <div className={styles.imageWrapper}>
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_URL + item.image}`}
                  alt={`Active Deal ${index + 1}`}
                  className={styles.image}
                />
              </div>
            </div>
          ))}
      </Slider>
    </div>
  );
};

export default ServiceDetailCaruouselGallery;
