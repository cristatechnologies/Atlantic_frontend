"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Amexpay,
  Applepay,
  CallCallingSvg,
  FooterLogo,
  Gpay,
  Master,
  Phone,
  SmsTracking,
  Visa,
} from "../../imagepath";
import AOS from "aos";
import "aos/dist/aos.css";
import { useSelector } from "react-redux";
// import settings from "../../../../utils/settings";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import { toast } from "react-toastify";
library.add(fab);

const Footer = () => {
  const [firstCol, setFirstCol] = useState(null);
  const [secondCol, setSecondCol] = useState(null);
  const [thirdCol, setThirdCol] = useState(null);
  const [footerContent, setFooterContent] = useState(null);
  const [email, setEmail] = useState("");

  // const setting = settings();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const websiteData = useSelector((state) => state.websiteSetup.data);

  useEffect(() => {
    if (!footerContent) {
      setFooterContent(websiteData?.footer);
    }
  });

  useEffect(() => {
    if (!firstCol) {
      setFirstCol(websiteData?.footer_first_col);
    }
  });
  useEffect(() => {
    if (!secondCol) {
      setSecondCol(websiteData?.footer_second_col);
    }
  });
  useEffect(() => {
    if (!thirdCol) {
      setThirdCol(websiteData?.footer_third_col);
    }
  });

  const subscribehandler = () => {
    const response = axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}api/subscribe-request`, {
        email: email,
      })
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response && err.response.data.message);
      });
  };

  return (
    <footer className="footer">
      <div
        className=" aos"
        data-aos="fade-up"
        style={{ marginTop: "20px", paddingBottom: "20px" }}
      >
        <div className="container">
          <div className="row ">
            {/* First Column: Download Images and Links */}
            <div className="col-lg-3 col-md-12 mb-4 mb-lg-0 footer-Image ">
              <p className="text-white Download" style={{ fontSize: "15px" }}>
                Download the App
              </p>
            </div>
            <div className="col-lg-9 col-md-12">
              {secondCol && secondCol.col_links.length !== 0 && (
                <div className="footer-widget footer-menu mb-4">
                  <div className="row">
                    {secondCol.col_links.map((item, i) => (
                      <div
                        key={i}
                        className="col-lg-3 col-md-6 text-white"
                        style={{ fontSize: "15px" }}
                      >
                        <div className="footer-copyright footer-image">
                          <Link href={item.link}>{item.title}</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="row align-items-center  ">
            <div className="col-lg-3 col-md-12 mb-4 mb-lg-0 footer-image">
              <img
                src={
                  "/img/download-image/png-transparent-eco-surv-app-store-apple-itunes-store-thumbnail-removebg-preview.png"
                }
                alt="App Store"
                width={150}
              />{" "}
              <img
                src={
                  "/img/download-image/png-transparent-google-play-computer-icons-android-google-text-label-logo-removebg-preview.png"
                }
                alt="Google Play"
                width={150}
              />
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="footer-copyright">
                <div
                  className="text-white mb-0 footer-image"
                  style={{
                    fontSize: "15px",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection:"column",
                    alignItems:"center"
                  }}
                >
      <p style={{marginBottom:"0px"}}>

                  {websiteData?.footer?.about_us}
      </p>
        <p>
          
                   {websiteData?.footer?.copyright}
          </p> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
