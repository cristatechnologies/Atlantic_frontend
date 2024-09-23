"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useRef } from "react";
const ProfileComponent = () => {
  useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [passwordType, setPasswordType] = useState("password");
  const [passwordInput, setPasswordInput] = useState("");
  const [countryDropdown, setCountryDropdown] = useState([]);
  const [stateDropdown, setStateDropdown] = useState([]);
  const [cityDropdown, setCityDropdown] = useState([]);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [imagePreview, setImagePreview] = useState("/img/profile.jpg");

  // Function to handle password input change

  const formRef = useRef(null);

  const handleProfileUpdate = (e) => {
    e.preventDefault();

    const authData = JSON.parse(localStorage.getItem("auth"));
    const token = authData?.access_token;

    // Get form data
    const formData = new FormData(formRef.current);
    const updatedProfileData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      country_id: country,
      state_id: state,
      city_id: city,
      address: address,
      zip_code: zipCode,
    };

    axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/update-profile?token=${token}`,
        updatedProfileData
      )
      .then((response) => {
        // Show success toast notification
        toast.success(response.data.notification);

        // Update the user data in localStorage
        const updatedUser = {
          ...authData.user,
          name: updatedProfileData.name,
          email: updatedProfileData.email,
          phone: updatedProfileData.phone,
        };

        // Update the auth data with the updated user info
        const updatedAuthData = {
          ...authData,
          user: updatedUser,
        };

        // Save the updated auth data back to localStorage
        localStorage.setItem("auth", JSON.stringify(updatedAuthData));

        // Update the profileData state
        setProfileData((prevData) => ({
          ...prevData,
          ...updatedProfileData,
        }));

        // Optionally refresh or redirect
        router.refresh();
        console.log("Profile updated successfully:", response.data);
      })
      .catch((err) => {
        console.error("Error in ProfileUpdate", err);
        // ... (error handling remains the same)
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

  const handleCountryChange = (e) => {
    const selectedCountryId = e.target.value;
    setCountry(selectedCountryId);
    getState(selectedCountryId);
  };

  const getState = (countryId) => {
    setStateDropdown([]); // Reset states when changing country
    setCityDropdown([]); // Reset cities when changing country
    if (countryId) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/state-by-country/${countryId}`
        )
        .then((res) => {
          setStateDropdown(res.data?.states || []);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleStateChange = (e) => {
    const selectedStateId = e.target.value;
    setState(selectedStateId);
    getCity(selectedStateId);
  };

  const getCity = (stateId) => {
    setCityDropdown([]); // Reset cities when changing state
    if (stateId) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/city-by-state/${stateId}`
        )
        .then((res) => {
          setCityDropdown(res.data?.cities || []);
        })
        .catch((err) => {
          console.log(err.response);
        });
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
  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));

    if (authData?.user?.user_type === 2) {
      const token = authData?.access_token;
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/my-profile?token=${token}`
        )
        .then((response) => {
          setProfileData(response.data.personInfo);
          setImagePreview(
            response.data.personInfo?.image || "/img/profile.jpg"
          );
        })
        .catch((error) => {
          console.error("Error fetching profile data:", error);
        });
    }
  }, []);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the preview to the selected image
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }


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
                                defaultValue={profileData.name}
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
                                defaultValue={profileData.phone}
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
                                defaultValue={profileData.email}
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
                                {countryDropdown.map((country) => (
                                  <option key={country.id} value={country.id}>
                                    {country.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* State */}
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
                                {stateDropdown.map((state) => (
                                  <option key={state.id} value={state.id}>
                                    {state.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* City */}
                          <div className="col-md-6 form-group">
                            <label className="col-form-label">City</label>
                            <div className="pass-group group-img">
                              <span className="lock-icon">
                                <i className="feather-map-pin" />
                              </span>
                              <select
                                className="form-control"
                                value={city}
                                onChange={(e) => selectCity(e.target.value)}
                                disabled={!state}
                              >
                                <option value="">Select City</option>
                                {cityDropdown.map((city) => (
                                  <option key={city.id} value={city.id}>
                                    {city.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Address */}
                          <div className="col-md-6 form-group">
                            <label className="col-form-label">Address</label>
                            <div className="pass-group group-img">
                              <span className="lock-icon">
                                <i className="feather-home" />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
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
