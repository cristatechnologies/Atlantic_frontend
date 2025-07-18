"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AskOption from "./ask-option";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";



const CreateBusinessPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    business_name: "",
    phone: "",
    address_line_one: "",
    address_line_two: "",
    zip_code: "",
    business_category_id: "",
    country_id: "Canada",
    state_id: "",
    city_id: "",
    email: "",
    description:"",
  });

  const [categories, setCategories] = useState([]);
  const [stateDropdown, setStateDropdown] = useState([]);
  const [cityDropdown, setCityDropdown] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    setToken(authData?.access_token || "");
  }, []);
  
  useEffect(() => {
    fetchCategories();
    fetchStates("Canada"); // Default country is Canada
  }, []);

  const fetchCategories = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const token = authData?.access_token;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/all-categories`,
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
      city_id: "", // Reset city when state changes
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

   
   
    try {
     

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/create-business`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.notification) {
        toast.success("Business created successfully!");
        router.push("/");
      } else {
        toast.error(response.data.message || "Failed to create business");
      }
    } catch (error) {
      console.error("Error creating business:", error);
      toast.error(error.response?.data?.error || "Failed to create business");
    } finally {
      setIsLoading(false);
    }
  };


  if(!token) return <AskOption />

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
                  <h4>Add Business as a customer</h4>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
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
                            placeholder="Business Name "
                          />
                        </div>
                      </div>

                      <div className="col-md-6 form-group">
                        <label className="col-form-label">
                          Business Phone Number *
                        </label>
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
                            placeholder="Business Phone Number"
                          />
                        </div>
                      </div>
                      <div className="col-md-6 form-group">
                        <label className="col-form-label">Business Email</label>
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
                            placeholder="Business Email Address"
                          />
                        </div>
                      </div>
                      <div className="col-md-6 form-group">
                        <label className="col-form-label">Description</label>
                        <div className="pass-group group-img">
                          <span className="lock-icon"></span>
                          <input
                            type="text"
                            className="form-control"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Add Description of the business (eg: Services, products)  "
                          />
                        </div>
                      </div>
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
                            placeholder="Address Line 1 "
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
                            placeholder="Address Line 2"
                          />
                        </div>
                      </div>

                      <div className="col-md-6 form-group">
                        <label className="col-form-label">
                          Postal Code / Zip Code *
                        </label>
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
                            placeholder="Postal Code"
                          />
                        </div>
                      </div>

                      <div className="col-md-6 form-group">
                        <label className="col-form-label">City *</label>
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
                          Province / State *
                        </label>
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
                            <option value="">Select Province / State</option>
                            {stateDropdown.map((state) => (
                              <option key={state.id} value={state.name}>
                                {state.name}
                              </option>
                            ))}
                          </select>
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
                        <label htmlFor="business_category_id">
                          Business Category *
                        </label>
                        <select
                          name="business_category_id"
                          id="business_category_id"
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
                      {/* <div className="col-md-6 form-group">
                        <label className="col-form-label">Products</label>
                        <div className="custom-tags-input">
                          <TagsInput
                            value={formData.products}
                            onChange={handleProductTagChange}
                            inputProps={{
                              className: "react-tagsinput-input ",
                              placeholder: "Type and Press Enter  ",
                            }}
                            
                          />
                        </div>
                      </div> */}
                    </div>

                    <div className="d-flex align-items-center justify-content-between mt-4">
                      <button
                        className="btn btn-primary btn-block"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating..." : "Add Business"}
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

export default CreateBusinessPage;
