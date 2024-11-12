import React from "react";
import Image from "next/image";
import { SlideshowLightbox } from "lightbox.js-react";
import "lightbox.js-react/dist/index.css";

const Roomspics = ({ images }) => {
  // Check if images is defined and an array
  if (!Array.isArray(images) || images.length === 0) {
    return <p>No gallery items available.</p>;
  }
  // console.log("Received images prop:", images);

  return (
    <div className="row">
      {images.map((item, index) => (
        <div className="col-lg-3 col-md-3 col-sm-3" key={index}>
          <div className="review-gallery">
            <SlideshowLightbox>
              <Image
                height="220px"
                width="209px"
                className="img-fluid"
                alt={`Gallery item ${index + 1}`}
                src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.image}`}
              />
            </SlideshowLightbox>
            {/* {console.log(
              "image path is ",
              `${process.env.NEXT_PUBLIC_BASE_URL}${item.image}`
            )} */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Roomspics;
