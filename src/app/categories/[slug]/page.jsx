"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import categories from "../page";

const CategoryPage = ({ params }) => {
  const { slug } = params;
  console.log(slug)
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchCategoryData(slug);
    }
  }, [slug]);

  const fetchCategoryData = (categorySlug) => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/category-list/${categorySlug}`
      )
      .then((response) => {
        setCategoryData(response.data);
        console.log("API response:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching category data:", error);
      });
  };

  if (!categoryData) {
    return (
      <div>
        {" "}
        <div className="centered">
          <div className="dot-spinner">
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
     

      <section className="category-section">
        <div className="container">
          {categoryData.children && categoryData.children.length > 0 && (
            <>
              <div className="section-heading text-center">
                <div className="row align-items-center">
                  <div
                    className="col-md-12 aos aos-init aos-animate"
                    data-aos="fade-up"
                  >
                    <h2>
                      <span className="title-left magentaCircle">Cat</span>egory
                    </h2>
                  </div>
                </div>
              </div>

              <div className="row ">
                {categoryData &&
                  categoryData.children.length > 0 &&
                  categoryData.children.map((item, i) => (
                    <div className="col-lg-3 col-md-4" key={i}>
                      <Link
                        href={`/categories/${item.slug}`}
                        className="category-links"
                      >
                        <h5>{item.name}</h5>

                        <img
                          src={`${
                            process.env.NEXT_PUBLIC_BASE_URL + item.image
                          }`}
                          alt="icons"
                          className="img-fluid"
                          style={{
                            width: "100%",
                            height: "auto",
                            maxHeight: "200px",
                            objectFit: "cover",
                          }}
                        />
                      </Link>
                    </div>
                  ))}
              </div>
            </>
          )}

          {categoryData.business && categoryData.business.length > 0 ? (
            <>
              <div className="section-heading text-center mt-5">
                <div className="row align-items-center">
                  <div
                    className="col-md-12 aos aos-init aos-animate"
                    data-aos="fade-up"
                  >
                    <h2>
                      <span className="title-left magentaCircle">Bus</span>iness
                    </h2>
                  </div>
                </div>
              </div>

              <div
                className="lateestads-content mt-4"
                style={{ fontFamily: "sans-serif" }}
              >
                <div className="row">
                  {categoryData.business.map((item, i) => (
                    <div className="col-lg-3 col-md-4 col-sm-6 d-flex" key={i}>
                      <div className="card aos flex-fill" data-aos="fade-up">
                        <div className="blog-widget">
                          <div className="blog-img">
                            <Link
                              href={`/business-details/${item.slug}`}
                              legacyBehavior
                            >
                              <a>
                                <Image
                                  src={`${
                                    process.env.NEXT_PUBLIC_BASE_URL +
                                    item.image
                                  }`}
                                  width={312}
                                  height={252}
                                  className="img-fluid"
                                  alt="blog-img"
                                />
                              </a>
                            </Link>
                            <div className="fav-item">
                              {/* Favorite icon code removed */}
                            </div>
                          </div>
                          <div className="bloglist-content">
                            <div className="card-body">
                              <div className="blogfeaturelink">
                                <div className="blog-features text-black">
                                  <Link href={`/business-details/${item.slug}`}>
                                    <span>
                                      <i className="fa-regular fa-circle-stop"></i>{" "}
                                      {item?.name}
                                    </span>
                                  </Link>
                                </div>
                              </div>
                              <div className="blog-location-details text-black">
                                <div className="location-info">
                                  <i className="feather-map-pin"></i>{" "}
                                  {item.business_city?.name},{" "}
                                  {item.business_state?.name}
                                </div>
                                {/* <div className="location-info">
                                  <i className="fa-solid fa-calendar-days"></i>{" "}
                                  06 Oct, 2022
                                </div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="no-Data-custom">No Businesses Found</p>
          )}
        </div>
      </section>
    </>
  );
};

export default CategoryPage;
