"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { languagesInAsia } from "@/constant/languageinAsia";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaRegBuilding } from "react-icons/fa";
import { MdAppRegistration } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const business = () => {
  const websiteData = useSelector((state) => state.websiteSetup.data);
  console.log("Website Setup Data is ", websiteData);
  const [bname, setBname] = useState("");
  const [dname, setDname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [regno, setRegNo] = useState("");
  const [short, setShortDesc] = useState("");
  const [address, setAddress] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [countryDropdown, setCountryDropdown] = useState(null);
  const [stateDropdown, setStateDropdown] = useState(null);
  const [cityDropdown, setCityDropdown] = useState(null);
  const [state, setState] = useState(null);
  const [country, setCountry] = useState();
  const [city, setcity] = useState(null);
  const [contactPersonName, setContactPersonName] = useState("");
   const [selectedLanguage, setSelectedLanguage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checked, setCheck] = useState(false);
  const [errors, setErrors] = useState(null);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [passwordType, setPasswordType] = useState("password");
  const [passwordInput, setPasswordInput] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
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
          user_type: 1,
          business_name: bname,
          display_name: dname,
          reg_no: regno,
          business_category_id: selectedCategoryId,
          description: short,
          long_description: longDesc,
          address: address,
          phone: phone ? phone : "",
          name: contactPersonName,
          country_id: country,
          state_id: state,
          city_id: city,
          email: email,
          password: passwordInput,
          password_confirmation: confirmPassword,
          agree: 1,
          language: selectedLanguage,
        }
      );

      if (response.data && response.data.notification) {
        // Reset form fields
        setBname("");
        setDname("");
        setRegNo("");
        setEmail("");
        setPasswordInput("");
        setConfirmPassword("");
        setLongDesc("");
        setCheck(false);

        // Show success message
        toast.success(response.data.notification);

        // Redirect to verification page
        router.push("/VerificationPage");
      } else {
        // Handle unexpected response structure
        console.error("Unexpected response structure:", response);
        toast.error("An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Error in doSignUp:", err);

      if (err.response && err.response.data && err.response.data.errors) {
        // Handle validation errors
        Object.entries(err.response.data.errors).forEach(([key, value]) => {
          toast.error(`${key}: ${value[0]}`);
        });
      } else {
        // Handle other types of errors
        toast.error("An error occurred. Please try again later.");
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

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}api/user/address/create`)
      .then((res) => {
        if (res.data) {
          setCountryDropdown(res.data.countries);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleCountryChange = (e) => {
    const selectedCountryId = e.target.value;
    setCountry(selectedCountryId);
    getState(selectedCountryId);
  };
  const getState = (countryId) => {
    setState(null);
    setCityDropdown(null);
    if (countryId) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/state-by-country/${countryId}`
        )
        .then((res) => {
          setStateDropdown(res.data && res.data.states);
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
    setcity(null);
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

  const selectCity = (value) => {
    if (value) {
      setcity(value.id);
    }
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
      </div>
      {/* /Breadscrumb Section */}
      {/* Login Section */}

      <div className="login-content">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-10 mx-auto">
              <div className="login-wrap register-form">
                <div className="login-header">
                  <h3>
                    Register as <span>Business</span>{" "}
                  </h3>
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
                  <div className="row">
                    {/*Business Name*/}
                    <div className="col-md-6">
                      <div className="form-group group-img">
                        <div className="group-img">
                          <i>
                            <FaRegBuilding />
                          </i>
                          <input
                            type="text"
                            mandatory={true}
                            name="Business Name"
                            value={bname}
                            label="fullName"
                            className="form-control"
                            placeholder="Business Name"
                            onChange={(e) => {
                              setBname(e.target.value);
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
                    </div>
                    {/*Display name */}
                    <div className="col-md-6">
                      <div className="form-group group-img">
                        <div className="group-img">
                          <i>
                            <FaRegBuilding />
                          </i>
                          <input
                            type="text"
                            mandatory={true}
                            name="Display Name"
                            value={dname}
                            label="fullName"
                            className="form-control"
                            placeholder="Display Name"
                            onChange={(e) => {
                              setDname(e.target.value);
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
                    </div>
                    {/*Email address */}
                    <div className="col-md-6">
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
                    </div>
                    {/*phone number */}
                    <div className="col-md-6">
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
                    </div>
                    {/*registration number */}
                    <div className="col-md-6">
                      <div className="form-group group-img">
                        <div className="group-img">
                          <i className="">
                            <MdAppRegistration />
                          </i>
                          <input
                            type="text"
                            mandatory={true}
                            name="Registration Number"
                            value={regno}
                            label="fullName"
                            className="form-control"
                            placeholder="Registration Number"
                            onChange={(e) => {
                              setRegNo(e.target.value);
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
                    </div>
                    {/*categories  */}
                    {/*categories  */}
                    <div className="col-md-6">
                      <div className="form-group group-img">
                        <div className="select-wrapper d-flex align-items-center">
                          <i className="feather-globe me-2"></i>
                          <select
                            className="form-control"
                            value={selectedCategoryId}
                            onChange={(e) =>
                              setSelectedCategoryId(e.target.value)
                            }
                          >
                            <option value="">Select Category</option>
                            {websiteData?.businessCategories.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors && errors.business_category_id && (
                          <span className="text-sm mt-1 text-qred">
                            {errors.business_category_id[0]}
                          </span>
                        )}
                      </div>
                    </div>
                    {/*long description */}
                    <div className="col-md-6">
                      <div className="form-group group-img">
                        <div className="group-img">
                          <input
                            type="text"
                            mandatory={true}
                            name="Long Description"
                            value={longDesc}
                            label="Long Description"
                            className="form-control"
                            placeholder="Long Description"
                            onChange={(e) => {
                              setLongDesc(e.target.value);
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
                    </div>
                    {/*short description */}
                    <div className="col-md-6">
                      <div className="form-group group-img">
                        <div className="group-img">
                          <input
                            type="text"
                            mandatory={true}
                            name="short Description "
                            value={short}
                            label="fullName"
                            className="form-control"
                            placeholder="Short Description"
                            onChange={(e) => {
                              setShortDesc(e.target.value);
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
                    </div>
                    {/*short description */}
                    <div className="col-md-6">
                      <div className="form-group group-img">
                        <div className="group-img">
                          <input
                            type="text"
                            mandatory={true}
                            name="Address  "
                            value={address}
                            label="Address"
                            className="form-control"
                            placeholder="Address"
                            onChange={(e) => {
                              setAddress(e.target.value);
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
                    </div>
                    {/*Country  */}
                    <div className="col-md-6">
                      <div className="form-group group-img">
                        <div className="select-wrapper d-flex align-items-center">
                          <i className="feather-globe me-2"></i>
                          <select
                            className="form-control"
                            value={country}
                            onChange={handleCountryChange}
                          >
                            <option value="">Select country</option>
                            {countryDropdown?.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors && errors.country && (
                          <span className="text-sm mt-1 text-qred">
                            {errors.country[0]}
                          </span>
                        )}
                      </div>
                    </div>
                    {/*State  */}
                    <div className="col-md-6">
                      <div className="form-group group-img">
                        <div className="select-wrapper d-flex align-items-center">
                          <i className="feather-globe me-2"></i>
                          <select
                            className="form-control"
                            value={state}
                            onChange={handleStateChange}
                          >
                            <option value="">Select Province</option>
                            {stateDropdown?.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors && errors.country && (
                          <span className="text-sm mt-1 text-qred">
                            {errors.country[0]}
                          </span>
                        )}
                      </div>
                    </div>
                    {/*City  */}
                    <div className="col-md-6">
                      <div className="form-group group-img">
                        <div className="select-wrapper d-flex align-items-center">
                          <i className="feather-globe me-2"></i>
                          <select
                            className="form-control"
                            value={city}
                            onChange={(e) => setcity(e.target.value)}
                          >
                            <option value="">Select city</option>
                            {cityDropdown?.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors && errors.country && (
                          <span className="text-sm mt-1 text-qred">
                            {errors.country[0]}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Contact Person Name */}
                    <div className="col-md-6">
                      <div className="form-group group-img">
                        <div className="group-img">
                          <i className="feather-user" />
                          <input
                            type="text"
                            mandatory={true}
                            name="Contact Person Name"
                            value={contactPersonName}
                            className="form-control"
                            placeholder="Contact Person Name"
                            onChange={(e) => {
                              setContactPersonName(e.target.value);
                              setErrors({ ...errors, contactPersonName: null });
                            }}
                          />
                          {errors && errors.contactPersonName && (
                            <span className="text-sm mt-1 text-qred">
                              {errors.contactPersonName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Language */}
                    <div className="col-md-6">
                      <div className="form-group group-img">
                        <div className="select-wrapper d-flex align-items-center">
                          <i className="feather-globe me-2"></i>
                          <select
                            className="form-control"
                            value={selectedLanguage}
                            onChange={(e) =>
                              setSelectedLanguage(e.target.value)
                            }
                          >
                            <option value="">Select Language</option>
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
                    </div>
                    {/*Password*/}
                    <div className="col-md-6">
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
                    </div>
                    {/*Confirm password*/}
                    <div className="col-md-6">
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
export default business;
