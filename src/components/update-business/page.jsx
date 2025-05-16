"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
import { Suspense } from "react";

const UpdateBusinessPage = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const websiteData = useSelector((state) => state.websiteSetup.data);
  const [formData, setFormData] = useState({
    business_name: "",
    reg_no: "",
    display_name: "",
    description: "",
    long_description: "",
    address_line_one: "",
    address_line_two: "",
    business_category_id: "",
    phone: "",
    email: "",
    name: "",
    country_id: "Canada",
    state_id: "",
    city_id: "",
    zip_code: "",
    other_locations: "",
    website: "",
    instagram: "",
    facebook: "",
    twitter: "",
    youtube: "",
    linkedin: "",
    password: "",
  });

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
  const [imagePreview, setImagePreview] = useState(
    `${process.env.NEXT_PUBLIC_BASE_URL}${websiteData?.image_content?.become_seller_avatar}`
  );
  const [bannerPreview, setBannerPreview] = useState(
    `${process.env.NEXT_PUBLIC_BASE_URL}${websiteData?.image_content?.become_seller_banner}`
  );

  useEffect(() => {
    const email = searchParams.get("email");
    console.log("email", email);

    if (email) {
      fetchBusinessData(email);
      fetchCategories();
      fetchStates("Canada");
    } else {
      setIsFetching(false);
      toast.error("Email parameter is missing");
    }
  }, [searchParams]);

  const fetchBusinessData = async (email) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/business-profile-data`,
        { email }
      );

      const business = response.data.business;
      const user = response.data.user;

      setFormData({
        business_name: business?.name || "",
        reg_no: business?.reg_no || "",
        display_name: business?.display_name || "",
        description: business?.description || "",
        long_description: business?.long_description || "",
        address_line_one:
          business?.address_line_one || user?.address_line_one || "",
        address_line_two:
          business?.address_line_two || user?.address_line_two || "",
        business_category_id: business?.business_category_id || "",
        phone: business?.contact_person_number || user?.phone || "",
        email: business?.contact_person_email || user?.email || "",
        name: user?.name || "",
        country_id: business?.country_id || user?.country_id || "Canada",
        state_id: business?.state_id || user?.state_id || "",
        city_id: business?.city_id || user?.city_id || "",
        zip_code: business?.zip_code || user?.zip_code || "",
        other_locations: business?.other_locations || "",
        website: business?.website || "",
        instagram: business?.instagram || "",
        facebook: business?.facebook || "",
        twitter: business?.twitter || "",
        youtube: business?.youtube || "",
        linkedin: business?.linkedin || "",
        password: "",
      });

      if (business?.state_id || user?.state_id) {
        fetchCities(business?.state_id || user?.state_id);
      }

      // Store original image paths for comparison later
      if (business?.image) {
        setOriginalImage(business.image);
        setImagePreview(`${process.env.NEXT_PUBLIC_BASE_URL}${business.image}`);
      }
      if (business?.banner_image) {
        setOriginalBanner(business.banner_image);
        setBannerPreview(
          `${process.env.NEXT_PUBLIC_BASE_URL}${business.banner_image}`
        );
      }
    } catch (error) {
      console.error("Error fetching business data:", error);
      toast.error("Failed to load business data");
    } finally {
      setIsFetching(false);
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "logo") {
          setImagePreview(reader.result);
          setImageFile(file);
        } else {
          setBannerPreview(reader.result);
          setBannerFile(file);
        }
      };
      reader.readAsDataURL(file);
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

  const fetchStates = async (countryName) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/state-by-country/?name=${countryName}`
      );
      setStateDropdown(response.data?.states || []);
    } catch (error) {
      console.error("Error fetching states:", error);
      toast.error("Failed to load states");
    }
  };

  const fetchCities = async (stateName) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/city-by-state/?name=${stateName}`
      );
      setCityDropdown(response.data?.cities || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Failed to load cities");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setFormData((prev) => ({
      ...prev,
      state_id: stateName,
      city_id: "",
    }));
    fetchCities(stateName);
  };

  const handleCityChange = (e) => {
    const inputValue = e.target.value;
    setFormData((prev) => ({
      ...prev,
      city_id: inputValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    if (bannerFile) {
      formDataToSend.append("banner_image", bannerFile);
    }

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
          response.data.message || "Business updated successfully!"
        );
        localStorage.removeItem("auth");

        // Set a flag in sessionStorage to indicate redirect is needed after refresh
        sessionStorage.setItem("redirectToLogin", "true");

        // Refresh the page

        setTimeout(() => {
          window.location.reload();
        }, [1500]);
      } else {
        toast.error(response.data.message || "Failed to update business");
      }
    } catch (error) {
      console.error("Error updating business:", error);
      toast.error(error.response?.data?.message || "Failed to update business");
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
                  <h4>Update Business</h4>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <div className="profile-photo">
                          <div className="profile-img">
                            <Image
                              src={imagePreview}
                              alt="Logo"
                              width={200}
                              height={150}
                              objectFit="scale-down"
                              onError={(e) => {
                                e.target.src = `${process.env.NEXT_PUBLIC_BASE_URL}${websiteData?.image_content?.become_seller_avatar}`;
                              }}
                            />
                            <div className="settings-upload-btn mt-2">
                              <input
                                type="file"
                                accept="image/*"
                                name="image_input"
                                className="hide-input image-upload"
                                id="logo-file"
                                onChange={(e) => handleImageChange(e, "logo")}
                              />
                              <label
                                htmlFor="logo-file"
                                className="btn btn-sm btn-primary"
                              >
                                Upload Logo
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="profile-photo">
                          <div className="profile-img">
                            <Image
                              src={bannerPreview}
                              alt="banner"
                              width={200}
                              height={150}
                              objectFit="scale-down"
                              onError={(e) => {
                                e.target.src = `${process.env.NEXT_PUBLIC_BASE_URL}${websiteData?.image_content?.become_seller_banner}`;
                              }}
                            />
                            <div className="settings-upload-btn mt-2">
                              <input
                                type="file"
                                accept="image/*"
                                name="banner_image_input"
                                className="hide-input image-upload"
                                id="banner-file"
                                onChange={(e) => handleImageChange(e, "banner")}
                              />
                              <label
                                htmlFor="banner-file"
                                className="btn btn-sm btn-primary"
                              >
                                Upload Banner
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      {/* Business Information */}
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
                            required
                          />
                        </div>
                      </div>

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

                      <div className="col-md-6 form-group">
                        <label className="col-form-label">Display Name</label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-user" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            name="display_name"
                            value={formData.display_name}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="col-md-6 form-group">
                        <label className="col-form-label">
                          Contact Person Name *
                        </label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-user" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6 form-group">
                        <label className="col-form-label">
                          Short Description *
                        </label>
                        <div className="pass-group group-img">
                          <textarea
                            className="form-control"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                            required
                          ></textarea>
                        </div>
                      </div>

                      <div className="col-md-6 form-group">
                        <label className="col-form-label">
                          Long Description
                        </label>
                        <div className="pass-group group-img">
                          <textarea
                            className="form-control"
                            name="long_description"
                            value={formData.long_description}
                            onChange={handleInputChange}
                            rows="3"
                          ></textarea>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="col-md-6 form-group">
                        <label className="col-form-label">Phone Number *</label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-phone" />
                          </span>
                          <input
                            type="tel"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

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
                            required
                          />
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
                            type="password"
                            className="form-control"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter password"
                            required
                          />
                        </div>
                      </div>

                      {/* Address Information */}
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
                            required
                          />
                        </div>
                      </div>

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
                          />
                        </div>
                      </div>

                      <div className="col-md-6 form-group">
                        <label className="col-form-label">Zip Code *</label>
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
                            required
                          />
                        </div>
                      </div>

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
                            onChange={handleStateChange}
                            required
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
                            onChange={handleCityChange}
                            required
                          />
                          <datalist id="cityList">
                            {cityDropdown.map((city) => (
                              <option key={city.id} value={city.name} />
                            ))}
                          </datalist>
                        </div>
                      </div>

                      <div className="col-md-6 form-group">
                        <label className="col-form-label">
                          Other Locations
                        </label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-map-pin" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            name="other_locations"
                            value={formData.other_locations}
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
                            required
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

                      {/* Social Media */}
                      <div className="col-md-6 form-group">
                        <label className="col-form-label">Website</label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-link" />
                          </span>
                          <input
                            type="url"
                            className="form-control"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            placeholder="https://"
                          />
                        </div>
                      </div>

                      <div className="col-md-6 form-group">
                        <label className="col-form-label">Facebook</label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-facebook" />
                          </span>
                          <input
                            type="url"
                            className="form-control"
                            name="facebook"
                            value={formData.facebook}
                            onChange={handleInputChange}
                            placeholder="https://facebook.com/username"
                          />
                        </div>
                      </div>

                      <div className="col-md-6 form-group">
                        <label className="col-form-label">Instagram</label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-instagram" />
                          </span>
                          <input
                            type="url"
                            className="form-control"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleInputChange}
                            placeholder="https://instagram.com/username"
                          />
                        </div>
                      </div>

                      <div className="col-md-6 form-group">
                        <label className="col-form-label">Twitter</label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-twitter" />
                          </span>
                          <input
                            type="url"
                            className="form-control"
                            name="twitter"
                            value={formData.twitter}
                            onChange={handleInputChange}
                            placeholder="https://twitter.com/username"
                          />
                        </div>
                      </div>

                      <div className="col-md-6 form-group">
                        <label className="col-form-label">YouTube</label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-youtube" />
                          </span>
                          <input
                            type="url"
                            className="form-control"
                            name="youtube"
                            value={formData.youtube}
                            onChange={handleInputChange}
                            placeholder="https://youtube.com/username"
                          />
                        </div>
                      </div>

                      <div className="col-md-6 form-group">
                        <label className="col-form-label">LinkedIn</label>
                        <div className="pass-group group-img">
                          <span className="lock-icon">
                            <i className="feather-linkedin" />
                          </span>
                          <input
                            type="url"
                            className="form-control"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleInputChange}
                            placeholder="https://linkedin.com/username"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between mt-4">
                      <button
                        className="btn btn-primary btn-block"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Updating..." : "Update Business"}
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
