"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { RWebShare } from "react-web-share";
import AnimatedHeart from "../serviceDetails/AnimatedHeart";

import axios from "axios";


const AcitveDealsComponent = ({ pathName }) => {
  const router = useRouter();
  const slug = pathName.split("/")[2];

  const [isFavorite, setIsFavorite] = useState();
  const [totalLikes, setTotalLikes] = useState();
  const [fullUrl, setFullUrl] = useState("");
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);



   const toggleFavorite = async () => {
     const auth = JSON.parse(localStorage.getItem("auth"));
     const token = auth?.access_token;
     try {
       const payload = {
        
         daily_offer_id: apiData.id, // Changed from data.id to apiData.id
       };
       const res = await axios.post(
         `${process.env.NEXT_PUBLIC_BASE_URL}api/user/daily-offers/post-like?token=${token}`,
         payload
       );
       console.log(res.data.total_likes);
       setTotalLikes(res.data.total_likes);
       setIsFavorite(!isFavorite);
     } catch (error) {
       console.error("Error toggling favorite:", error);
       toast.error("Failed to like the deal");
     }
   };
  useEffect(() => {
    // Authentication check
    const auth = JSON.parse(localStorage.getItem("auth") || "null");
    const token = auth?.access_token;

    if (!token) {
      toast.error("Please log in.");
      router.push("/login");
      return;
    }


  

    // Fetch data after authentication
    const fetchDailyOffersBySlug = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/daily-offers-slug/${slug}?token=${token}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setApiData(data);
        setTotalLikes(data.total_likes); // Initialize total likes
        setIsFavorite(data.is_liked); // Initialize favorite status
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching daily offers:", error);
        toast.error("Failed to load deal details");
        router.push("/login");
      }
    };

    fetchDailyOffersBySlug();
  }, [slug, router]);

  useEffect(() => {
    // This will work only on the client-side
    setFullUrl(window.location.href);
  }, []);

  // Loading state
  if (isLoading) {
    return (
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
    );
  }

  // No data found
  if (!apiData) {
    return <div>No deal found</div>;
  }
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
                    <Link href="/active-Offers">Active Offers</Link>
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
      <div className="my-3 sm:my-5">
        <div className="container card">
          <div className="row">
            <div className="col-md-6 h-auto">
              <div className="container">
                <div className="row gx-4">
                  <div className="col-12">
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}${apiData?.image}`}
                      className="img-fluid w-100 h-100 d-md-block"
                      style={{ maxHeight: "500px", maxWidth: "500px" }}
                      alt="deal-img"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 h-auto">
              <div>
                <h3 className="deal-title">{apiData?.title}</h3>
                <div className="descriptionlinks">
                  <ul className="d-flex align-items-center  justify-content-center justify-content-lg-start">
                    <li>
                      <Link className="pe-auto  " href="#">
                        <div className="d-flex align-items-center justify-content-center w-100" >
                          <RWebShare
                            data={{
                              text: "Look i got a Great Business from IndoAtlantic !!",
                              url: `${fullUrl}`,
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
                            <i className="feather-share-2 me-3" />
                          </RWebShare>
                          Share
                        </div>
                      </Link>
                    </li>
                    <AnimatedHeart
                      isActive={isFavorite}
                      onClick={toggleFavorite}
                      totalLikes={totalLikes}
                    />

                    <Link href="#">
                      <i className="feather-eye" /> {apiData.views || 0} Views
                    </Link>
                  </ul>
                </div>
                <p className="mb-4">{apiData?.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AcitveDealsComponent;
