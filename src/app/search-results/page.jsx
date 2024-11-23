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
      <section className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center text-center">
            <div className="col-md-12 col-12">
              <h2 className="breadcrumb-title">Search Results</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Search Results
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section className="section-search-results">
        <div className="container">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              <p className="mb-4">
                Search Results for:{" "}
                <span className="">
                  "{query} in  {location}"
                </span>
              
              </p>
              {searchResults.length === 0 ? (
                <div>
                  <div className="alert alert-info">No results found.</div>
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
                            <Link href={`/business-details/${business.id}`}>
                              <Image
                                src={`${process.env.NEXT_PUBLIC_BASE_URL}${business.image}`}
                                width={400}
                                height={300}
                                className="img-fluid"
                                alt={business.name}
                              />
                            </Link>
                            {/* <div className="fav-item">
                              <Link href="#" className="fav-icon">
                                <i className="feather-heart"></i>
                              </Link>
                            </div> */}
                          </div>
                          <div className="bloglist-content">
                            <div className="card-body">
                              <div className="blogfeaturelink">
                                {/* <div className="blog-features text-black">
                                  <span>
                                    <i className="fa-regular fa-circle-stop"></i>{" "}
                                    {business.business_category.name}
                                  </span>
                                </div> */}
                              </div>
                              <h6 className="text-black">
                                <Link href={`/business-details/${business.id}`}>
                                  {business.name}
                                </Link>
                              </h6>
                              <div className="blog-location-details text-black">
                                <div className="location-info">
                                  <i className="feather-map-pin"></i>{" "}
                                  {business.address}
                                </div>
                                {/* <div className="location-info">
                                  <i className="fa-solid fa-calendar-days"></i>{" "}
                                  {new Date(
                                    business.created_at
                                  ).toLocaleDateString()}
                                </div> */}
                              </div>
                              <p className="text-black mt-2">
                                {business.description}
                              </p>
                              <div className="blog-location-details text-black">
                                <div className="location-info">
                                  <i className="feather-user"></i>{" "}
                                  {business.contact_person_name}
                                </div>
                                <div className="location-info">
                                  <i className="feather-phone"></i>{" "}
                                  {business.contact_person_number}
                                </div>
                              </div>
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
