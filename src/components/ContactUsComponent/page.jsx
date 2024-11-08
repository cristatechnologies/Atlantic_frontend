'use client'

import axios from "axios";
import Link from "next/link";
import { useState,useEffect } from "react";

const ContactUsComponent = () => {
  
   const [data, setData] = useState([]);
   useEffect(() => {
     const fetchData = async () => {
       try {
         const response = await axios.get(
           `${process.env.NEXT_PUBLIC_BASE_URL}api/contact-us`
         );
         setData(response);
         console.log("response from api contact us ", response);
       } catch (error) {
         console.error("Error fetching data:", error);
       }
     };
     fetchData();
   }, []);


  return (
    <>
      {/*Inner Banner*/}
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center text-center">
            <div className="col-md-12 col-12">
              <h2 className="breadcrumb-title">Contact - Us</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    contact-us{" "}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/*/Inner Banner*/}
      {/*contact Information*/}
      <div className="contactus-info">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 contactus-img col-md-12">
              <div className="contactleft-info">
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${data?.data?.contact?.image}`}
                  className="img-fluid"
                  alt=""
                  onError={(e) => {
                    e.target.onerror = null; // Prevents infinite loop in case the default image also fails
                    e.target.src = "/public/path/default-image.webp";
                  }}
                />
                <div className="contactinfo-content fs-6">
                  <div className="contact-hours">
                    <h6>Hours</h6>
                    <ul>
                      <li>Tuesday - Saturday : 9am - 5pm</li>
                      <li>Monday: 10:30am - 3pm Closed on Sunday</li>
                    </ul>
                  </div>
                  <div className="contact-hours">
                    <h6>Contact Us</h6>
                    <ul className="fs-6">
                      <li></li>
                      <li>Tel : {data?.data?.contact?.phone}</li>
                      <li> Email : {data?.contact?.email} </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 contactright-map col-md-12">
              <div className="google-maps">
                <iframe
                  src={data?.data?.contact?.map}
                  width={600}
                  height={544}
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*/contact Information*/}
      {/*contact Form*/}
      {/* <section className="contactusform-section">
        <div className="container">
          <div className="contact-info">
            <h2>
              Contact <span>Us</span>
            </h2>
            <p>We are here to help you</p>
          </div>
          <div className="row align-items-center">
            <div className="col-lg-5 col-md-5">
              <div className="contactform-img">
                <img src="/iuh" className="img-fluid" alt="" />
              </div>
            </div>
            <div className="col-lg-7 col-md-7">
              <div className="contactus-form">
                <form className="">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name*"
                      required=""
                    />
                  </div>
                  <div className="form-group me-0">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email*"
                      required=""
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Subject"
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      rows={4}
                      className="form-control"
                      placeholder="Write a Message*"
                      required=""
                      defaultValue={""}
                    />
                  </div>
                  <div className="submit-section">
                    <button
                      className="btn btn-primary submit-btn"
                      type="submit"
                    >
                      {" "}
                      Submit{" "}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/*/contact Form*/}
    </>
  );
};

export default ContactUsComponent;
