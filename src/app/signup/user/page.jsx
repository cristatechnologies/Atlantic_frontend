"use client";
import { useState } from "react";
import Link from "next/link";
import { languagesInAsia } from "@/constant/languageinAsia";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const user = () => {
   const [fname, setFname] = useState("");
   const [lname, setLname] = useState("")
   const [email, setEmail] = useState("");
   const [phone, setPhone] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
   const [region,setRegion] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [checked, setCheck] = useState(false);
    const [errors, setErrors] = useState(null);
     const [isValidEmail, setIsValidEmail] = useState(true);
  const [passwordType, setPasswordType] = useState("password");
  const [passwordInput, setPasswordInput] = useState("");
  const handlePasswordChange = (evnt) => {
    setPasswordInput(evnt.target.value);
  };
const router = useRouter();
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };
  const doSignUp = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/store-register`,
        {
          name: fname,
          email: email,
          password: passwordInput,
          password_confirmation: confirmPassword,
          agree: 1,
          phone: phone ? phone : "",
          language: selectedLanguage,
          user_type: 2,
        }
      );

      setFname("");
      setEmail("");
      setPasswordInput("");
      setConfirmPassword("");
      setCheck(false);
      setRegion("");
      setSelectedLanguage("");
      router.push("/VerificationPage");
    } catch (err) {
      if (
        err.response &&
        err.response.data.errors &&
        err.response.data.errors.email
      ) {
        // Display toast notification
        toast.error(err.response.data.errors.email[0], {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Redirect to login page
        router.push("/login");
      } else {
        // Handle other errors
        console.error(err);
        toast.error("An error occurred. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

    const handleInputChange = (emailValue) => {
      const inputEmail = emailValue;
      setEmail(inputEmail);
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailPattern.test(inputEmail);
      setIsValidEmail(isValid);
      setErrors({ ...errors, email: [null] });
    };
  return (
    <>
      {/* Breadscrumb Section */}

      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center text-center">
            <div className="col-md-12 col-12">
              <h2 className="breadcrumb-title">Create an Account</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/index">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Register
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
              <div className="login-wrap register-form">
                <div className="login-header">
                  <h3>Create an Account</h3>
                  <p>
                    Lets start with <span>IndoAtlantic</span>
                  </p>
                </div>
                {/* Login Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    doSignUp();
                  }}
                >
                  <div className="form-group group-img">
                    <div className="group-img">
                      <i className="feather-user" />
                      <input
                        type="text"
                        mandatory={true}
                        name="fname"
                        value={fname}
                        label="fullName"
                        className="form-control"
                        placeholder="Full Name"
                        onChange={(e) => {
                          setFname(e.target.value);
                          setErrors({ ...errors, name: [null] });
                        }}
                      />
                      {errors && Object.hasOwn(errors, "name") ? (
                        <span className="text-sm mt-1 text-qred">
                          {errors.name[0]}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="form-group group-img">
                    <div className="group-img">
                      <i className="feather-mail" />
                      <input
                        label="email"
                        className="form-control"
                        placeholder="Email Address"
                        name="email"
                        mandatory={true}
                        type="email"
                        value={email}
                        onChange={(e) => handleInputChange(e.target.value)}
                      />
                      {!isValidEmail && (
                        <p className="text-sm mt-1 text-qred">
                          Please enter a valid email address
                        </p>
                      )}
                      {errors && Object.hasOwn(errors, "email") ? (
                        <span className="text-sm mt-1 text-qred">
                          {errors.email[0]}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="form-group group-img">
                    <div className="group-img">
                      <i className="feather-phone" />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Phone Number"
                        name="phone"
                        mandatory={true}
                        value={phone}
                        error={!!(errors && Object.hasOwn(errors, "phone"))}
                        patternValidation={"[1-9]{1}[0-9]{9}"}
                        onChange={(e) => {
                          e.target.value.length <= 10 &&
                            setPhone(e.target.value);
                        }}
                      />
                      {phone && phone.length < 10 && (
                        <span className="text-sm mt-1 text-red">
                          Please enter phone number 10 digit
                        </span>
                      )}
                      {errors && Object.hasOwn(errors, "phone") ? (
                        <span className="text-sm mt-1 text-red  ">
                          {errors.phone[0]}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="pass-group group-img">
                      <i className="feather-lock" />
                      <input
                        label={passwordInput}
                        type={passwordType}
                        mandatory={true}
                        className="form-control pass-input"
                        placeholder="* * * * * *"
                        onChange={handlePasswordChange}
                        value={passwordInput}
                        min={"8"}
                        inputHandler={(e) => {
                          setPassword(e.target.value.trim());
                          setErrors({ ...errors, password: [null] });
                        }}
                      />

                      <span
                        className={`toggle-password  ${
                          passwordType === "password"
                            ? "feather-eye"
                            : "feather-eye-off"
                        } `}
                        onClick={togglePassword}
                      ></span>
                      {passwordInput && passwordInput.length < 8 ? (
                        <span className="text-sm mt-1 text-qred absolute top-20 left-0">
                          Please enter password minimum 8 character
                        </span>
                      ) : (
                        ""
                      )}
                      {errors && Object.hasOwn(errors, "password") ? (
                        <span className="text-sm mt-1 text-qred">
                          {errors.password[0]}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="pass-group group-img">
                      <i className="feather-lock" />
                      <input
                        type={passwordType}
                        className="form-control pass-input"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value.trim());
                        }}
                      />

                      <span
                        className={`toggle-password  ${
                          passwordType === "password"
                            ? "feather-eye"
                            : "feather-eye-off"
                        } `}
                        onClick={togglePassword}
                      ></span>
                      {passwordInput && passwordInput.length < 8 ? (
                        <span className="text-sm mt-1 text-qred absolute top-20 left-0">
                          Please enter password minimum 8 character
                        </span>
                      ) : (
                        ""
                      )}
                      {errors && Object.hasOwn(errors, "password") ? (
                        <span className="text-sm mt-1 text-qred">
                          {errors.password[0]}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="form-group group-img">
                    <div className="select-wrapper d-flex align-items-center">
                      <i className="feather-globe me-2"></i>
                      <select
                        className="form-control"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                      >
                        <option value="">Select Language (optional)</option>
                        {languagesInAsia.map((language, index) => (
                          <option key={index} value={language.name}>
                            {language.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors && errors.language && (
                      <span className="text-sm mt-1 text-qred">
                        {errors.language[0]}
                      </span>
                    )}
                  </div>
                  <div className="form-group group-img">
                    <div className="group-img">
                      <i className="feather-mail" />
                      <input
                        label="region"
                        className="form-control"
                        placeholder="Region (optional)"
                        name="region"
                        mandatory={false}
                        type="text"
                        value={region}
                     onChange={(e)=>
                     {
                      setRegion(e.target.value)
                     }
                     }
                      />
                    
                    </div>
                  </div>
                  <button
                    className="btn btn-primary w-100 login-btn"
                    type="submit"
                  >
                    Create Account
                  </button>
                  <div className="register-link text-center">
                    <p>
                      Already have an account?{" "}
                      <Link className="forgot-link" href="/login">
                        Sign In
                      </Link>
                    </p>
                  </div>
                  {/* <div className="login-or">
                    <span className="or-line" />
                    <span className="span-or">
                      Sign in with Social Media Accounts
                    </span>
                  </div>
                  <div className="social-login">
                    <Link href="#" className="btn btn-apple w-100">
                      <img src={apple} className="me-1" alt="img" />
                      Sign in with Apple
                    </Link>
                  </div>
                  <div className="social-login">
                    <Link href="#" className="btn btn-google w-100">
                      <img src={google} className="me-1" alt="img" />
                      Sign in with Google
                    </Link>
                  </div>
                  <div className="social-login">
                    <Link href="#" className="btn btn-facebook w-100 mb-0">
                      <img src={facebook} className="me-2" alt="img" />
                      Continue with Facebook
                    </Link>
                  </div> */}
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
export default user;
