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
import { MultiSelect } from "react-multi-select-component";
import FcmTokenComp from "@/lib/firebaseForeground";
import { useSearchParams } from "next/navigation";

const BusinessSignupComponent = () => {
  const searchParams = useSearchParams();
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
  const [ConfirmPasswordType, setConfirmPasswordType] = useState("password");
  const [addressLineOne, setAddressLineOne] = useState(""); // New state for address line 1
  const [addressLineTwo, setAddressLineTwo] = useState(""); // New state for address line 2
  const [zipCode, setZipCode] = useState(""); // New state f
  const [selectedCities, setSelectedCities] = useState([]);
  const [showMultiCitySelect, setShowMultiCitySelect] = useState(false);
  const [zipCodeValidationError, setZipCodeValidationError] = useState("");
  const [isValidZipCode, setIsValidZipCode] = useState(false);
  const [isCityCustom, setIsCityCustom] = useState(false);
  const [customCityName, setCustomCityName] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const handleCityChange = (e) => {
    const inputValue = e.target.value;
    setcity(inputValue); // Now storing the city name directly

    // Check if the input matches any dropdown city
  };

  const referral_code = searchParams.get("referral_code");

  const handleCheckboxChange = (e) => {
    setIsAgreed(e.target.checked);
  };

  const handlePasswordChange = (evnt) => {
    setPasswordInput(evnt.target.value);
  };

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const toggleConfirmPassword = () => {
    if (ConfirmPasswordType === "password") {
      setConfirmPasswordType("text");
      return;
    }
    setConfirmPasswordType("password");
  };
  const handleAddMoreCities = () => {
    setShowMultiCitySelect(!showMultiCitySelect);
  };

  const prepareMultiCityOptions = () => {
    return (
      cityDropdown?.map((item) => ({
        label: item.name,
        value: item.name,
      })) || []
    );
  };

  const validateZipCode = async (postalCode) => {
    try {
      // Reset previous validation states
      setZipCodeValidationError("");
      setIsValidZipCode(false);

      // If zip code is empty, return early
      if (!postalCode) return;

      // Call zip code validation API
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/zipcode-validation/${postalCode}`
      );

      // Check if response has data
      if (response.data && response.data.city) {
        // Set state and city based on API response as suggestions
        setState(response.data.city.country_state.name);
        setcity(response.data.city.name);
        setIsValidZipCode(true);

        // Fetch states and cities to update dropdowns
        const statesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/state-by-country/43`
        );
        setStateDropdown(statesResponse.data && statesResponse.data.states);

        const citiesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/city-by-state/${response.data.city.country_state.id}`
        );
        setCityDropdown(citiesResponse.data && citiesResponse.data.cities);
      } else {
        // If no data found, set error
        setZipCodeValidationError(" ");
      }
    } catch (error) {
      console.error("Zip code validation error:", error);
      setZipCodeValidationError("Error validating Postal Code");
    }
  };

  // Modify zip code input handler to trigger validation
  const handleZipCodeChange = (e) => {
    const postalCode = e.target.value;
    setZipCode(postalCode);

    // Validate zip code if it meets a minimum length (e.g., 6 characters)
    if (postalCode.length >= 3) {
      validateZipCode(postalCode);
    }
  };

  const doSignUp = async () => {
    try {
      //  if (!city || city.trim() === "") {
      //    toast.error("Please select a city.");
      //    setError("Please select a valid city.");
      //    return; // Stop submission if validation fails
      //  }
      //  else(
      //   setError(" ")
      //  )
      const fcmToken = localStorage.getItem("fcmToken");
      const token = fcmToken;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/store-register`,
        {
          user_type: 1,
          business_name: bname,
          email: email,
          phone: phone ? phone : "",
          business_category_id: selectedCategoryId,
          // address: address,
          state_id: state,
          fcm_token: token,
          // display_name: dname,
          reg_no: regno,
          city_id: city,
          description: short,
          // long_description: longDesc,
          address_line_one: addressLineOne, // New field
          address_line_two: addressLineTwo, // New field
          zip_code: zipCode, // New field
          name: bname,
          country_id: "Canada",
          other_locations: selectedCities.map((city) => city.value),
          password: passwordInput,
          password_confirmation: confirmPassword,
          agree: 1,
          language: selectedLanguage,
          referral_code,
        }
      );

      if (response.data && response.data.notification) {
        // Reset form fields
        setBname("");

        setAddressLineOne(""); // Reset new fields
        setAddressLineTwo(""); // Reset new fields
        setZipCode("");
        setEmail("");
        setPasswordInput("");
        setConfirmPassword("");

        setCheck(false);

        // Show success message
        toast.success(response.data.notification);

        // Redirect to verification page
        router.push("/verification-page");
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
          toast.error(`${value[0]}`);
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
  };

  const handleFormSubmit = (e) => {
    if (!isAgreed) {
      alert("You must agree to the terms and conditions before submitting.");
      return;
    }
    doSignUp();
  };

  useEffect(() => {
    setState(null);
    setCityDropdown(null);

    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}api/user/state-by-country/${43}`)
      .then((res) => {
        setStateDropdown(res.data && res.data.states);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleStateChange = (e) => {
    const selectedStateId = e.target.value;
    setState(selectedStateId);
    getcity(selectedStateId);
  };

  const getcity = (stateId) => {
    if (stateId) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/city-by-state?name=${stateId}`
        )
        .then((res) => {
          setCityDropdown(res.data && res.data.cities);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  console.log("Referral Code is ",);

  return (
    <>
    
        {/* Login Section */}
        <FcmTokenComp />
        <div
          className="login-content"
          style={{
            backgroundImage: 'url("/img/atlantic-bg-image.png")', // Replace with your actual image path
            // backgroundSize: "contain",
            // backgroundPosition: "center",
            // backgroundRepeat: "repeat",
          }}
        >
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
                      handleFormSubmit();
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
                              onChange={(e) =>
                                handleInputChange(e.target.value)
                              }
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
                              error={
                                !!(errors && Object.hasOwn(errors, "phone"))
                              }
                              patternValidation={"[1-9]{1}[0-9]{9}"}
                              onChange={(e) => {
                                setPhone(e.target.value);
                              }}
                            />

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

                      {/*short description */}
                      <div className="col-md-6">
                        <div className="form-group group-img">
                          <div className="group-img">
                            <input
                              type="text"
                              mandatory={true}
                              name="Description "
                              value={short}
                              label="fullName"
                              className="form-control"
                              placeholder="Description"
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
                      {/* Address */}

                      <div className="col-md-6">
                        <div className="form-group group-img">
                          <div className="group-img">
                            <input
                              type="text"
                              name="Address Line 1"
                              value={addressLineOne}
                              className="form-control"
                              placeholder="Address Line 1"
                              onChange={(e) => {
                                setAddressLineOne(e.target.value);
                                setErrors({
                                  ...errors,
                                  address_line_one: [null],
                                });
                              }}
                            />
                            {errors &&
                            Object.hasOwn(errors, "address_line_one") ? (
                              <span className="text-sm mt-1 text-qred">
                                {errors.address_line_one[0]}
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>

                      {/* New Address Line 2 Field */}
                      <div className="col-md-6">
                        <div className="form-group group-img">
                          <div className="group-img">
                            <input
                              type="text"
                              name="Address Line 2"
                              value={addressLineTwo}
                              className="form-control"
                              placeholder="Address Line 2 (Optional)"
                              onChange={(e) => {
                                setAddressLineTwo(e.target.value);
                                setErrors({
                                  ...errors,
                                  address_line_two: [null],
                                });
                              }}
                            />
                            {errors &&
                            Object.hasOwn(errors, "address_line_two") ? (
                              <span className="text-sm mt-1 text-qred">
                                {errors.address_line_two[0]}
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>

                      {/* New Postal Code Field */}
                      <div className="col-md-6">
                        <div className="form-group group-img">
                          <div className="group-img">
                            <input
                              type="text"
                              name="Postal Code"
                              value={zipCode}
                              className="form-control"
                              placeholder="Postal Code"
                              onChange={handleZipCodeChange}
                            />
                            {zipCodeValidationError && (
                              <span className="text-sm mt-1 text-qred">
                                {zipCodeValidationError}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Province Field */}
                      <div className="col-md-6">
                        <div className="form-group group-img">
                          <div className="select-wrapper d-flex align-items-center">
                            <select
                              className="form-control"
                              value={state}
                              onChange={(e) => {
                                setState(e.target.value);
                                // Fetch cities for the selected state
                                getcity(e.target.value);
                              }}
                            >
                              <option value="">Select Province</option>
                              {stateDropdown?.map((item) => (
                                <option key={item.id} value={item.name}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* City Field */}
                      <div className="col-md-6">
                        <div className="form-group group-img">
                          <div className="select-wrapper d-flex align-items-center">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Select or Enter City"
                              list="cityList"
                              value={city}
                              onChange={handleCityChange}
                            />
                            <datalist id="cityList">
                              {cityDropdown?.map((item) => (
                                <option key={item.id} value={item.name} />
                              ))}
                            </datalist>
                          </div>
                        </div>
                      </div>
                      {/* {showMultiCitySelect && (   
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Select Multiple Cities</label>
                          <MultiSelect
                            options={prepareMultiCityOptions()}
                            value={selectedCities}
                            onChange={setSelectedCities}
                            labelledBy="Select cities"
                          />
                        </div>
                      </div>
                    )} */}
                      {/* Contact Person Name */}

                      {/* Language */}

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
                              type={ConfirmPasswordType} // Use the confirm password specific type
                              className="form-control pass-input"
                              placeholder="Confirm Password"
                              value={confirmPassword} // Use the confirmPassword state value
                              onChange={(e) => {
                                setConfirmPassword(e.target.value.trim());
                              }}
                            />
                            <span
                              className={`toggle-password  ${
                                ConfirmPasswordType === "password"
                                  ? "feather-eye"
                                  : "feather-eye-off"
                              } `}
                              onClick={toggleConfirmPassword} // Use the confirm password specific toggle
                            ></span>
                            {confirmPassword &&
                              confirmPassword !== passwordInput && (
                                <span className="text-sm mt-1 text-qred">
                                  Passwords do not match
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12 mt-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            id="termsCheckbox"
                            className="form-check-input"
                            checked={isAgreed}
                            onChange={handleCheckboxChange}
                          />
                          <label
                            htmlFor="termsCheckbox"
                            className="form-check-label"
                          >
                            I agree to the{" "}
                            <Link href={`/pages/terms-and-condition`}>
                              Terms and Conditions
                            </Link>
                          </label>
                        </div>
                        {/* {!isAgreed && (
                        <span className="text-sm mt-1 text-qred">
                          You must agree to the terms and conditions.
                        </span>
                      )} */}
                      </div>
                    </div>

                    <button
                      className="btn btn-primary w-100 login-btn"
                      type="submit"
                      disabled={!isAgreed}
                    >
                      Create Account
                    </button>
                    <div className="register-link text-center">
                      <p>
                        Already have an account?{" "}
                        <Link className="forgot-link" href="/login" replace>
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

        {/* /Login Section */}
    
    </>
  );
};
export default BusinessSignupComponent;
