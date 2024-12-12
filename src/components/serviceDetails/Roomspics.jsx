import React from "react";
import Image from "next/image";
import { SlideshowLightbox } from "lightbox.js-react";


const Roomspics = ({ images }) => {
  // Check if images is defined and an array
  if (!Array.isArray(images) || images.length === 0) {
    return <p>No gallery items available.</p>;
  }
  console.log("Received images prop:", images);

  return (
    <div className="row">
      {images.map((item, index) => (
        <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
          <div className="review-gallery">
            <SlideshowLightbox>
              <img
                // className="img-fluid"
                className="gallery-Image"
                alt={`Gallery item ${index + 1}`}
                src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.image}`}
                style={{height:"auto"}}
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
