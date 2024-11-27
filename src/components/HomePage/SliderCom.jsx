import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";


export default function SimpleSlider(props) {
  const { className, settings, children, selector } = props;

  return (
    <Slider ref={selector} className={`${className || ""}`} {...settings}>
      {children}
    </Slider>
  );
}
