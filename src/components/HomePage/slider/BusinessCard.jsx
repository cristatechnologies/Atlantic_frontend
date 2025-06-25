import React from "react";
import Link from "next/link";
import { MdAppRegistration } from "react-icons/md";




const BusinessCard = ({ item }) => {
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 d-flex">
      <div className="card aos flex-fill" data-aos="fade-up">
        <Link href={`/business-details/${item.slug}`}>
          <div className="blog-widget">
            <div className="blog-img">
              <Link href={`/business-details/${item.slug}`}>
                <div>
                  <img
                    src={
                      item.image?.trim() !== ""
                        ? `${process.env.NEXT_PUBLIC_BASE_URL + item.image}`
                        : `${process.env.NEXT_PUBLIC_BASE_URL}${item.business_category.image}`
                    }
                    className="img-fluid-custom"
                    alt="logo"
                  />
                </div>
              </Link>
            </div>
            <div className="bloglist-content pe-auto">
              <div className="card-body">
                <div className="blogfeaturelink">
                  <div className="blog-features">
                    <Link href={`business-details/${item.slug}`}>
                      <span>
                        {" "}
                        <i className="fa-regular fa-circle-stop"></i>{" "}
                        {item.business_category.name}
                      </span>
                    </Link>
                  </div>
                  {/* {item.reg_no && (
                    <div className="blog-author text-end">
                      <span>
                        {" "}
                        <MdAppRegistration />
                        {item.reg_no}
                      </span>
                    </div>
                  )} */}
                </div>
                <h6>
                  <Link href={`business-details/${item.slug}`}>
                    {item.name}
                  </Link>
                </h6>
                <div className="blog-location-details">
                  {(item.business_city?.name || item.business_state?.name) && (
                    <div className="location-info">
                      <i className="feather-map-pin"></i>{" "}
                      {item.business_city?.name && (
                        <>
                          {item.business_city.name}
                          {item.business_state?.name && ", "}
                        </>
                      )}
                      {item.business_state?.name && item.business_state.name}
                    </div>
                  )}

                  {/* <div className="location-info"> */}
                  {/* <i className="fa-regular fa-calendar-days"></i>{" "} */}
                  {/* 06 Oct, 2022
                              </div> */}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BusinessCard;
