"use client";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import Image from "next/image";




const BusinessProfileComponent = () => {
  const websiteData = useSelector((state) => state.websiteSetup.data);

  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [countryDropdown, setCountryDropdown] = useState([]);
  const [stateDropdown, setStateDropdown] = useState([]);
  const [cityDropdown, setCityDropdown] = useState([]);
  const formRef = useRef(null);
  const [imagePreview, setImagePreview] = useState("/img/profile.jpg");
  const [bannerPreview, setBannerPreview] = useState(
    `${process.env.NEXT_PUBLIC_BASE_URL}${websiteData?.image_content.become_seller_avatar}`
  );
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [categories, setCategories] = useState([]);
  const [productTags, setProductTags] = useState([]);
  const tagifyRef = useRef(null);
const [customCityName, setCustomCityName] = useState("");
const [isCityCustom, setIsCityCustom] = useState(false);
  const [tags, setTags] = useState([]);

  const handleTagChange = (newTags) => {
    console.log("Type of newTags:", typeof newTags);
    console.log(
      "Structure of newTags:",
      Array.isArray(newTags) ? "Array" : "Not an Array",
      newTags
    );

    if (Array.isArray(newTags)) {
      try {
        const tagArray = newTags.map((tag, index) => ({
          id: index + 1,
          value: tag.value,
        }));
        setTags(tagArray);
        console.log("Updated tags as associative array:", tagArray);
      } catch (error) {
        console.error("Error processing tags:", error);
      }
    } else {
      console.error("Expected newTags to be an array, but received:", newTags);
    }
  };

  useEffect(() => {
    if (websiteData?.businessCategories) {
      setCategories(websiteData.businessCategories);
    }
  }, [websiteData]);

  useEffect(() => {
    if (profileData) {
      setSelectedCountry("Canada");
      setSelectedState(profileData.state_id);
      setSelectedCity(profileData.city_id);
    }
  }, [profileData]);


   const handleCityChange = (e) => {
     const inputValue = e.target.value;

     // Check if the input matches any dropdown city
     const matchedCity = cityDropdown.find(
       (item) => item.name.toLowerCase() === inputValue.toLowerCase()
     );

     if (matchedCity) {
       // If input matches a dropdown city, use its ID as city_id
       setSelectedCity(matchedCity.name.toString());
     } else {
       // If no match, use the input value as city_id
       setSelectedCity(inputValue);
     }
   };

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    if (authData && authData.user) {
      const { user } = authData;

      if (user.user_type !== 1) {
        router.push("/");
        return;
      }

      const businessData = user.business;
      if (businessData) {
        setProfileData(businessData);
        setImagePreview(
          businessData.image
            ? `${process.env.NEXT_PUBLIC_BASE_URL}${businessData.image}`
            : "/img/profile.jpg"
        );
        setBannerPreview(
          businessData.banner_image
            ? `${process.env.NEXT_PUBLIC_BASE_URL}${businessData.banner_image}`
            : "/img/banner-default-old.jpg"
        );

        // Initialize productTags from the auth data
        if (businessData.products) {
          setProductTags(
            businessData.products.split(",").map((product) => product.trim())
          );
        }

        // Fetch dropdowns
        fetchCountries();
        if (businessData.country_id) getState(businessData.country_id);
        if (businessData.state_id) getCity(businessData.state_id);
      }
    }
  }, []);

  const handleProductTagChange = (tags) => {
    setProductTags(tags);
    console.log("Updated product tags (comma-separated):", tags.join(","));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    formData.append("products", productTags.join(","));


     if (selectedCity) {
       formData.set("city_id", selectedCity);
     }

    const authData = JSON.parse(localStorage.getItem("auth"));
    const token = authData?.access_token;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/business-update-profile?token=${token}`,
        formData
      );

      console.log("Full API Response:", response);
      console.log("Response Data:", response.data);

      if (response.data && response.data.data) {
        toast.success(
          response.data.notification || "Profile updated successfully"
        );

        // Use the updated business data from the API response
        const updatedBusiness = response.data.data;

        const updatedAuthData = {
          ...authData,
          user: {
            ...authData.user,
            business: updatedBusiness,
          },
        };

        // Update localStorage
        localStorage.setItem("auth", JSON.stringify(updatedAuthData));

        // Update state
        setProfileData(updatedBusiness);

        console.log(
          "Updated localStorage:",
          JSON.parse(localStorage.getItem("auth"))
        );

        // Refresh the page to reflect changes
        router.refresh();
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error in ProfileUpdate", err);
      toast.error("Failed to update profile");
    }
  };

  const handleImageChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "logo") {
          setImagePreview(reader.result);
        } else if (type === "banner") {
          setBannerPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchCountries = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}api/user/address/create`)
      .then((res) => {
        if (res.data) {
          setCountryDropdown(res.data.countries);
        }
      })
      .catch((err) => console.log(err));
  };

  const getState = (countryName) => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/state-by-country/?name=${countryName}`
      )
      .then((res) => {
        setStateDropdown(res.data?.states || []);
      })
      .catch((err) => console.log(err));
  };

  const getCity = (stateName) => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/city-by-state/?name=${stateName}`
      )
      .then((res) => {
        setCityDropdown(res.data?.cities || []);
      })
      .catch((err) => console.log(err));
  };

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    setSelectedCountry("Canada");
    setSelectedState("");
    setSelectedCity("");
    getState(countryName);
  };

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setSelectedState(stateName);
    setSelectedCity("");
    getCity(stateName);
  };
  // ... (keep other functions like getState, getCity, etc.)

  return (
    <>
      {/* ... (keep the breadcrumb section) */}

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
                    <h4>Business Profile Details</h4>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleProfileUpdate} ref={formRef}>
                      <div className="row mb-4">
                        <div className="col-md-6">
                          {/*profile image */}
                          <div className="profile-photo">
                            <div className="profile-img">
                              <Image
                                src={imagePreview}
                                alt="Logo"
                                width={200}
                                height={150}
                                objectFit="scale-down"
                              />
                              <div className="settings-upload-btn mt-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  name="image"
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
                        {/*banner image */}
                        <div className="col-md-6">
                          <div className="profile-photo">
                            <div className="profile-img">
                              <Image
                                src={bannerPreview}
                                alt="banner"
                                width={200}
                                height={150}
                                objectFit="scale-down"
                              />
                              <div className="settings-upload-btn mt-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  name="banner_image"
                                  className="hide-input image-upload"
                                  id="banner-file"
                                  onChange={(e) =>
                                    handleImageChange(e, "banner")
                                  }
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
                        {/* b name  */}
                        <div className="col-md-6 form-group">
                          <label className="col-form-label">
                            Business Name
                          </label>
                          <div className="pass-group group-img">
                            <span className="lock-icon">
                              <i className="feather-briefcase" />
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              defaultValue={profileData?.name || ""}
                            />
                          </div>
                        </div>
                        {/* d name */}
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
                              defaultValue={profileData?.display_name || ""}
                            />
                          </div>
                        </div>
                        {/* reg number */}
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
                              defaultValue={profileData?.reg_no || ""}
                            />
                          </div>
                        </div>
                        {/* short desc */}
                        <div className="col-md-6 form-group">
                          <label className="col-form-label">
                            Short Description
                          </label>
                          <div className="pass-group group-img">
                            <span className="lock-icon">
                              <i className="feather-info" />
                            </span>
                            <input
                              className="form-control"
                              name="description"
                              defaultValue={profileData?.description || ""}
                              rows="3"
                            ></input>
                          </div>
                        </div>
                        {/* long */}
                        <div className="col-md-6 form-group">
                          <label className="col-form-label">
                            Long Description
                          </label>
                          <div className="pass-group group-img">
                            <span className="lock-icon">
                              <i className="feather-file-text" />
                            </span>
                            <input
                              className="form-control"
                              name="long_description"
                              defaultValue={profileData?.long_description || ""}
                            ></input>
                          </div>
                        </div>
                        <div className="col-md-6 form-group">
                          <label className="col-form-label">
                            Address Line 1
                          </label>
                          <div className="pass-group group-img">
                            <span className="lock-icon">
                              <i className="feather-map-pin" />
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              name="address_line_one"
                              defaultValue={profileData?.address_line_one || ""}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 form-group">
                          <label className="col-form-label">
                            Address Line 2
                          </label>
                          <div className="pass-group group-img">
                            <span className="lock-icon">
                              <i className="feather-map-pin" />
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              name="address_line_two"
                              defaultValue={profileData?.address_line_two || ""}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 form-group">
                          <label className="col-form-label">Zip Code</label>
                          <div className="pass-group group-img">
                            <span className="lock-icon">
                              <i className="feather-map-pin" />
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              name="zip_code"
                              defaultValue={profileData?.zip_code || ""}
                            />
                          </div>
                        </div>
                        {/* country */}
                        <div className="col-md-6 form-group">
                          <label className="col-form-label">Country</label>
                          <div className="pass-group group-img">
                            <span className="lock-icon">
                              <i className="feather-globe" />
                            </span>
                            <select className="form-control" name="country_id">
                              <option value="Canada">Canada</option>
                            </select>
                          </div>
                        </div>
                        {/* state */}
                        <div className="col-md-6 form-group">
                          <label className="col-form-label">Province </label>
                          <div className="pass-group group-img">
                            <span className="lock-icon">
                              <i className="feather-map" />
                            </span>
                            <select
                              className="form-control"
                              name="state_id"
                              value={selectedState}
                              onChange={handleStateChange}
                              disabled={!selectedCountry}
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
                        {/* city */}
                        <div className="col-md-6 form-group">
                          <label className="col-form-label">City</label>
                          <div className="pass-group group-img d-flex align-items-center">
                            <span className="lock-icon">
                              <i className="feather-map-pin" />
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Select or Enter City"
                              list="cityList"
                              name="city_id"
                              value={
                                selectedCity
                                  ? cityDropdown.find(
                                      (city) =>
                                        city.name.toString() === selectedCity
                                    )?.name || selectedCity
                                  : ""
                              }
                              onChange={handleCityChange}
                            />
                            <datalist id="cityList">
                              {cityDropdown.map((city) => (
                                <option key={city.id} value={city.name} />
                              ))}
                            </datalist>
                          </div>
                        </div>
                        {/* business category */}
                        <div className="col-md-6 form-group">
                          <label htmlFor="business_category_id">
                            Business Category
                          </label>
                          <select
                            name="business_category_id"
                            id="business_category_id"
                            className="form-control"
                            value={profileData?.business_category_id || ""}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                business_category_id: e.target.value,
                              })
                            }
                          >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {/* products */}
                        <div className="col-md-6 form-group">
                          <label className="col-form-label">Products/Services</label>
                          <div className="custom-tags-input">
                            <TagsInput
                              value={productTags}
                              onChange={handleProductTagChange}
                              inputProps={{
                                className: "react-tagsinput-input",
                                placeholder: "Add a product",
                              }}
                            />
                          </div>
                        </div>
                        {/* status */}
                        <div className="col-md-6 form-group">
                          <label className="col-form-label">Status</label>
                          <div className="pass-group group-img">
                            <span className="lock-icon">
                              <i className="feather-toggle-right" />
                            </span>
                            <select
                              className="form-control"
                              name="status"
                              defaultValue={profileData?.status || ""}
                            >
                              <option value="1">Active</option>
                              <option value="0">Inactive</option>
                            </select>
                          </div>
                        </div>
                        {/* contact person name  */}
                        <div className="col-md-6 form-group">
                          <label className="col-form-label">
                            Contact Person Name
                          </label>
                          <div className="pass-group group-img">
                            <span className="lock-icon">
                              <i className="feather-user" />
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              name="contact_person_name"
                              defaultValue={
                                profileData?.contact_person_name || ""
                              }
                            />
                          </div>
                        </div>
                        {/* mail */}
                        <div className="col-md-6 form-group">
                          <label className="col-form-label">
                            Contact Person Email
                          </label>
                          <div className="pass-group group-img">
                            <span className="lock-icon">
                              <i className="feather-mail" />
                            </span>
                            <input
                              type="email"
                              className="form-control"
                              name="contact_person_email"
                              defaultValue={
                                profileData?.contact_person_email || ""
                              }
                            />
                          </div>
                        </div>
                        {/* number */}
                        <div className="col-md-6 form-group">
                          <label className="col-form-label">
                            Contact Person Number
                          </label>
                          <div className="pass-group group-img">
                            <span className="lock-icon">
                              <i className="feather-phone" />
                            </span>
                            <input
                              type="tel"
                              className="form-control"
                              name="contact_person_number"
                              defaultValue={
                                profileData?.contact_person_number || ""
                              }
                            />
                          </div>
                        </div>
                        {/*linkedin*/}
                        <div className="col-md-6 form-group">
                          <label className="col-form-label">Linkedin</label>
                          <div className="pass-group group-img">
                            <span className="lock-icon">
                              <i className="feather-linkedin" />
                            </span>
                            <input
                              type="url"
                              className="form-control"
                              name="linkedin "
                              defaultValue={profileData?.linkedin || ""}
                            />
                          </div>
                        </div>
                        {/* twitter */}
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
                              defaultValue={profileData?.twitter || ""}
                            />
                          </div>
                        </div>
                        {/* youtube */}
                        <div className="col-md-6 form-group">
                          <label className="col-form-label">Youtube</label>
                          <div className="pass-group group-img">
                            <span className="lock-icon">
                              <i className="feather-youtube" />
                            </span>
                            <input
                              type="url"
                              className="form-control"
                              name="youtube"
                              defaultValue={profileData?.youtube || ""}
                            />
                          </div>
                        </div>
                        {/* facebook */}
                        <div className="col-md-6 form-group">
                          <label className="col-form-label">facebook</label>
                          <div className="pass-group group-img">
                            <span className="lock-icon">
                              <i className="feather-facebook" />
                            </span>
                            <input
                              type="url"
                              className="form-control"
                              name="facebook"
                              defaultValue={profileData?.facebook || ""}
                            />
                          </div>
                        </div>
                        {/* instagram */}
                        <div className="col-md-6 form-group">
                          <label className="col-form-label">instagram</label>
                          <div className="pass-group group-img">
                            <span className="lock-icon">
                              <i className="feather-instagram" />
                            </span>
                            <input
                              type="url"
                              className="form-control"
                              name="instagram"
                              defaultValue={profileData?.instagram || ""}
                            />
                          </div>
                        </div>
                        {/* youtube */}
                        <div className="col-md-6 form-group">
                          <label className="col-form-label">Map Link</label>
                          <div className="pass-group group-img">
                            <span className="lock-icon">
                              <i className="feather-map-pin" />
                            </span>
                            <input
                              type="url"
                              className="form-control"
                              name="map_link"
                              defaultValue={profileData?.map_link || ""}
                            />
                          </div>
                        </div>
                        {/* youtube */}
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
                              defaultValue={profileData?.website || ""}
                            />
                          </div>
                        </div>
                        {/* Add more fields as needed */}
                      </div>

                      <div className="d-flex align-items-center justify-content-between mt-4">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                        >
                          Save Changes
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
    </>
  );
};

export default BusinessProfileComponent;
