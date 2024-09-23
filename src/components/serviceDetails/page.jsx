"use client";

import React from "react";

import StickyBox from "react-sticky-box";
import { useState } from "react";
import Link from "next/link";
import Rooms from "./myComponent2";
import Roomspics from "./Roomspics";
import RoomsProfile from "./myComponent4";
import PhotoAlbum from "react-photo-album";

import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import business from "@/app/signup/business/page";

const ServiceDetails = ({ data }) => {
  const pathname = usePathname;
  console.log(data);

  return (
    <>
      {/* <Header /> */}

      {/*Galler Slider Section*/}
      {data && data.banner_image !== "" ? (
        <div className="bannergallery-section mt-lg-5 ">
          {/* <Rooms /> */}
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_URL + data.banner_image}`}
            alt="Service Banner"
          />
        </div>
      ) : (
        <div className="breadcrumb-bar">
          <div className="container">
            <div className="row align-items-center text-center">
              <div className="col-md-12 col-12">
                <h2 className="breadcrumb-title"> {data.name}</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="index.html">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {data.name}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {showFancyBox && <PhotoAlbum photos={imagess} layout="rows" />} */}

      <section className="details-description">
        <div className="container">
          <div className="about-details">
            <div className="about-headings">
              <div className="author-img">
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_URL + data.image}`}
                  alt="authorimg"
                />
              </div>
              <div className="authordetails">
                <h5>{data.name}</h5>
                <p>{data.description}</p>
              </div>
            </div>
            {/* <div className="rate-details">
              <h2>$350</h2>
              <p>Fixed</p>
            </div> */}
          </div>
        </div>
      </section>

      <div className="details-main-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-lg-9">
              <div className="card ">
                <div className="card-header">
                  <span className="bar-icon">
                    <span />
                    <span />
                    <span />
                  </span>
                  <h4>Description</h4>
                </div>
                <div className="card-body">
                  <p>{data.description}</p>
                </div>
              </div>

              <div className="card gallery-section ">
                <div className="card-header ">
                  <img src="/img/galleryicon.svg" alt="gallery" />
                  <h4>Gallery</h4>
                </div>
                <div className="card-body">
                  <div className="gallery-content">
                    {console.log("business_gallery:", data.business_gallery)}
                    <Roomspics images={data.business_gallery} />
                  </div>
                </div>
              </div>

              {/*/Review Section*/}
            </div>
            <div className="col-lg-3 theiaStickySidebar">
              <StickyBox>
                <div className="rightsidebar">
                  <div className="card">
                    <h4>
                      <img src="/img/breifcase.svg" alt="" /> Business Info
                    </h4>
                    <div className="map-details">
                      <div className="map-frame">
                        {data.map_link && data.map_link !== "" ? (
                          <iframe
                            src={data.map_link}
                            width={200}
                            height={160}
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        ) : (
                          <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83327.56064173167!2d-123.20630478108814!3d49.25770615011392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548673f143a94fb3%3A0xbb9196ea9b81f38b!2sVancouver%2C%20BC%2C%20Canada!5e0!3m2!1sen!2sin!4v1726556736680!5m2!1sen!2sin"
                            width={200}
                            height={160}
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        )}
                      </div>
                      <ul className="info-list">
                        <li>
                          <i className="feather-map-pin" />
                          {data.address}
                          <br />
                        </li>
                        <li>
                          <a href={`tel:${data?.contact_person_number}`}>
                            <i className="feather-phone-call" />
                            {data.contact_person_number}
                          </a>
                        </li>
                        <li>
                          <a href={`mailto:${data?.contact_person_email}`}>
                            <i className="feather-mail" />{" "}
                            {data.contact_person_email}
                          </a>
                        </li>
                        <li>
                          <Link href={`${data?.website}`}>
                            <img src="/img/website.svg" alt="website" />{" "}
                            www.listee.com
                          </Link>
                        </li>
                        <li className="socialicons pb-0">
                          <Link
                            href={`https://${data?.facebook}`}
                            target="_blank"
                          >
                            <FontAwesomeIcon icon="fab fa-facebook" />
                          </Link>

                          <a href={`https://${data?.twitter}`} target="_blank">
                            <FontAwesomeIcon icon="fab fa-instagram" />
                          </a>

                          <Link
                            href={`https://${data?.linkedin}`}
                            target="_blank"
                          >
                            <FontAwesomeIcon icon="fab fa-twitter" />
                          </Link>
                          <Link
                            href={`https://${data?.instagram}`}
                            target="_blank"
                          >
                            <FontAwesomeIcon icon="fab fa-linkedin" />
                          </Link>
                          <Link
                            href={`https://${data?.youtube}`}
                            target="_blank"
                          >
                            <FontAwesomeIcon icon="fab fa-youtube" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="card mb-0">
                    <h4>
                      {" "}
                      <i className="feather-phone-call" /> Contact Business
                    </h4>
                    <form className="contactbusinessform">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Name"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email Address"
                        />
                      </div>
                      <div className="form-group">
                        <textarea
                          rows={6}
                          className="form-control"
                          placeholder="Message"
                          defaultValue={""}
                        />
                      </div>
                      <div className="submit-section">
                        <button
                          className="btn btn-primary submit-btn"
                          type="submit"
                        >
                          Send Message
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </StickyBox>
            </div>
          </div>
        </div>
      </div>
      {/* /Details Main Section */}
    </>
  );
};
export default ServiceDetails;
