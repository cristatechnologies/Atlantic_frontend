"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";



const ProfileComponent = () => {
  //  useAuth();

  // const isAuthenticated = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState([]);
  const [passwordType, setPasswordType] = useState("password");
  const [passwordInput, setPasswordInput] = useState("");
  const [countryDropdown, setCountryDropdown] = useState([]);
  const [stateDropdown, setStateDropdown] = useState([]);
  const [cityDropdown, setCityDropdown] = useState([]);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [lineOne, setLineOne] = useState("");
  const [lineTwo, setLineTwo] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [imagePreview, setImagePreview] = useState("/img/profile.jpg");
  const [isLoading, setIsLoading] = useState(true);
    const [region, setRegion] = useState("");
    const [originCountry, setOriginCountry] = useState("");
    const [originState, setOriginState] = useState("");
    const [languageTags, setLanguageTags] = useState([]);
  // Function to handle password input change

  const formRef = useRef(null);

  {
    console.log("test");
  }

   const handleLanguageTagChange = (tags) => {
     setLanguageTags(tags);
     console.log("Updated language tags (comma-separated):", tags.join(","));
   };
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem("auth"));
        const token = authData?.access_token;

        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/my-profile?token=${token}`
        );

        const profile = response.data.personInfo;
        setProfileData(profile);
        setImagePreview(
          profile?.image
            ? `${process.env.NEXT_PUBLIC_BASE_URL}${profile.image}`
            : "/img/profile.jpg"
        );

        // Set initial values
        if (profile) {
          setCountry(profile.country_id || "");
          setState(profile.state_id || "");
          setCity(profile.city_id || "");
          setLineOne(profile.address_line_one || "");
            setLineOne(profile.address_line_two || "");
          setZipCode(profile.zip_code || "");
          setRegion(profile.region || "");

          // Origin Country
          setOriginCountry(profile.origin_country_id || "");

          // Origin State
          setOriginState(profile.origin_state_id || "");

          // Language Tags
          setLanguageTags(profile.language ? profile.language.split(",") : []);

          // If origin_country exists, fetch origin states
          if (profile?.origin_country) {
            await fetchOriginStates(profile.origin_country);
          }
        }

        // Initialize dropdowns
        await initializeDropdowns(profile);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const fetchOriginStates = async (countryId) => {
    if (countryId) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/state-by-country/${countryId}`
        );
        setOriginStateDropdown(response.data?.states || []);
      } catch (error) {
        console.error("Error fetching origin states:", error);
      }
    } else {
      setOriginStateDropdown([]);
    }
  };

  // Handle origin country change
  const handleOriginCountryChange = async (e) => {
    const selectedCountryId = e.target.value;
    setOriginCountry(selectedCountryId);
    setOriginState(""); // Reset origin state
    await fetchOriginStates(selectedCountryId);
  };



  const initializeDropdowns = async (profile) => {
    try {
      // Fetch countries
      const countriesResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/address/create`
      );
      setCountryDropdown(countriesResponse.data.countries);

      // If country_id exists, fetch states
      if (profile?.country_id) {
        const statesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/state-by-country/${profile.country_id}`
        );
        setStateDropdown(statesResponse.data.states || []);
      }

      // If state_id exists, fetch cities
      if (profile?.state_id) {
        const citiesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/city-by-state/${profile.state_id}`
        );
        setCityDropdown(citiesResponse.data.cities || []);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing dropdowns:", error);
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();

    const authData = JSON.parse(localStorage.getItem("auth"));
    const token = authData?.access_token;

    // Create FormData object
    const formData = new FormData(formRef.current);

    // Add additional form fields to FormData
    formData.append("country_id", country);
    formData.append("state_id", state);
    formData.append("city_id", city);
  
    formData.append("zip_code", zipCode);
    formData.append("region", region);
    formData.append("origin_country_id", originCountry);
    formData.append("origin_state_id", originState);
     formData.append("address_line_two", lineTwo);
      formData.append("address_line_two", lineOne);
    formData.append(
      "language",
      languageTags.length > 0 ? languageTags.join(",") : null
    );

    // Note: The image file will automatically be included in formData
    // because it's part of the form with name="image"

    axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/update-profile?token=${token}`,
        formData, // Send formData instead of JSON
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file upload
          },
        }
      )
      .then((response) => {
        toast.success(response.data.notification);

        console.log(response.data?.data.image);
        // Update the user data in localStorage
        const updatedUser = {
          ...authData.user,
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          image: response.data?.data.image
            ? `${response.data?.data.image}`
            : null,
          // Preserve other user properties that shouldn't change
          id: authData.user.id,
          status: authData.user.status,
          user_type: authData.user.user_type,
          business: null,
        };
        if (response.data?.data.image) {
          setImagePreview(
            `${process.env.NEXT_PUBLIC_BASE_URL}${response.data?.data.image}`
          );
        }

        const updatedAuthData = {
          access_token: authData.access_token,
          token_type: authData.token_type,
          expires_in: authData.expires_in,
          is_vendor: authData.is_vendor,
          user: updatedUser,
        };
        localStorage.setItem("auth", JSON.stringify(updatedAuthData));

        // Update the profileData state
        setProfileData((prevData) => ({
          ...prevData,
          ...updatedUser,
        }));
        router.refresh();
      })
      .catch((err) => {
        console.error("Error in ProfileUpdate", err);
        toast.error("Failed to update profile");
      });
  };

  // Fetch country list
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

  const handleCountryChange = async (e) => {
    const selectedCountryId = e.target.value;
    setCountry(selectedCountryId);
    setState(""); // Reset state
    setCity(""); // Reset city
    setCityDropdown([]); // Reset city options
    await getState(selectedCountryId);
  };

  const getState = async (countryId) => {
    if (countryId) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/state-by-country/${countryId}`
        );
        setStateDropdown(response.data?.states || []);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    } else {
      setStateDropdown([]);
    }
  };

  const handleStateChange = async (e) => {
    const selectedStateId = e.target.value;
    setState(selectedStateId);
    setCity(""); // Reset city
    await getCity(selectedStateId);
  };

  const getCity = async (stateId) => {
    if (stateId) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/city-by-state/${stateId}`
        );
        setCityDropdown(response.data?.cities || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    } else {
      setCityDropdown([]);
    }
  };

  const selectCity = (value) => {
    if (value) {
      setCity(value.id);
    }
  };

  // Toggle password visibility
  const togglePassword = () => {
    setPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  // Fetch profile data if user_type is 2

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <>
      {/* Breadscrumb Section */}
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center text-center">
            <div className="col-md-12 col-12">
              <h2 className="breadcrumb-title">Profile</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Profile
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadscrumb Section */}

      {/* Profile Content */}
      <div className="dashboard-content">
        <div className="container">
          <div className="profile-content">
            <div className="row dashboard-info">
              <div className="col-lg-12">
                <div className="card dash-cards">
                  <div className="card-header">
                    <h4>Profile Details</h4>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleProfileUpdate} ref={formRef}>
                      {/* Profile photo section remains unchanged */}
                      <div className="profile-photo">
                        <div className="profile-img">
                          <div className="settings-upload-img">
                            <img src={imagePreview} alt="profile" />
                          </div>
                          <div className="settings-upload-btn">
                            <input
                              type="file"
                              accept="image/*"
                              name="image"
                              className="hide-input image-upload"
                              id="file"
                              onChange={handleImageChange}
                            />
                            <label htmlFor="file" className="file-upload">
                              Upload New photo
                            </label>
                          </div>
                          <span>Max file size: 10 MB</span>
                        </div>
                        {/* <Link href="#" className="profile-img-del">
                          <i className="feather-trash-2" />
                        </Link> */}
                      </div>

                      {/* Updated form layout with two columns */}
                      <div className="profile-form">
                        <div className="row">
                          {/* Full Name */}
                          <div className="col-md-6 form-group">
                            <label className="col-form-label">
                              Your Full Name
                            </label>
                            <div className="pass-group group-img">
                              <span className="lock-icon">
                                <i className="feather-user" />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                name="name"
                                defaultValue={profileData?.name}
                              />
                            </div>
                          </div>

                          {/* Phone Number */}
                          <div className="col-md-6 form-group">
                            <label className="col-form-label">
                              Phone Number
                            </label>
                            <div className="pass-group group-img">
                              <span className="lock-icon">
                                <i className="feather-phone-call" />
                              </span>
                              <input
                                type="tel"
                                className="form-control"
                                name="phone"
                                defaultValue={profileData?.phone}
                              />
                            </div>
                          </div>

                          {/* Email Address */}
                          <div className="col-md-6 form-group">
                            <label className="col-form-label">
                              Email Address
                            </label>
                            <div className="pass-group group-img">
                              <span className="lock-icon">
                                <i className="feather-mail" />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                name="email"
                                defaultValue={profileData?.email}
                              />
                            </div>
                          </div>

                          {/* Country */}
                          <div className="col-md-6 form-group">
                            <label className="col-form-label">Country</label>
                            <div className="pass-group group-img">
                              <span className="lock-icon">
                                <i className="feather-globe" />
                              </span>
                              <select
                                className="form-control"
                                value={country}
                                onChange={handleCountryChange}
                              >
                                <option value="">Select Country</option>
                                {countryDropdown.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Update the State dropdown */}
                          <div className="col-md-6 form-group">
                            <label className="col-form-label">State</label>
                            <div className="pass-group group-img">
                              <span className="lock-icon">
                                <i className="feather-map" />
                              </span>
                              <select
                                className="form-control"
                                value={state}
                                onChange={handleStateChange}
                                disabled={!country}
                              >
                                <option value="">Select State</option>
                                {stateDropdown.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Update the City dropdown */}
                          <div className="col-md-6 form-group">
                            <label className="col-form-label">City</label>
                            <div className="pass-group group-img">
                              <span className="lock-icon">
                                <i className="feather-map-pin" />
                              </span>
                              <select
                                className="form-control"
                                value={city}
                                onChange={handleCityChange}
                                disabled={!state}
                              >
                                <option value="">Select City</option>
                                {cityDropdown.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Line 1 */}
                          <div className="col-md-6 form-group">
                            <label className="col-form-label">Address Line 1</label>
                            <div className="pass-group group-img">
                              <span className="lock-icon">
                                <i className="feather-home" />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                value={lineOne}
                                onChange={(e) => setLineOne(e.target.value)}
                              />
                            </div>
                          </div>
                          {/* Line 2 */}
                          <div className="col-md-6 form-group">
                            <label className="col-form-label">Address Line 2</label>
                            <div className="pass-group group-img">
                              <span className="lock-icon">
                                <i className="feather-home" />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                value={lineTwo}
                                onChange={(e) => setLineTwo(e.target.value)}
                              />
                            </div>
                          </div>

                          {/* Zip Code */}
                          <div className="col-md-6 form-group">
                            <label className="col-form-label">Zip Code</label>
                            <div className="pass-group group-img">
                              <span className="lock-icon">
                                <i className="feather-map-pin" />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                              />
                            </div>
                          </div>

                          {/* Language*/}
                          <div className="col-md-6 form-group">
                            <label className="col-form-label">
                              Email Address
                            </label>
                            <div className="pass-group group-img">
                              <span className="lock-icon">
                                <i className="feather-mail" />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                name="email"
                                defaultValue={profileData?.email}
                              />
                            </div>
                          </div>
                          {/* Region  */}
                          <div className="col-md-6 form-group">
                            <label className="col-form-label">Region</label>
                            <div className="pass-group group-img">
                              <span className="lock-icon">
                                <i className="feather-map" />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                              />
                            </div>
                          </div>

                          {/* Origin Country */}
                          <div className="col-md-6 form-group">
                            <label className="col-form-label">
                              Origin Country
                            </label>
                            <div className="pass-group group-img">
                              <span className="lock-icon">
                                <i className="feather-globe" />
                              </span>
                              <select
                                className="form-control"
                                value={originCountry}
                                onChange={(e) =>
                                  setOriginCountry(e.target.value)
                                }
                              >
                                <option value="">Select Origin Country</option>
                                {countryDropdown.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Origin State */}
                          <div className="col-md-6 form-group">
                            <label className="col-form-label">
                              Origin State
                            </label>
                            <div className="pass-group group-img">
                              <span className="lock-icon">
                                <i className="feather-map" />
                              </span>
                              <select
                                className="form-control"
                                value={originState}
                                onChange={(e) => setOriginState(e.target.value)}
                                disabled={!originCountry}
                              >
                                <option value="">Select Origin State</option>
                                {stateDropdown.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Language Tags */}
                          <div className="col-md-6 form-group">
                            <label className="col-form-label">Languages</label>
                            <div className="custom-tags-input">
                              <TagsInput
                                value={languageTags}
                                onChange={handleLanguageTagChange}
                                inputProps={{
                                  className: "react-tagsinput-input",
                                  placeholder:
                                    "Add the languages and press enter",
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Submit button */}
                        <div className="d-flex align-items-center justify-content-between">
                          <button
                            className="btn btn-primary btn-block"
                            type="submit"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Profile Content */}
    </>
  );
};

export default ProfileComponent;
