const { useState, useEffect } = require("react");
import axios from "axios";
import Link from "next/link";

import { RWebShare } from "react-web-share";



const AcitveDealsComponent = ({ pathName }) => {
  const slug = pathName.split("/")[2];
  console.log("slug in active-deals slug page is ", slug);
  const [apiData,setApiData] = useState()

   useEffect(() => {
     const fetchDailyOffersBySlug = async () => {
   

       try {
         const auth = JSON.parse(localStorage.getItem("auth") || "null");
         const token = auth?.access_token;

         if (!token) {
           throw new Error("Authentication token not found");
         }

         const response = await fetch(
           `${process.env.NEXT_PUBLIC_BASE_URL}api/user/daily-offers-slug/${slug}?token=${token}`
         );

         if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
         }

         const data = await response.json();
         console.log(data);
         setApiData(data);
       } catch (error) {
         console.error("Error fetching daily offers:", error);
        
       }
     };

     if (slug) {
       fetchDailyOffersBySlug();
     }
   }, [slug]);

  return (
    <>
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center text-center">
            <div className="col-md-12 col-12">
              <h2 className="breadcrumb-title">{apiData?.title}</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href="/active-deals">Active Deals</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {apiData?.slug}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="bloglisting">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12 blog-listview">
              <div className="bloglistleft-widget blog-listview">
                <div className="card">
                  <div className="blog-widget">
                    <div className="blog-img">
                      <img
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${apiData?.image}`}
                        className="img-fluid"
                        alt="blog-img"   
                      />
                    </div>
                    <div className="bloglist-content">
                      <div className="card-body">
                        <ul className="entry-meta meta-item">
                          <li>
                            <div className="post-author"></div>
                          </li>
                        </ul>
                        <h3 className="blog-title">{apiData?.title}</h3>
                        <p className="mb-0">{apiData?.description}</p>
                        <a className="pe-auto">
                          <RWebShare
                            data={{
                              // image: `${process.env.NEXT_PUBLIC_BASE_URL}${offer.image}`,
                              text: "Look i got a Great Deal from IndoAtlantic !!",
                              url: `https://indoatlantic.ca${pathName}`,
                              title: "indoatlantic",
                            }}
                            sites={[
                              "facebook",
                              "twitter",
                              "whatsapp",
                              "linkedin",
                              "reddit",
                              "mail",
                              "copy",
                            ]}
                            onClick={() => console.log("shared successfully!")}
                          >
                            <i className="feather-share-2" />
                          </RWebShare>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AcitveDealsComponent;
