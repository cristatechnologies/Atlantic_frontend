'use client'
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";

const ForgotPasswordComponent = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetPass, setResetpass] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState(null);

  const doForgot = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/send-forget-password`,
        {
          email: email,
        }
      );
      setResetpass(true);
      setLoading(false);
      setErrors(null);
      toast.success(
        response.data.message || "Password reset link sent to your email"
      );
    } catch (err) {
      console.log(err);
      setLoading(false);
      setErrors(err.response?.data);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

    const doReset = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/store-reset-password/${otp}`,
          {
            email: email,
            password: newPass,
            password_confirmation: confirmPassword,
          }
        );
        setLoading(false);
        router.push("/login");
        toast.success(response.data.message || "Password reset successful");
      } catch (err) {
        console.log(err);
        setLoading(false);
        setErrors(err.response?.data);
        if (err.response?.data?.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
    };

  return (
    <>
      {/* Breadcrumb Section */}
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center text-center">
            <div className="col-md-12 col-12">
              <h2 className="breadcrumb-title">Forgot Password</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Forgot Password
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb Section */}

      {/* Login Section */}
      <div className="login-content">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-5 mx-auto">
              <div className="login-wrap password-form">
                <div className="login-header">
                  <h3>Forgot Password</h3>
                  <p>
                    Enter your email and we will send you a link to reset your
                    password.
                  </p>
                </div>
                {/* Login Form */}
                {!resetPass ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      doForgot();
                    }}
                  >
                    <div className="form-group group-img">
                      <div className="group-img">
                        <i className="feather-mail" />
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value.trim())}
                          required
                        />
                      </div>
                    </div>
                    <button
                      className="btn btn-primary w-100 login-btn"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                  </form>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      doReset();
                    }}
                  >
                    <div className="form-group group-img">
                      <div className="group-img">
                        <i className="feather-lock" />
                        <input
                          type="text"
                          className="form-control"
                          placeholder="OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.trim())}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group group-img">
                      <div className="group-img">
                        <i className="feather-lock" />
                        <input
                          type="password"
                          className="form-control"
                          placeholder="New Password"
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value.trim())}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group group-img">
                      <div className="group-img">
                        <i className="feather-lock" />
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) =>
                            setConfirmPassword(e.target.value.trim())
                          }
                          required
                        />
                      </div>
                    </div>
                    <button
                      className="btn btn-primary w-100 login-btn"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Resetting..." : "Reset Password"}
                    </button>
                  </form>
                )}
                <Link href="/login" className="back-home">
                  <i className="fas fa-regular fa-arrow-left me-1" /> Back to
                  Login Page
                </Link>
                {/* /Login Form */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Login Section */}
    </>
  );
};

export default ForgotPasswordComponent;
