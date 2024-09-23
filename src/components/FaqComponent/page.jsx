"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const FaqComponent = () => {
  const [faqs, setFaqs] = useState([]);
  const [openFaqs, setOpenFaqs] = useState({});

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/faq`
        );
        setFaqs(response.data.faqs);
        // Initialize all FAQs as closed
        const initialOpenState = response.data.faqs.reduce((acc, faq) => {
          acc[faq.id] = false;
          return acc;
        }, {});
        setOpenFaqs(initialOpenState);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFaq = (id) => {
    setOpenFaqs((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  return (
    <>
      {/* Breadscrumb Section */}
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center text-center">
            <div className="col-md-12 col-12">
              <h2 className="breadcrumb-title">Frequently Asked Questions</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="index.html">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    FAQ
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadscrumb Section */}
      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="faq-info">
            <div className="page-title">
              <h2>Frequently Asked Questions</h2>
            </div>
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="faq-card"
                onClick={() => toggleFaq(faq.id)}
              >
                <h4 className="faq-title">
                  <Link
                    className={openFaqs[faq.id] ? "" : "collapsed"}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    {faq.question}
                  </Link>
                </h4>
                <div
                  className={`card-collapse collapse ${
                    openFaqs[faq.id] ? "show" : ""
                  }`}
                >
                  <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* /FAQ Section */}
    </>
  );
};
export default FaqComponent;
