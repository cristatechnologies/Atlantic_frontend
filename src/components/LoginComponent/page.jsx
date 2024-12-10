'use client'

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const LoginComponent = () => {
  const [passwordType, setPasswordType] = useState("password");
  const [passwordInput, setPasswordInput] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const[region,setRegion ] = useState("");
  const router = useRouter();

  const handlePasswordChange = (evnt) => {
    setPasswordInput(evnt.target.value);
  };

  const handleEmailChange = (evnt) => {
    setEmail(evnt.target.value);
  };

  const togglePassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const redirectToPage = (url) => {
    window.location.href = url;
  };


  const handleVerificationClick = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting to resend verification code");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/resend-register-code`,
        { email: email }
      );
      console.log("API response:", response);
      if (response.data && response.status === 200) {
        toast.success("Verification code sent successfully!");
        router.push(`/verification-page?email=${email}`);
      } else {
        toast.error("Failed to send verification code. Please try again.");
      }
    } catch (err) {
      console.error("Error sending verification code:", err);
      toast.error(
        err.response?.data?.notification ||
          "An error occurred. Please try again."
      );
    }
  };



  


  const handleResendCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/resend-register-code`,
        { email: email }
      );
      if (response.data && response.status === 200) {
        toast.success("Verification code resent successfully!");
        router.push("/verification-page");
      } else {
        toast.error("Failed to resend verification code. Please try again.");
      }
    } catch (err) {
      console.error("Error resending code:", err);
      toast.error(
        err.response?.data?.notification ||
          "An error occurred. Please try again."
      );
    }
  };
 const handleSubmit = async (e) => {
   e.preventDefault();
   setError("");

   try {
     const response = await axios.post(
       `${process.env.NEXT_PUBLIC_BASE_URL}api/store-login`,
       {
         email: email,
         password: passwordInput,
       }
     );

     if (response.data && response.status === 200) {
       // Handle successful login
       toast.success("Login Success !!");
       localStorage.removeItem("auth");
       localStorage.setItem("auth", JSON.stringify(response.data));
      redirectToPage("/");

     } else {
       setError(
         response.data.notification ||
           "Login failed. Please check your credentials."
       );
     }
   } catch (err) {
     if (err?.response?.data?.verified === 0) {
       setError(
         <span>
           Please verify your account. If you didn't get OTP, please{" "}
           <Link
             href="#"
             onClick={handleVerificationClick}
             className="text-primary"
           >
             click here to verify
           </Link>
         </span>
       );
     } else {
       console.error("Login error:", err);
       setError(
         err.response?.data?.notification ||
           "An error occurred. Please try again."
       );
     }
   }
 };

  return (
    <>
      {/* Breadscrumb Section */}
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center text-center">
            <div className="col-md-12 col-12">
              <h2 className="breadcrumb-title">Login</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Login
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadscrumb Section */}
      {/* Login Section */}
      <div className="login-content">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-5 mx-auto">
              <div className="login-wrap">
                <div className="login-header">
                  <h3>Welcome Back</h3>
                  <p>Please Enter your Details</p>
                </div>
                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <div className="form-group group-img">
                    <div className="group-img">
                      <i className="feather-mail" />
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email Address"
                        value={email}
                        onChange={handleEmailChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="pass-group group-img">
                      <i className="feather-lock" />
                      <input
                        type={passwordType}
                        className="form-control pass-input"
                        placeholder="Password"
                        value={passwordInput}
                        onChange={handlePasswordChange}
                        required
                      />
                      <span
                        className={`toggle-password ${
                          passwordType === "password"
                            ? "feather-eye"
                            : "feather-eye-off"
                        }`}
                        onClick={togglePassword}
                      ></span>
                    </div>
                  </div>
                  <div className="row">
                   
                    <div className="col-md-6 col-sm-6">
                      <div className="text-md-end">
                        <Link className="forgot-link" href="/forgot-password">
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary w-100 login-btn"
                    type="submit"
                  >
                    Sign in
                  </button>
                  <div className="register-link text-center">
                    <p>
                      No account yet?{" "}
                      <Link className="forgot-link" href="/signup">
                        Signup
                      </Link>
                    </p>
                  </div>
                
                </form>
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
export default LoginComponent;
