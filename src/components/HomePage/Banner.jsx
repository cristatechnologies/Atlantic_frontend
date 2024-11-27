import React, { useEffect } from "react";
import SimpleSlider from "./SliderCom";
import Link from "next/link";

export default function Banner({
  images = [], // Change to accept an array of image URLs
  headerHeight = 80, // Provide a default value
}) {
  const settingBanner = {
    infinite: true,
    dots: true,
    autoplay: false,
    arrows: false,
    fade: true,
  };

  useEffect(() => {
    const getSliderInitElement = document.querySelector(
      ".slider-wrapper .slick-slider.slick-initialized"
    );
  
  });

  return (
    // className={`w-full !mt-30px ${className || ""}`
    <div >
      <div className="">
        <div className="main-wrapper w-full ">
          <div class="banner-card d-flex flex-xl-row h-xl-600 mb-2">
            <div
              data-aos="fade-right"
              class="ms-xl-0 me-3 w-100 h-xl-100 h-md-500 h-220 mb-0 mb-xl-0"
            >
              <div class="slider-wrapper w-100 h-100">
                <SimpleSlider settings={settingBanner}>
                  {/* Ensure images is an array and map over it */}
               {images.length > 0 &&
                 images.map((item, i) => (   //reached here
                      <div
                        key={i}
                        className="banner-slide position-relative"
                        style={{
                          overflow: "hidden",
                        }}
                      >
                        <div
                          className="banner-bg position-absolute w-100 "
                          style={{
                            backgroundImage: `url(${imageUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        ></div>
                      </div>
                    ))
                 }
                    // Fallback if images is not an array
                    {/* <div
                      className="banner-slide position-relative"
                      style={{
                        overflow: "hidden",
                      }}
                    >
                      <div
                        className="banner-bg position-absolute w-100"
                        style={{
                          backgroundImage: `url(${images})`,
                          backgroundSize: "contain",

                          backgroundRepeat: "no-repeat",
                          "@media (max-width: 767px)": {
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          },
                        }}
                      ></div>
                    </div>
                  )} */}
                </SimpleSlider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
