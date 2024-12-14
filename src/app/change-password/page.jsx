'use client'

import React, { useState } from "react";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if new password and confirmation match
    if (formData.password !== formData.password_confirmation) {
      toast.error("New passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      // Retrieve auth token from localStorage
      const auth = JSON.parse(localStorage.getItem("auth") || "null");
      const token = auth?.access_token;

      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/update-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: formData.current_password,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Success toast
        toast.success(data.message || "Password updated successfully!");

        // Reset form
        setFormData({
          current_password: "",
          password: "",
          password_confirmation: "",
        });
      } else {
        // Error toast with server message
        toast.error(data.message || "Password update failed");
      }
    } catch (error) {
      // Network or unexpected error toast
      toast.error("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="container"
      style={{ paddingTop: "200px", paddingBottom: "90px" }}
    >
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded shadow-sm"
          >
            <h2 className="text-center mb-4">Update Password</h2>

            <div className="mb-3">
              <label htmlFor="current_password" className="form-label">
                Current Password *
              </label>
              <input
                type="password"
                id="current_password"
                className="form-control"
                name="current_password"
                value={formData.current_password}
                onChange={handleInputChange}
                required
                placeholder="Enter your current password"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                New Password *
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter new password"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password_confirmation" className="form-label">
                Confirm New Password *
              </label>
              <input
                type="password"
                id="password_confirmation"
                className="form-control"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleInputChange}
                required
                placeholder="Confirm new password"
              />
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
