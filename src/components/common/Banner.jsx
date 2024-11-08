'use client'

import Link from "next/link";
import { useEffect } from "react";


import SimpleSlider from "./SimpleSlider";


export default function Banner({
  className,
  images = [],
 
}) {
  const settingBanner = {
    infinite: true,
    dots: true,
    autoplay: false,
    arrows: false,
    fade: true,
  };
//   const { text_direction } = settings();
  useEffect(() => {
    const getSliderInitElement = document.querySelector(
      ".slider-wrapper .slick-slider.slick-initialized"
    );
    // getSliderInitElement.setAttribute("dir", `${text_direction}`);
  }, []);

  return (
    <>
      <div className={`w-100 ${className || ""}`}>
        <div>
          <div className="main-wrapper w-100">
            <div className="banner-card row g-4 mb-4">
              <div
                data-aos="fade-right"
                className="col-12 col-xl-9 position-relative"
              >
                <div className="slider-wrapper w-100 h-100">
                  <SimpleSlider settings={settingBanner}>
                    {images.length > 0 &&
                      images.map((item, i) => (
                        <div
                          key={i}
                          className="item w-100 h-100 position-relative"
                        >
                          <div className="d-flex w-100 h-100 align-items-center justify-content-center position-relative">
                            <div
                              className="position-absolute w-100 h-100"
                              style={{
                                filter: "brightness(0.8)",
                                backgroundImage: `url(${
                                  process.env.NEXT_PUBLIC_BASE_URL + item.image
                                })`,
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                              }}
                            ></div>
                            <div className="text-center position-relative z-index-10">
                              <div className="d-inline-block bg-white rounded-pill shadow-sm px-4 py-1 mb-4">
                                <span className="text-uppercase font-weight-bold">
                                  {item.badge}
                                </span>
                              </div>
                              <div className="mb-4">
                                <p className="h1 mb-3 font-weight-light text-primary">
                                  {item.title_one}
                                </p>
                                <h1 className="h1 font-weight-bold text-primary">
                                  {item.title_two}
                                </h1>
                              </div>
                              <div className="text-start">
                                <button className="btn btn-primary font-weight-bold">
                                  <Link
                                    href={{
                                      pathname: "/single-product",
                                      query: { slug: item.product_slug },
                                    }}
                                    passHref
                                  >
                                    <p>Shop Now</p>
                                  </Link>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </SimpleSlider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
