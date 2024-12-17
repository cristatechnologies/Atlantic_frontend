"use client";

import React, { useEffect } from "react";

import StickyBox from "react-sticky-box";
import { useState } from "react";
import Link from "next/link";
import Rooms from "./myComponent2";
import Roomspics from "./Roomspics";
import RoomsProfile from "./myComponent4";
import PhotoAlbum from "react-photo-album";
import StarRatings from "react-star-ratings";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import business from "@/app/signup/business/page";
import axios from "axios";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import AnimatedHeart from "./AnimatedHeart";
import { toast } from "react-toastify";
import { RWebShare } from "react-web-share";
import Head from "next/head";
import ServiceDetailActiveDealsCaruousel from "./ServiceDetailActiveDealsCaruousel";
import ServiceDetailCaruouselGallery from "./ServiceDetailCaruouselGallery";
import { useRef } from "react";

const ServiceDetails = ({ data, slug }) => {
  const pathname = usePathname();
  const [fullUrl, setFullUrl] = useState("");

  console.log(pathname);
  console.log(data);
  const [isFavorite, setIsFavorite] = useState(data.like);
  const [totalLikes, setTotalLikes] = useState(data.total_likes);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [completeData, setCompleteData] = useState([]);
  const [hasReviewed, setHasReviewed] = useState(0);
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [totalViews, setTotalViews] = useState();
  const isFetching = useRef(false);
  const [activeDeals, setActiveDeals] = useState([]);

  const [replyText, setReplyText] = useState({});
  const [businessReviews, setBusinessReviews] = useState([]);

  const [auth, setAuth] = useState(null);
  const [businessProfile, setBusinessProfile] = useState(null);
  
  useEffect(() => {
    if (!slug) return; // Prevent fetch if slug is not yet available

    async function fetchData() {
      if (isFetching.current) return; // Prevent duplicate fetches
      isFetching.current = true;

      try {
        const res = await axios
          .get(`${process.env.NEXT_PUBLIC_BASE_URL}api/business/${slug}`)
          .then((res) => {
            setHasReviewed(res?.data?.has_reviewed);
            setTotalViews(res?.data?.views);
            setIsFavorite(res?.data?.like);
            setActiveDeals(res?.data?.business_offers);
            setBusinessReviews(res?.data?.business_review || []);
          });
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        isFetching.current = false; // Reset fetch state
      }
    }

    fetchData();
  }, [slug]);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.access_token;
    setAuth(auth?.user?.business?.id);
    setBusinessProfile(auth?.user?.business);
    console.log("ServiceDetails mounted");
    return () => console.log("ServiceDetails unmounted");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Input changed:", name, value); // Debug log
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  console.log(fullUrl);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.access_token;

    try {
      const payload = {
        business_id: data.id,
        rating: rating,
        review: review,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/post-review?token=${token}`,
        payload
      );

      // Clear form after successful submission
      setReview("");
      setRating(0);
      toast.success("review added successfully");

      // You might want to refresh the reviews list here
      // or show a success message
      fetchBusinessReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      // Handle error - maybe show an error message to user
    }
  };
  const fetchBusinessReviews = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/business/${slug}`
      );
      setBusinessReviews(res?.data?.business_review || []);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  const handleReplySubmit = async (reviewId) => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.access_token;
    setAuth(auth?.user?.id);

    try {
      // Ensure reply is not empty and business ID exists
      if (!replyText[reviewId] || !auth) return;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/post-reply/${reviewId}?token=${token}`,
        {
          reply: replyText[reviewId],
        }
      );

      // Refresh reviews after successful reply
      fetchBusinessReviews();

      // Clear the reply text for this specific review
      setReplyText((prev) => ({ ...prev, [reviewId]: "" }));

      toast.success("Reply submitted successfully");
    } catch (error) {
      console.error("Error submitting reply", error);
      toast.error("Failed to submit reply");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    setFormData;

    console.log(formData);
    // const payload = JSON.stringify(formData)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/send-contact-message?name=${formData.name}&email=${formData.email}&message=${formData.message}`
      );

      if (response.data && response.status === 200) {
        // throw new Error(`HTTP error! status: ${response.status}`);
        console.log("Response:", data);
        setSuccess(true);
        setFormData({ name: "", email: "", message: "" }); // Reset form
        toast.success("Form Submitted Successfully");
      } else {
        toast.error(response.status);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplyChange = (reviewId, value) => {
    setReplyText((prev) => ({
      ...prev,
      [reviewId]: value,
    }));
  };

  const toggleFavorite = async () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.access_token;
    try {
      const payload = {
        business_id: data.id,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/post-like?token=${token}`,
        payload
      );
      console.log(res.data.total_likes);
      setTotalLikes(res.data.total_likes);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const isBusinessOwner = (review) => {
    return (
      businessProfile &&
      businessProfile.id === review.business_id &&
      review.reply === null
    );
  };

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
            className="service-banner-image"
          />
        </div>
      ) : (
        <div style={{ paddingTop: "170px", paddingBottom: "90px" }}></div>
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
                <div className="rating">
                  <StarRatings
                    rating={data.rating || 0}
                    starRatedColor="#FFD700"
                    starDimension="20px"
                    starSpacing="0.2px"
                    numberOfStars={5}
                    name="rating"
                  />
                  <span className="d-inline-block average-rating">
                    {data.rating || 0}
                  </span>
                </div>
              </div>
            </div>
            {/* <div className="rate-details">
              <h2>$350</h2>
              <p>Fixed</p>
            </div> */}
          </div>
          <div className="descriptionlinks">
            <div className="row">
              <div className="col-lg-9">
                <ul className="d-flex align-items-center gap-2 justify-content-center justify-content-lg-start">
                  {/* <li>
                    <Link href={data.website}>
                      <i className="feather-link" />
                      Website
                    </Link>
                  </li> */}
                  <li>
                    <Link className="pe-auto " href="#">
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
                        <i className="feather-share-2" />
                      </RWebShare>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <i className="feather-eye" /> {totalViews} Views
                    </Link>
                  </li>

                  <li>
                    <Link href="#review-sec">
                      <i className="feather-message-circle" /> review
                    </Link>
                  </li>
                  {/* <li>
                    <Link href="#">
                      <i className="feather-flag" /> report
                    </Link>
                  </li> */}
                  <div className="cursor-pointer">
                    <AnimatedHeart
                      isActive={isFavorite}
                      onClick={toggleFavorite}
                      totalLikes={totalLikes}
                    />
                  </div>
                </ul>
              </div>
              {/* <div className="col-lg-3">
                <div className="callnow">
                  <Link href="contact.html">
                    {" "}
                    <i className="feather-phone-call" /> Call Now
                  </Link>
                </div>
              </div> */}
            </div>
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
                    <ServiceDetailCaruouselGallery
                      data={data.business_gallery}
                    />
                    {/* <Roomspics images={data.business_gallery} /> */}
                  </div>
                </div>
              </div>

              <div className="card review-sec  mb-0" id="review-sec">
                <div className="card-header  align-items-center">
                  <i className="feather-message-circle" />
                  <h4>Review</h4>
                </div>
                <div className="container-fluid px-4">
                  <div className="reviews-section">
                    {businessReviews.map((review) => (
                      <div key={review.id} className="card mb-3 shadow-sm">
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-3">
                            <img
                              src={
                                review.user.image
                                  ? `${process.env.NEXT_PUBLIC_BASE_URL}${review.user.image}`
                                  : "/img/pngegg.png"
                              }
                              alt={review.user.name}
                              className="rounded-circle me-3"
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                            <div>
                              <h6 className="mb-1">{review.user.name}</h6>
                              <StarRatings
                                rating={review.rating}
                                starRatedColor="#FFD700"
                                starDimension="18px"
                                starSpacing="-28px"
                                numberOfStars={5}
                              />
                            </div>
                          </div>

                          <p className="card-text">{review.reviews}</p>

                          {/* Business Reply */}
                          {review.reply && (
                            <div className="bg-light px-4 py-2 rounded mt-2">
                              {/* <strong className="text-muted">
                                Business Reply:
                              </strong> */}
                              <p className="text-muted">{review.reply}</p>
                            </div>
                          )}

                          {/* Reply functionality for business owner */}
                          {isBusinessOwner(review) && (
                            <div className="mt-3">
                              <textarea
                                rows={2}
                                className="form-control mb-2"
                                placeholder="Write your reply"
                                value={replyText[review.id] || ""}
                                onChange={(e) =>
                                  handleReplyChange(review.id, e.target.value)
                                }
                              />
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleReplySubmit(review.id)}
                                disabled={!replyText[review.id]}
                              >
                                Submit Reply
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Review Submission Form */}
                    {hasReviewed === 0 && businessProfile?.slug !== slug && (
                      <div className="card">
                        <div className="card-body">
                          <form onSubmit={handleReviewSubmit}>
                            <div className="mb-3">
                              <textarea
                                rows={4}
                                className="form-control"
                                placeholder="Write a Review*"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                required
                              />
                            </div>
                            <div className="d-flex flexColSm justify-content-between  align-items-center">
                              <div className="rating-section">
                                <StarRatings
                                  rating={rating}
                                  starRatedColor="#FFD700"
                                  changeRating={(newRating) =>
                                    setRating(newRating)
                                  }
                                  numberOfStars={5}
                                  name="rating"
                                />
                              </div>
                              <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={!rating || !review}
                              >
                                Submit Review
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {activeDeals.length > 0 ? (
                <div className="card gallery-section ">
                  <div className="card-header ">
                    <img src="/img/galleryicon.svg" alt="gallery" />
                    <h4>Active Deals</h4>
                  </div>
                  <div className="card-body">
                    <div className="gallery-content">
                      {console.log("nudsiness_active:", activeDeals)}
                      <ServiceDetailActiveDealsCaruousel data={activeDeals} />
                      {/* <Roomspics images={data.business_gallery} /> */}
                    </div>
                  </div>
                </div>
              ) : null}

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
                        {data.address && (
                          <li>
                            <i className="feather-map-pin" />
                            {data.address}
                            <br />
                          </li>
                        )}
                        {data.contact_person_number && (
                          <li>
                            <a href={`tel:${data.contact_person_number}`}>
                              <i className="feather-phone-call" />
                              {data.contact_person_number}
                            </a>
                          </li>
                        )}
                        {data.contact_person_email && (
                          <li>
                            <a
                              href={`mailto:${data.contact_person_email}`}
                              className="text-truncate"
                            >
                              <i className="feather-mail" />{" "}
                              {data.contact_person_email}
                            </a>
                          </li>
                        )}
                        {data.website && (
                          <li>
                            <Link
                              href={`${data.website}`}
                              className="text-truncate"
                            >
                              <img src="/img/website.svg" alt="website" />{" "}
                              {data.website}
                            </Link>
                          </li>
                        )}
                        {(data.facebook ||
                          data.twitter ||
                          data.linkedin ||
                          data.instagram ||
                          data.youtube) && (
                          <li className="socialicons pb-0">
                            {data.facebook && (
                              <Link
                                href={`https://${data.facebook}`}
                                target="_blank"
                              >
                                <FontAwesomeIcon icon={faFacebookF} />
                              </Link>
                            )}
                            {data.twitter && (
                              <a
                                href={`https://${data.twitter}`}
                                target="_blank"
                              >
                                <FontAwesomeIcon icon={faTwitter} />
                              </a>
                            )}
                            {data.instagram && (
                              <Link
                                href={`https://${data.instagram}`}
                                target="_blank"
                              >
                                <FontAwesomeIcon icon={faInstagram} />
                              </Link>
                            )}
                            {data.linkedin && (
                              <Link
                                href={`https://${data.linkedin}`}
                                target="_blank"
                              >
                                <FontAwesomeIcon icon={faLinkedinIn} />
                              </Link>
                            )}
                            {data.youtube && (
                              <Link
                                href={`https://${data.youtube}`}
                                target="_blank"
                              >
                                <FontAwesomeIcon icon="fab fa-youtube" />
                              </Link>
                            )}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="card mb-0">
                    <h4>
                      <i className="feather-phone-call" /> Contact Business
                    </h4>
                    <form
                      className="contactbusinessform"
                      onSubmit={handleSubmit}
                    >
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email Address"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <textarea
                          rows={6}
                          className="form-control"
                          placeholder="Message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="submit-section">
                        <button
                          className="btn btn-primary submit-btn"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? "Sending..." : "Send Message"}
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
