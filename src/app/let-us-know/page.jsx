'use client'

import React, { useState } from "react";
import Link from "next/link";

const LetUsKnow = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [formData, setFormData] = useState({
    reason: "",
    description: "",
    link: "",
    screenshot: null,
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const handleReasonChange = (e) => {
    const value = e.target.value;
    setSelectedReason(value);
    setFormData((prev) => ({ ...prev, reason: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, screenshot: file }));
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE}api/let-us-know`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (response.ok) {
        showToast("Your message has been sent successfully!", "success");
        // Reset form
        setFormData({
          reason: "",
          description: "",
          link: "",
          screenshot: null,
        });
        setSelectedReason("");
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      showToast(error.message, "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  const shouldShowAdditionalFields =
    selectedReason === "issue-with-website" || selectedReason === "suggestions";

  return (
    <>
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center text-center">
            <div className="col-md-12 col-12">
              <h2 className="breadcrumb-title">Let Us Know</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    let-us-know
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {/* Toast Notification */}
            {toast.show && (
              <div
                className={`alert alert-${toast.type} alert-dismissible fade show`}
                role="alert"
              >
                {toast.message}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setToast({ show: false, message: "", type: "" })
                  }
                ></button>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white p-4 rounded shadow-sm"
            >
              <div className="mb-3">
                <label htmlFor="reason" className="form-label">
                  Reason *
                </label>
                <select
                  id="reason"
                  className="form-select"
                  required
                  value={formData.reason}
                  onChange={handleReasonChange}
                >
                  <option value="">Select a reason</option>
                  <option value="general-inquiry">General Inquiry</option>
                  <option value="issue-with-website">Issue with Website</option>
                  <option value="suggestions">Suggestions</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description *
                </label>
                <textarea
                  id="description"
                  className="form-control"
                  rows="5"
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Please provide detailed information..."
                ></textarea>
              </div>

              {shouldShowAdditionalFields && (
                <>
                  <div className="mb-3">
                    <label htmlFor="link" className="form-label">
                      Link (Optional)
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="link"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      placeholder="https://"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="screenshot" className="form-label">
                      Screenshot (Optional)
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="screenshot"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </>
              )}

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
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LetUsKnow;
