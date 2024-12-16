import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./ServiceDetailCarousel.module.css";

const ServiceDetailCarousel = ({ data }) => {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    arrows: false,
    autoplay: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 2,
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
    <div className={styles.carouselContainer}>
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

      <Slider ref={sliderRef} {...settings}>
        {data &&
          data.map((item, index) => (
            <div key={index} className={styles.slideItem}>
              <div className={styles.imageWrapper}>
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_URL + item.image}`}
                  alt={`Gallery image ${index + 1}`}
                  className={styles.image}
                />
                {item.title && item.description && {
                  
                }}
              </div>
            </div>
          ))}
      </Slider>
    </div>
  );
};

export default ServiceDetailCarousel;
