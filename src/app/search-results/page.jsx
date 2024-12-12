"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
const Search = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const location = searchParams.get("location")
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {

        try {
          setLoading(true);
          const response = await axios.get(
            `${
              process.env.NEXT_PUBLIC_BASE_URL
            }api/business?search=${encodeURIComponent(
              query
            )}&location=${encodeURIComponent(location)}`
          );
          setSearchResults(response.data || []);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching search results:", err);
          setError("An error occurred while fetching search results.");
          setLoading(false);
        }
      
    };

    fetchSearchResults();
  }, [query]);

  return (
    <>
      <section
        className="section-search-results"
        style={{ paddingTop: "170px", paddingBottom: "90px" }}
      >
        <div className="container">
          {loading ? (
            <div className="centered">
              <div className="dot-spinner">
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              <p className="mb-5 mt-5">
                Search Results for:{" "}
                <span className="">
                  "{query} in {location}"
                </span>
              </p>
              {searchResults.length === 0 ? (
                <div className="mb-5">
                  <div className="alert alert-info ">No results found.</div>
                  <Link className="btn btn-primary" href={"/"}>
                    Back to Home
                  </Link>
                </div>
              ) : (
                <div className="row">
                  {searchResults.map((business) => (
                    <div
                      className="col-lg-4 col-md-6 col-sm-12 d-flex"
                      key={business.id}
                    >
                      <div
                        className="card aos flex-fill mb-4"
                        data-aos="fade-up"
                      >
                        <div className="blog-widget">
                          <div className="blog-img">
                            <Link href={`/business-details/${business.slug}`}>
                              <Image
                                src={`${process.env.NEXT_PUBLIC_BASE_URL}${business.image}`}
                                width={400}
                                height={300}
                                className="img-fluid"
                                alt={business.name}
                              />
                            </Link>
                          </div>
                          <div className="bloglist-content">
                            <div className="card-body">
                              <h6 className="text-black">
                                <Link
                                  href={`/business-details/${business.slug}`}
                                >
                                  {business.name}
                                </Link>
                              </h6>

                              {/* Address section */}
                              {(business.business_city?.name ||
                                business.business_state?.name) && (
                                <div className="location-info">
                                  <i className="feather-map-pin"></i>{" "}
                                  {business.business_city?.name && (
                                    <>
                                      {business.business_city.name}
                                      {business.business_state?.name && ", "}
                                    </>
                                  )}
                                  {business.business_state?.name &&
                                    business.business_state.name}
                                </div>
                              )}

                              {/* Description section */}
                              {business.description && (
                                <p className="text-black mt-2">
                                  {business.description}
                                </p>
                              )}

                              {/* Contact Person */}
                              {(business.contact_person_name ||
                                business.contact_person_number) && (
                                <div className="blog-location-details text-black">
                                  {business.contact_person_name && (
                                    <div className="location-info">
                                      <i className="feather-user"></i>{" "}
                                      {business.contact_person_name}
                                    </div>
                                  )}
                                  {business.contact_person_number && (
                                    <div className="location-info">
                                      <i className="feather-phone"></i>{" "}
                                      {business.contact_person_number}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

const SearchResults = () => {
  return (
    <Suspense>
      <Search />
    </Suspense>
  );
};
export default SearchResults;
