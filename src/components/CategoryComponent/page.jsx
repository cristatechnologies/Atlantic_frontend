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
        <div className="breadcrumb-bar">
          <div className="container">
            <div className="row align-items-center text-center">
              <div className="col-md-12 col-12">
                <h2 className="breadcrumb-title">Listings-Categories</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Categories
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      
        <div className="category-section">
          <div className="container">
            <div className="row">
              {websiteSetup?.businessCategories &&
                websiteSetup?.businessCategories.map((item, i) => (
                  <div className="col-lg-2 col-md-3 col-sm-6" key={i}>
                    <Link href={`/categories/${item.id}`} className="category-links">
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