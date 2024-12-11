"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal from "react-modal";

const YourDealsComponent = () => {
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newOffer, setNewOffer] = useState({
    title: "",
    description: "",
    image: null,
  });

  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "90%",
      maxWidth: "400px",
      padding: "20px",
      borderRadius: "8px",
      zIndex: 1000,
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 999,
    },
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem("auth"));
        const token = auth?.access_token;
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/daily-offers?token=${token}`
        );
        setOffers(response.data);
      } catch (error) {
        console.error("Error fetching offers:", error);
        toast.error("Failed to fetch offers");
      }
    };

    fetchOffers();
  }, []);

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      const token = auth?.access_token;
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/daily-offer-status/${id}?token=${token}`,
        {
          status: currentStatus ? 0 : 1,
        }
      );

      setOffers(
        offers.map((offer) =>
          offer.id === id ? { ...offer, status: currentStatus ? 0 : 1 } : offer
        )
      );

      toast.success(response.data);
    } catch (error) {
      console.error("Error updating offer status:", error);
      toast.error("Failed to update offer status");
    }
  };
  const handleEdit = (id) => {
    router.push({
      pathname: "/your-deals/[id]",
      query: { id: id },
    });
  };
  const handleDelete = async (id) => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      const token = auth?.access_token;
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/delete-daily-offer/${id}?token=${token}`
      );
      setOffers(offers.filter((offer) => offer.id !== id));
      toast.success("Offer deleted successfully");
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast.error("Failed to delete offer");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOffer({ ...newOffer, [name]: value });
  };

  const handleImageUpload = (e) => {
    setNewOffer({ ...newOffer, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newOffer.image) {
      toast.error("Please select an image");
      return;
    }
    const formData = new FormData();
    formData.append("title", newOffer.title);
    formData.append("description", newOffer.description);
    formData.append("image", newOffer.image);

    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      const token = auth?.access_token;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/store-daily-offer?token=${token}`,
        formData
      );

      console.log(res)
      toast.success(res.data.notification);
      setOffers(res.data.dailyOffers);
      setModalIsOpen(false);
     
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        // Handle validation errors
        Object.entries(err.response.data.errors).forEach(([key, value]) => {
          toast.error(`${value[0]}`);
        });
      } else {
        // Handle other types of errors
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center text-center">
            <div className="col-12">
              <h2 className="breadcrumb-title">Your Deals</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    your-deals
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-content">
        <div className="search-btn px-4">
          <button
            className="btn btn-primary w-full sm:w-auto"
            onClick={() => setModalIsOpen(true)}
          >
            Add New
          </button>
        </div>
        <div className="container px-4">
          <div className="row">
            <div className="col-12">
              <div className="card dash-cards">
                <div className="card-header">
                  <h4>Your Daily Offers</h4>
                </div>
                <div className="card-body">
                  <div className="offer-header d-none d-md-flex align-items-center mb-3">
                    <div className="col-md-1">
                      <strong>Image</strong>
                    </div>
                    <div className="col-md-5">
                      <strong>Name</strong>
                    </div>
                    <div className="col-md-3">
                      <strong>Status</strong>
                    </div>
                    <div className="col-md-3">
                      <strong>Action</strong>
                    </div>
                  </div>

                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="offer-item mb-4 p-3 border rounded"
                    >
                      <div className="d-flex flex-column flex-md-row align-items-center">
                        <div className="col-12 col-md-1 mb-3 mb-md-0">
                          <img
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}${offer.image}`}
                            alt={offer.title}
                            className="img-fluid rounded"
                            style={{ width: "50px", height: "50px" }}
                          />
                        </div>
                        <div className="col-12 col-md-5 mb-3 mb-md-0 text-center text-md-start">
                          <h5 className="mb-1">{offer.title}</h5>
                          <p className="mb-0 small">{offer.description}</p>
                        </div>
                        <div className="col-12 col-md-3 mb-3 mb-md-0 text-center">
                          <Switch
                            checked={offer.status === 1}
                            onChange={() =>
                              handleStatusToggle(offer.id, offer.status)
                            }
                          />
                        </div>
                        <div className="col-12 col-md-3 d-flex justify-content-center gap-2">
                          <Link href={`/your-deals/${offer.id}`}>
                            <button className="btn btn-sm btn-primary action-button">
                              <i className="feather-edit" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(offer.id)}
                            className="btn btn-sm btn-danger action-button"
                          >
                            <i className="feather-trash-2" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customModalStyles}
        ariaHideApp={false}
        contentLabel="Add New Offer"
      >
        <h2 className="mb-4">Add New Offer</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="title" className="form-label">
              Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={newOffer.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="description" className="form-label">
              Description<span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={newOffer.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="form-group mb-4">
            <label htmlFor="image" className="form-label">
              Image<span className="text-danger">*</span>
            </label>
            <input
              type="file"
              className="form-control"
              id="image"
              name="image"
              onChange={handleImageUpload}
              required
            />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setModalIsOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      <style jsx>{`
        .action-button {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .offer-item {
          background: #fff;
          transition: all 0.3s ease;
        }

        .offer-item:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .offer-item h5 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .offer-item p {
          margin-bottom: 0;
        }

        img {
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .dashboard-content {
            padding: 1rem 0;
          }

          .card-body {
            padding: 1rem;
          }

          .offer-item {
            padding: 1rem;
          }

          .breadcrumb-title {
            font-size: 1.5rem;
          }
        }

        .gap-2 {
          gap: 0.5rem;
        }
      `}</style>
    </>
  );
};

export default YourDealsComponent;
