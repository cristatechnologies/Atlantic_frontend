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

          <div>
            {secondCol && secondCol.col_links.length !== 0 && (
              <div className="footer-widget footer-menu mb-4">
                <div className="row">
                  <div className="lg-col-12 md-col-6">
                    <div className="d-flex flex-wrap align-items-center justify-content-between text-white" style={{ fontSize: "15px" }}>

                      {/* Download button */}
                      {/* <p className="mb-0 me-3">Download the App</p> */}

                      {/* Dynamic footer links */}
                      {secondCol.col_links.map((item, i) => (
                        <Link
                          key={i}
                          href={item.link}
                          className="text-white text-decoration-none me-3"
                        >
                          {item.title}
                        </Link>
                      ))}

                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="row text-center mt-4 mb-2">
            {/* App Store + Google Play */}
            <div className="col-lg-12 col-md-12 mb-4 d-flex align-items-lg-start justify-content-lg-start justify-content-center ms-lg-1 px-1 mb-lg-0">
              <Link href="https://apps.apple.com/us/app/indoatlantic/id6749743789">
                <img
                  src="/img/download-image/png-transparent-eco-surv-app-store-apple-itunes-store-thumbnail-removebg-preview.png"
                  alt="App Store"
                  width={150}
                  className="me-2"
                />
              </Link>
              <Link href="https://play.google.com/store/apps/details?id=com.app.indoatlantic">
                <img
                  src="/img/download-image/png-transparent-google-play-computer-icons-android-google-text-label-logo-removebg-preview.png"
                  alt="Google Play"
                  width={150}
                />
              </Link>
            </div>

          </div>

          <div className="row text-center">
            <div className="col-lg-12 col-md-12">
              <div className="text-white" style={{ fontSize: "15px" }}>
                <p className="mb-1">{websiteData?.footer?.about_us}</p>
                <p className="mb-0">{websiteData?.footer?.copyright}</p>
              </div>
            </div>
          </div>

        </div>
        

      </div>


    </footer>
  );
};

export default Footer;
