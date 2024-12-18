"use client";

import React, { useState, useEffect } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
const EditOfferPage = ({ params }) => {

  const { id } = params; 
  const router = useRouter();// Destructure here, but handle undefined case
  const [offer, setOffer] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
 

 
  useEffect(() => {
    const fetchOffer = async () => {
      if (id) {
        try {
          const auth = JSON.parse(localStorage.getItem("auth"));
          const token = auth?.access_token;
          
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}api/user/daily-offers/${id}?token=${token}`
          );
          setOffer(response.data);
          setImagePreview(
            `${process.env.NEXT_PUBLIC_BASE_URL}${response.data.image}`
          );
          setLoading(false);
        } catch (error) {
          console.error("Error fetching offer:", error);
          toast.error("Failed to fetch offer details");
          setLoading(false);
        }
      }
    };

    // Only fetch if the id is defined
    if (id) {
      fetchOffer();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOffer({ ...offer, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOffer({ ...offer, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", offer.title);
    formData.append("description", offer.description);
    if (offer.image instanceof File) {
      formData.append("image", offer.image, offer.image.name);
    }

    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      const token = auth?.access_token;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/update-daily-offer/${id}?token=${token}`,
        formData
      );
      toast.success(response.notification);
      router.push("/my-offers"); // Redirect to the deals page after successful update
    } catch (error) {
      console.error("Error updating offer:", error);
      toast.error("Failed to update offer");
    }
  };

  if (loading) {
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

  return (
    <div className="container mt-3" style={{paddingTop:"170px",paddingBottom:"90px"}}>
      <h1 className="mb-4">Edit Offer</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={offer.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={offer.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        {imagePreview && (
          <div className="mb-3">
            <img
              src={imagePreview}
              alt="Offer preview"
              style={{ maxWidth: "200px" }}
            />
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Image
          </label>
          <input
            type="file"
            className="form-control"
            id="image"
            name="image"
            onChange={handleImageUpload}
            accept="image/*"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
        <Link href="/my-offers" className="btn btn-secondary ms-2">
          Cancel
        </Link>
      </form>
    </div>
  );
};

export default EditOfferPage;
