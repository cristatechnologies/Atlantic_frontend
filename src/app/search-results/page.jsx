"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { MdAppRegistration } from "react-icons/md";
import BusinessCard from "@/components/HomePage/slider/BusinessCard";

const Search = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const location = searchParams.get("location");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);

        // Build query parameters object
        const params = new URLSearchParams();
        if (query) params.append("search", query);
        if (location) params.append("location", location);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/business?${params.toString()}`
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
  }, [query, location]);

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
              {searchResults.length === 0 ? (
                <div className="mb-5">
                  <div className="alert alert-info ">No results found.</div>
                  <Link className="btn btn-primary" href={"/"}>
                    Back to Home
                  </Link>
                </div>
              ) : (
                <div className="lateestads-content">
                  <div className="row">
                    {searchResults.map((item, index) => (
                      <BusinessCard item={item} key={index} />
                    ))}
                  </div>
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
