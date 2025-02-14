import { useEffect } from "react";
import SimpleSlider from "./SliderCom";

export default function Banner({
  images = [], // Accept an array of image URLs
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
  }, []);

  return (
    <div className="w-full">
      <div className="main-wrapper w-full">
        <div className="banner-card d-flex flex-xl-row h-xl-600 mb-2 pt-[80px]">
          <div
            data-aos="fade-right"
            className="ms-xl-0 me-3 w-100 h-xl-100 h-md-500 h-220 mb-0 mb-xl-0"
          >
            <div className="slider-wrapper w-100 h-100">
              <SimpleSlider settings={settingBanner}>
                {images.length > 0 &&
                  images.map((imageUrl, i) => (
                    <div
                      key={i}
                      className="banner-slide position-relative"
                      style={{
                        overflow: "hidden",
                        height: `calc(100vh - ${headerHeight}px)`,
                      }}
                    >
                      <div
                        className="banner-bg position-absolute w-100 h-100"
                        style={{
                          backgroundImage: `url(${imageUrl})`,
                          backgroundSize: "contain",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      ></div>
                    </div>
                  ))}
              </SimpleSlider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
