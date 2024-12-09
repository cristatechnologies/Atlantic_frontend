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
      <div className="container">
        {/* <div className="stay-tuned">
          <h3>Stay Tuned With Us</h3>
          <p>
            Subcribe to our newletter and never miss our latest news and
            promotions. Our newsletter is sent once a week, every thursday.
          </p>
          <form>
            <div className="form-group">
              <div className="group-img">
                <i className="feather-mail"></i>
                <input
                  onChange={(e) => setEmail(e.target.value.trim())}
                  value={email}
                  type="text"
                  className="form-control"
                  placeholder="Enter Email Address"
                />
              </div>
            </div>
            <button
              className="btn btn-primary"
              type="button"
              onClick={subscribehandler}
            >
              {" "}
              Subscribe
            </button>
          </form>
        </div> */}
      </div>

      <div className="footer-top aos" data-aos="fade-up">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="footer-widget">
                <div className="footer-logo">
                  <Link href="/">
                    <Image
                      src={`${
                        process.env.NEXT_PUBLIC_BASE_URL +
                        websiteData?.setting?.logo
                      }`}
                      alt="logo"
                      width={200}
                      height={100}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        objectFit: "contain",
                      }}
                      unoptimized={true}
                    />
                  </Link>
                </div>
                <div className="footer-content">
                  <p>{websiteData?.footer?.about_us}</p>
                </div>
                <div className="social-icon">
                  <ul>
                    {websiteData?.social_links?.map((socialLink) => (
                      <li key={socialLink.id}>
                        <Link href={socialLink.link} target="_blank">
                          <FontAwesomeIcon icon={socialLink.icon} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {firstCol && firstCol.col_links.length !== 0 && (
              <>
                <div className="col-lg-2 col-md-6">
                  <div className="footer-widget footer-menu">
                    <h2 className="footer-title"> {firstCol.columnTitle}</h2>
                    <ul>
                      {firstCol.col_links.length > 0 &&
                        firstCol.col_links.map((item, i) => (
                          <li key={i}>
                            <Link href={item.link}>{item.title}</Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
            {secondCol && secondCol.col_links.length !== 0 && (
              <div className="col-lg-6 col-md-6">
                <div className="footer-widget footer-menu">
                  <h2 className="footer-title"> {secondCol.columnTitle}</h2>
                  <ul>
                    {secondCol.col_links.length > 0 &&
                      secondCol.col_links.map((item, i) => (
                        <li key={i}>
                          <Link href={item.link}> {item.title}</Link>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}
            {thirdCol && thirdCol.col_links.length !== 0 && (
              <div className="col-lg-2 col-md-6">
                <div className="footer-widget footer-menu">
                  <h2 className="footer-title"> {thirdCol.columnTitle}</h2>
                  <ul>
                    {thirdCol.col_links.length > 0 &&
                      thirdCol.col_links.map((item, i) => (
                        <li key={i}>
                          <Link href={item.link}> {item.title}</Link>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}
            {/* <div className="col-lg-3 col-md-6">
              <div className="footer-widget">
                <h2 className="footer-title">Communication</h2>
                <div className="footer-contact-info">
                  <div className="footer-address">
                    <img src="img/call-calling.svg" alt="Callus" />
                    <p>
                      <span>Call Us</span> <br /> {websiteData?.footer?.phone}{" "}
                    </p>
                  </div>
                  <div className="footer-address">
                    <img src="/img/sms-tracking.svg" alt="Callus" />
                    <p>
                      <span>Send Message</span> <br />{" "}
                      {websiteData?.footer?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          {/* <div className="footercount"> */}
            {/* <div className="row">
              <div className="col-lg-3 col-md-3">
                <div className="vistors-details">
                  <p>Our Unique Visitor</p>
                  <p className="visitors-value">25,329,532</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-3">
                <div className="vistors-details">
                  <p>Our Unique Visitor</p>
                  <p className="visitors-value">25,329,53264546</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-3">
                <div className="vistors-details">
                  <p>Our Unique Visitor</p>
                  <p className="visitors-value">25,329,53264546</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-3">
                <div className="vistors-details">
                  <p>We Accept</p>
                  <ul className="d-flex">
                    <li>
                      <Link href="#">
                        <img
                          className="img-fluid"
                          src="/img/amex-pay.svg"
                          alt="amex"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <img
                          className="img-fluid"
                          src="/img/apple-pay.svg"
                          alt="pay"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <img
                          className="img-fluid"
                          src="/img/gpay.svg"
                          alt="gpay"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <img
                          className="img-fluid"
                          src="/img/master.svg"
                          alt="paycard"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <img
                          className="img-fluid"
                          src="/img/phone.svg"
                          alt="spay"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <img
                          className="img-fluid"
                          src="/img/visa.svg"
                          alt="visa"
                        />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div> */}
          {/* </div> */}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="copyright">
            <div className="row">
              <div className="col-md-6">
                <div className="copyright-text">
                  <p className="mb-0">{websiteData?.footer?.copyright}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="copyright-menu">
                  <ul className="policy-menu">
                    <li>
                      <Link href="/privacy-policy">Privacy </Link>
                    </li>
                    <li>
                      <Link href="/faq">Faq </Link>
                    </li>
                    <li>
                      <Link href="/terms-condition">Terms</Link>
                    </li>
                  </ul>
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
