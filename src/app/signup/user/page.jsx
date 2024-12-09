"use client";
import { useState,useEffect } from "react";
import Link from "next/link";
import { languagesInAsia } from "@/constant/languageinAsia";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import { SuccessImg } from "@/components/imagepath";




const user = () => {
   const [fname, setFname] = useState("");
   const [lname, setLname] = useState("")
   const [email, setEmail] = useState("");
   const [phone, setPhone] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
   const [region,setRegion] = useState("");
   const [originState, setOriginState] = useState("")
   const [originCountry,setOriginCountry] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [checked, setCheck] = useState(false);
    const [errors, setErrors] = useState(null);
     const [isValidEmail, setIsValidEmail] = useState(true);
  const [passwordType, setPasswordType] = useState("password");
  const [passwordInput, setPasswordInput] = useState("");
  const [languageTags, setLanguageTags] = useState([]);
   const [showOptionalFields, setShowOptionalFields] = useState(false);
 const [line1, setLine1] = useState("");
 const [line2, setLine2] = useState("");
 const [postalCode, setPostalCode] = useState("");
const [confirmPasswordType, setConfirmPasswordType] = useState("password");
 // Dropdown state variables
 const [countryDropdown, setCountryDropdown] = useState([]);
 const [stateDropdown, setStateDropdown] = useState([]);
 const [cityDropdown, setCityDropdown] = useState([]);

 // Selected dropdown values
 const [country, setCountry] = useState("");
 const [state, setState] = useState("");
 const [city, setCity] = useState("");

  const [originCountryDropdown, setOriginCountryDropdown] = useState([]);
  const [originStateDropdown, setOriginStateDropdown] = useState([]);
 



   const togglePasswordVisibility = (field) => {
     if (field === "password") {
       setPasswordType(passwordType === "password" ? "text" : "password");
     } else if (field === "confirmPassword") {
       setConfirmPasswordType(
         confirmPasswordType === "password" ? "text" : "password"
       );
     }
   };

      useEffect(() => {
        // Fetch countries for both current address and origin
        axios
          .get(`${process.env.NEXT_PUBLIC_BASE_URL}api/user/address/create`)
          .then((res) => {
            if (res.data) {
              setCountryDropdown(res.data.countries);
              setOriginCountryDropdown(res.data.countries);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);

     
        
     
      

      const handleOriginCountryChange = (e) => {
        const selectedCountryId = e.target.value;
        setOriginCountry(selectedCountryId);
        getOriginState(selectedCountryId);
      };

      useEffect(()=>
      {
        setState(null);
        setCityDropdown(null);
     
          axios
            .get(
              `${process.env.NEXT_PUBLIC_BASE_URL}api/user/state-by-country/${43}`
            )
            .then((res) => {
              setStateDropdown(res.data && res.data.states);
            })
            .catch((err) => {
              console.log(err);
            });
        },[]
      );


  

      const getOriginState = (countryId) => {
        setOriginState(null);
        if (countryId) {
          axios
            .get(
              `${process.env.NEXT_PUBLIC_BASE_URL}api/user/state-by-country/${countryId}`
            )
            .then((res) => {
              setOriginStateDropdown(res.data && res.data.states);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      };

      const handleStateChange = (e) => {
        const selectedStateId = e.target.value;
        setState(selectedStateId);
        getcity(selectedStateId);
      };

      const getcity = (stateId) => {
        setCity(null);
        if (stateId) {
          axios
            .get(
              `${process.env.NEXT_PUBLIC_BASE_URL}api/user/city-by-state/${stateId}`
            )
            .then((res) => {
              setCityDropdown(res.data && res.data.cities);
            })
            .catch((err) => {
              console.log(err.response);
            });
        }
      };





     const handleLanguageTagChange = (tags) => {
       setLanguageTags(tags);
       console.log("Updated language tags (comma-separated):", tags.join(","));
     };



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
           language: languageTags.length > 0 ? languageTags.join(",") : null,
           phone: phone ? phone : "",
           user_type: 2,
           region: region,
           address_line_one: line1,
           address_line_two: line2,
           zip_code: postalCode,
           city_id: city,
           state_id: state,
           country_id: 43,       
           origin_country_id: originCountry,
           origin_state_id: originState,
         }
       ).then((res)=>
      {
         setFname("");
         setEmail("");
         setPasswordInput("");
         setConfirmPassword("");
         setCheck(false);
         setRegion("");
         setLine1("");
         setLine2("");
         setPostalCode("");
         setCity("");
         setState("");
         setCountry("");
         setOriginCountry("");
         setOriginState("");
         setLanguageTags([]);


         toast.success(res.notification)
         router.push("/VerificationPage");

      });

       // Reset form fields
      
     } catch (err) {
       if (
         err.response &&
         err.response.data.errors &&
         err.response.data.errors.email
       ) {
         toast.error(err.response.data.errors.email[0], {
           position: "top-right",
           autoClose: 5000,
           hideProgressBar: false,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
         });

         router.push("/login");
       } else {
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

      {/* <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center text-center">
            <div className="col-md-12 col-12">
              <h2 className="breadcrumb-title">Create an Account</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Register
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div> */}
      {/* /Breadscrumb Section */}
      {/* Login Section */}
      {/* <div
        style={{
          backgroundImage: 'url("/img/atlantic-bg-image.png")', // Replace with your actual image path
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 0",
        }}
      > */}
      <div
        className="login-content"
        style={{
          backgroundImage: 'url("/img/atlantic-bg-image.png")', // Replace with your actual image path
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
        }}
      >
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
                        type={passwordType}
                        mandatory={true}
                        className="form-control pass-input"
                        placeholder="* * * * * *"
                        onChange={handlePasswordChange}
                        value={passwordInput}
                        min={"8"}
                      />
                      <span
                        className={`toggle-password  ${
                          passwordType === "password"
                            ? "feather-eye"
                            : "feather-eye-off"
                        } `}
                        onClick={() => togglePasswordVisibility("password")}
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
                        type={confirmPasswordType}
                        className="form-control pass-input"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value.trim());
                        }}
                      />
                      <span
                        className={`toggle-password  ${
                          confirmPasswordType === "password"
                            ? "feather-eye"
                            : "feather-eye-off"
                        } `}
                        onClick={() =>
                          togglePasswordVisibility("confirmPassword")
                        }
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
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100 d-flex justify-content-between align-items-center"
                      onClick={() => setShowOptionalFields(!showOptionalFields)}
                    >
                      Additional Information (Optional)
                      <i
                        className={`feather-chevron-${
                          showOptionalFields ? "up" : "down"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Optional Fields Section */}
                  {showOptionalFields && (
                    <div className="optional-fields-container">
                      {/* Language Selection with TagsInput */}
                      <div className="form-group">
                        {/* <label className="col-form-label">Languages</label> */}
                        <div className="custom-tags-input">
                          <TagsInput
                            value={languageTags}
                            onChange={handleLanguageTagChange}
                            inputProps={{
                              className: "react-tagsinput-input",
                              placeholder: "Add the languages and press enter",
                            }}
                          />
                        </div>
                      </div>

                      {/* Region Field */}
                      <div className="form-group group-img">
                        <div className="group-img">
                          <input
                            className="form-control"
                            placeholder="Region"
                            name="region"
                            type="text"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                          />
                        </div>
                      </div>
                      {/* <div className="form-group group-img">
                        <div className="group-img">
                          <input
                            className="form-control"
                            placeholder="Origin Province "
                            name="originState"
                            type="text"
                            value={originState}
                            onChange={(e) => setOriginState(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-group group-img">
                        <div className="group-img">
                          <input
                            className="form-control"
                            placeholder="Origin Country"
                            name="originCountry"
                            type="text"
                            value={originCountry}
                            onChange={(e) => setOriginCountry(e.target.value)}
                          />
                        </div>
                      </div> */}
                      <div className="form-group group-img">
                        <input
                          className="form-control"
                          placeholder="Current Address Line 1"
                          name="line1"
                          type="text"
                          value={line1}
                          onChange={(e) => setLine1(e.target.value)}
                        />
                      </div>
                      <div className="form-group group-img">
                        <input
                          className="form-control"
                          placeholder="Current Address Line 2"
                          name="line2"
                          type="text"
                          value={line2}
                          onChange={(e) => setLine2(e.target.value)}
                        />
                      </div>
                      {/* Country Dropdown */}
                      {/* <div className="form-group group-img">
                        <select
                          className="form-control"
                          value={country}
                          onChange={handleCountryChange}
                        >
                          <option value="">Select Country</option>
                          {countryDropdown.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div> */}

                      {/* State Dropdown */}
                      <div className="form-group group-img">
                        <select
                          className="form-control"
                          value={state}
                          onChange={handleStateChange}
                        >
                          <option value="">Select Province</option>
                          {stateDropdown &&
                            stateDropdown.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      {/* City Dropdown */}
                      <div className="form-group group-img">
                        <select
                          className="form-control"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          disabled={!state}
                        >
                          <option value="">Select City</option>
                          {cityDropdown &&
                            cityDropdown.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Postal Code */}
                      <div className="form-group group-img">
                        <input
                          className="form-control"
                          placeholder="Postcode"
                          name="postalCode"
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                        />
                      </div>
                      {/* Origin Country Dropdown */}
                      <div className="form-group group-img">
                        <select
                          className="form-control"
                          value={originCountry}
                          onChange={handleOriginCountryChange}
                        >
                          <option value="">Select Origin Country</option>
                          {originCountryDropdown.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Origin State Dropdown */}
                      <div className="form-group group-img">
                        <select
                          className="form-control"
                          value={originState}
                          onChange={(e) => setOriginState(e.target.value)}
                          disabled={!originCountry}
                        >
                          <option value="">Select Origin State/Province</option>
                          {originStateDropdown &&
                            originStateDropdown.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  )}
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
                </form>
                {/* /Login Form */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
      {/* /Login Section */}
      <style jsx>{`
        .optional-fields-container {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 20px;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .btn-outline-secondary {
          background: transparent;
          border: 1px solid #dee2e6;
          color: #6c757d;
          padding: 10px 15px;
          transition: all 0.3s ease;
        }

        .btn-outline-secondary:hover {
          background: #f8f9fa;
        }

        .select-wrapper {
          background: white;
          border-radius: 6px;
        }

        .custom-tags-input {
          margin-top: 10px;
        }

        .custom-tags-input :global(.react-tagsinput) {
          border: 1px solid #ced4da;
          border-radius: 4px;
          padding: 5px;
          background-color: white;
        }

        .custom-tags-input :global(.react-tagsinput-tag) {
          background-color: #e9ecef;
          border-radius: 3px;
          border: 1px solid #ced4da;
          color: #495057;
          padding: 5px 10px;
          margin: 2px;
        }

        .custom-tags-input :global(.react-tagsinput-input) {
          width: 100%;
          padding: 5px;
          margin: 2px;
          border: none;
          outline: none;
        }
      `}</style>
    </>
  );
};
export default user;
