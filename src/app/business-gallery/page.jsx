'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";



const BusinessGallery = () => {
  const router = useRouter();
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "null");
      const token = auth?.access_token;
      if (token == null || auth?.user?.user_type !== 1) {
        router.push("/login");
      }

      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/business-gallery?token=${token}`
      );
      const data = await response.json();
      if (data.notification === "Fetched Successfully") {
        setGalleryData(data.gallery);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching gallery data:", error);
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    try {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      setUploading(true);
      const auth = JSON.parse(localStorage.getItem("auth") || "null");
      const token = auth?.access_token;

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images[]", file);
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/store-business-gallery?token=${token}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        toast.success("Images uploaded successfully");
        // Refresh gallery data
        fetchGalleryData();
      } else {
        const data = await response.json();
        toast.error(data.notification || "Failed to upload images");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Error uploading images");
    } finally {
      setUploading(false);
      // Reset the file input
      event.target.value = "";
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "null");
      const token = auth?.access_token;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/business-gallery-status/${id}?token=${token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setGalleryData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, status: currentStatus ? 0 : 1 } : item
          )
        );
        toast.success("Status updated successfully");
      } else {
        console.error("Failed to update status");
        toast.error(response.notification || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    const auth = JSON.parse(localStorage.getItem("auth") || "null");
    const token = auth?.access_token;
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/delete-business-image/${id}?token=${token}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setGalleryData((prevData) =>
            prevData.filter((item) => item.id !== id)
          );
          toast.success(response?.notification || "Image Deleted Successfully");
        } else {
          toast.error(response.notification || "Failed to update status");
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error(error || "Failed to update status");
      }
    }
  };

  return (
    <>
      {/* Breadcrumb Section */}

      {/* Gallery Content */}
      <div
        className="container mt-4 mb-4"
        style={{ paddingTop: "170px", paddingBottom: "90px" }}
      >
        {loading ? (
          // <div className="d-flex justify-content-center align-items-center min-vh-50">
          //   <p className="fs-4">Loading gallery...</p>
          // </div>
          <div class="card_two h-100">
            <div class="loader">
              <p>loading</p>
              <div class="words">
                <span class="word">Items</span>
                <span class="word">Images</span>
                <span class="word">Gallery</span>                
              </div>
            </div>
          </div>
        ) : (
          <div className=" card ">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0">Gallery Items</h4>
              <div className="upload-btn-wrapper">
                <button className="btn btn-primary" disabled={uploading}>
                  {uploading ? "Uploading..." : "Add New Images"}
                </button>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="file-input"
                />
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Image</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {galleryData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>
                          <div style={{ width: "160px", height: "96px" }}>
                            <img
                              src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.image}`}
                              alt={`Gallery item ${item.id}`}
                              className="img-fluid rounded"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="form-check form-switch">
                            <input
                              type="checkbox"
                              className="form-check-input custom-switch"
                              checked={item.status === 1}
                              onChange={() =>
                                handleStatusToggle(item.id, item.status)
                              }
                              style={{
                                backgroundColor:
                                  item.status === 1 ? "#28a745" : "#dc3545",
                                border: "none",
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for the switch and file input */}
      <style jsx>{`
        .custom-switch {
          width: 60px;
          height: 30px;
          cursor: pointer;
        }

        .custom-switch:checked {
          background-color: #28a745 !important;
        }

        .custom-switch:not(:checked) {
          background-color: #dc3545 !important;
        }

        .min-vh-50 {
          min-height: 50vh;
        }

        .upload-btn-wrapper {
          position: relative;
          overflow: hidden;
          display: inline-block;
        }

        .file-input {
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .file-input:disabled {
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
};

export default BusinessGallery;
