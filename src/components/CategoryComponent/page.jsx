'use client'

import React from "react";
// import { Category10Svg, Category11Svg, Category12Svg, Category1Svg, Category2Svg, Category3Svg, Category4Svg, Category5Svg, Category6Svg, Category7Svg, Category8Svg, Category9Svg } from "../../imagepath";

import Link from "next/link";
import { useSelector } from "react-redux";
import Image from "next/image";

const CategoryComponent = () => {
   

    const websiteSetup = useSelector((state) => state.websiteSetup.data);
    return (
      <>
        {/* Breadscrumb Section */}

        <div
          className="category-section"
          style={{ paddingTop: "170px", paddingBottom: "90px" }}
        >
          <div className="container">
            <div className="row">
              {websiteSetup?.businessCategories &&
                websiteSetup?.businessCategories.map((item, i) => (
                  <div className="col-lg-2 col-md-3 col-sm-6" key={i}>
                    <Link
                      href={`/categories/${item.slug}`}
                      className="category-links"
                    >
                      <h5>{item.name}</h5>
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL + item.image}`}
                        alt="icons"
                        height={110}
                        width={110}
                      />
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </>
    );
}
export default CategoryComponent;