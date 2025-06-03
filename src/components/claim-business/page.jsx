"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
import { Suspense } from "react";
import Link from "next/link";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";


const UpdateBusinessPage = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productTags, setProductTags] = useState([]);
  const websiteData = useSelector((state) => state.websiteSetup.data);
  const [responseData, setResponseData] = useState(null);
  
  const [formData, setFormData] = useState({
    // business_name: "",
    reg_no: "",
    
    description: "",
    
    address_line_one: "",
    address_line_two: "",
    // business_category_id: "",
    phone: "",
    email: "",
    name: "",
    country_id: "Canada",
    state_id: "",
    city_id: "",
    zip_code: "",
    password: "",
  });


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  // Keep separate state for files to correctly handle file uploads
  const [imageFile, setImageFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [originalBanner, setOriginalBanner] = useState(null);

  const [categories, setCategories] = useState([]);
  const [stateDropdown, setStateDropdown] = useState([]);
  const [cityDropdown, setCityDropdown] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);



  useEffect(() => {
    const phone = searchParams.get("phone");
    console.log("email", phone);

    if (phone) {
      fetchBusinessData(phone);
      fetchCategories();
      // fetchStates("Canada");
    } else {
      setIsFetching(false);
      toast.error("phone parameter is missing");
    }
  }, [searchParams]);

  const fetchBusinessData = async (phone) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/business-profile-data`,
        { phone }
      );
      setResponseData(response.data);

      const business = response.data.business;
      const user = response.data.user;

      setFormData({
        business_name: business?.name || "",
        reg_no: business?.reg_no || "",

        description: business?.description || "",

        address_line_one:
          business?.address_line_one || user?.address_line_one || "",
        address_line_two:
          business?.address_line_two || user?.address_line_two || "",
        business_category_id: business?.business_category_id || "",
        phone: business?.contact_person_number || user?.phone || "",
        email: business?.contact_person_email || user?.email || "",

        country_id: business?.country_id || user?.country_id || "Canada",
        state_id: business?.state_id || user?.state_id || "",
        city_id: business?.city_id || user?.city_id || "",
        zip_code: business?.zip_code || user?.zip_code || "",

        password: "",
      });

      // if (business?.state_id || user?.state_id) {
      //   fetchCities(business?.state_id || user?.state_id);
      // }

      // Store original image paths for comparison later
    } catch (error) {
      console.error("Error fetching business data:", error);
      toast.error("Failed to load business data");
    } finally {
      setIsFetching(false);
    }
  };



  const fetchCategories = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const token = authData?.access_token;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/all-categories`
        // {
        //   // headers: {
        //   //   Authorization: `Bearer ${token}`,
        //   // },
        // }
      );

      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  // const fetchStates = async (countryName) => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}api/user/state-by-country/?name=${countryName}`
  //     );
  //     setStateDropdown(response.data?.states || []);
  //   } catch (error) {
  //     console.error("Error fetching states:", error);
  //     toast.error("Failed to load states");
  //   }
  // };

  // const fetchCities = async (stateName) => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}api/user/city-by-state/?name=${stateName}`
  //     );
  //     setCityDropdown(response.data?.cities || []);
  //   } catch (error) {
  //     console.error("Error fetching cities:", error);
  //     toast.error("Failed to load cities");
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleStateChange = (e) => {
  //   const stateName = e.target.value;
  //   setFormData((prev) => ({
  //     ...prev,
  //     state_id: stateName,
  //     city_id: "",
  //   }));
  //   fetchCities(stateName);
  // };

  // const handleCityChange = (e) => {
  //   const inputValue = e.target.value;
  //   setFormData((prev) => ({
  //     ...prev,
  //     city_id: inputValue,
  //   }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Check if passwords match
    if (formData.password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    } else {
      setPasswordError("");
    }


    setIsLoading(true);
    const authData = JSON.parse(localStorage.getItem("auth"));
    const token = authData?.access_token;

    const formDataToSend = new FormData();

    // Append all text fields
    Object.keys(formData).forEach((key) => {
      // Skip empty password

      formDataToSend.append(key, formData[key]);
    });

    // Append image files only if they've been changed

    formDataToSend.append("agree_policy", "1");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/business-profile-update`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.message) {
        toast.success(
          response.data.message || "Verify your email to complete the process. The OTP will be sent to your email."
        );
        localStorage.removeItem("auth");
        router.push(`verification-page?email=${encodeURIComponent(formData.email)}&sendMail=true`);
      } else {
        toast.error(response.data.message || "Failed to update business");
      }
    } catch (error) {
      console.error("Error updating business:", error);
      
      // Handle API validation errors
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        errorMessages.forEach((message) => {
          toast.error(message);
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to update business");
      }
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    // Check if we need to redirect after refresh
    if (sessionStorage.getItem("redirectToLogin") === "true") {
      sessionStorage.removeItem("redirectToLogin");

      // Give time for the page to properly load
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    }
  }, []);

  if (isFetching) {
    return (
      <div
        className="dashboard-content"
        style={{ paddingTop: "170px", paddingBottom: "90px" }}
      >
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log(responseData);
  if (
    !responseData ||
    (responseData?.business === null && responseData?.user === null)
  ) {
    return (
      <div
        className="dashboard-content"
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="container">
          <div className="text-center py-5">
            <div className="alert alert-warning">
              <h4>🚫 No Data Found</h4>
              <p>We don't have your business data in our records.</p>
              <p>
                Please{" "}
                <Link href="/let-us-know" className="text-primary">
                  Contact Support
                </Link>{" "}
                if you believe this is an error.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="dashboard-content"
      style={{ paddingTop: "170px", paddingBottom: "90px" }}
    >
      <div className="container">
        <div className="profile-content">
          <div className="row dashboard-info">
            <div className="col-lg-12">
              <div className="card dash-cards">
                <div className="card-header">
                  <h4>Claim Your Business</h4>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="row">
                      {/* Business Information */}
                      {/* business name  */}
                      <div className="col-md-6 form-group">
                        <label className="col-form-label">
                          Business Name *
                        </label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-briefcase" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            name="business_name"
                            value={formData.business_name}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>
                      </div>

                      {/* email address */}
                      <div className="col-md-6 form-group">
                        <label className="col-form-label">Email *</label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-mail" />
                          </span>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="col-md-6 form-group">
                        <label className="col-form-label">Phone Number *</label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-user" />
                          </span>
                          <input
                            type="number"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>
                      </div>
                      {/* Registration number */}
                      <div className="col-md-6 form-group">
                        <label className="col-form-label">
                          Registration Number
                        </label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-file" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            name="reg_no"
                            value={formData.reg_no}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      {/* Business Category */}
                      <div className="col-md-6 form-group">
                        <label className="col-form-label">
                          Business Category *
                        </label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-briefcase" />
                          </span>
                          <select
                            name="business_category_id"
                            className="form-control"
                            value={formData.business_category_id}
                            onChange={handleInputChange}
                            disabled
                          >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {/* Short Description  */}
                      <div className="col-md-6 form-group">
                        <label className="col-form-label">
                          Short Description *
                        </label>
                        <div className="pass-group group-img">
                          <input
                            type="text"
                            className="form-control"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                          ></input>
                        </div>
                      </div>

                      {/* Address Information */}

                      {/* aDDRESS lINE 1 */}
                      <div className="col-md-6 form-group">
                        <label className="col-form-label">
                          Address Line 1 *
                        </label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-map-pin" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            name="address_line_one"
                            value={formData.address_line_one}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>
                      </div>

                      {/* aDDRESS lINE 2 */}

                      <div className="col-md-6 form-group">
                        <label className="col-form-label">Address Line 2</label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-map-pin" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            name="address_line_two"
                            value={formData.address_line_two}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>
                      </div>

                      {/* Postal Code */}
                      <div className="col-md-6 form-group">
                        <label className="col-form-label">Postal Code *</label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-map-pin" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            name="zip_code"
                            value={formData.zip_code}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>
                      </div>
                      {/* Country */}
                      <div className="col-md-6 form-group">
                        <label className="col-form-label">Country *</label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-globe" />
                          </span>
                          <select
                            className="form-control"
                            name="country_id"
                            value={formData.country_id}
                            onChange={handleInputChange}
                            disabled
                          >
                            <option value="Canada">Canada</option>
                          </select>
                        </div>
                      </div>
                      {/*Province */}
                      <div className="col-md-6 form-group">
                        <label className="col-form-label">Province *</label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-map" />
                          </span>
                          <select
                            className="form-control"
                            name="state_id"
                            value={formData.state_id}
                            // onChange={handleStateChange}
                            disabled
                          >
                            <option value="">Select Province</option>
                            {stateDropdown.map((state) => (
                              <option key={state.id} value={state.name}>
                                {state.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {/* City */}
                      <div className="col-md-6 form-group">
                        <label className="col-form-label">City *</label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-map-pin" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Select or Enter City"
                            list="cityList"
                            name="city_id"
                            value={formData.city_id}
                            // onChange={handleCityChange}
                            disabled
                          />
                          <datalist id="cityList">
                            {cityDropdown.map((city) => (
                              <option key={city.id} value={city.name} />
                            ))}
                          </datalist>
                        </div>
                      </div>

                  
                      {/* Password Field */}
                      <div className="col-md-6 form-group">
                        <label className="col-form-label">Password *</label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-lock" />
                          </span>
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter password"
                            required
                          />
                          <span
                            className={`toggle-password feather ${
                              showPassword ? "feather-eye-off" : "feather-eye"
                            }`}
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                              cursor: "pointer",
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-md-6 form-group">
                        <label className="col-form-label">
                          Confirm Password *
                        </label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-lock" />
                          </span>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="form-control"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            required
                          />
                          <span
                            className={`toggle-password feather ${
                              showConfirmPassword
                                ? "feather-eye-off"
                                : "feather-eye"
                            }`}
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            style={{
                              cursor: "pointer",
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                          />
                        </div>
                        {passwordError && (
                          <div className="text-danger small mt-1">
                            {passwordError}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between mt-4">
                      <button
                        className="btn btn-primary btn-block"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Updating..." : "Claim Your Business"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBusinessPage;
