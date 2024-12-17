"use client";
import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import PageHead from "@/components/helper/PageHead/page";
import axios from "axios";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";

const CustomSlugComponent = () => {
  const router = useRouter();
  const pathName = usePathname();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metaDetails, setMetaDetails] = useState({
    meta_title: "",
    meta_description: "",
    meta_keyword: "",
  });
  const [slugData, setSlugData] = useState(null);

  // Separate function to fetch website setup
  const fetchWebsiteSetup = async () => {
    try {
      setLoading(true);
      // Ensure API call is made every time
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/website-setup`
      );

      // Get the current path
      const currentPath = pathName;

      const findPage = (pages, pathName) => {
        for (let page of pages) {
          if (page.slug === pathName) {
            return page;
          }
          if (page.children && page.children.length > 0) {
            const childResult = findPage(page.children, pathName);
            if (childResult) return childResult;
          }
        }
        return null;
      };

      const customPage = findPage(response.data.customPages, currentPath);

      if (customPage) {
        setMetaDetails({
          meta_title: customPage.page_name,
          meta_description: customPage.description,
          meta_keyword: customPage.slug,
        });
        setSlugData(customPage);
      } else {
        // Handle 404 scenario
        router.push("/404");
        toast.error("Page not found");
      }
    } catch (err) {
      setError(err);
      router.push("/404");
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect to trigger API call on component mount and path change
  useEffect(() => {
    fetchWebsiteSetup();
  }, [pathName]); // Add pathName to dependency array to re-fetch when path changes

  // Loading state
  if (loading) {
    return (
      <div className="centered">
        <div className="dot-spinner">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="dot-spinner__dot"></div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <PageHead
        title={metaDetails.meta_title}
        metaDes={metaDetails.meta_description}
        metaKeyword={metaDetails.meta_keyword}
      />

      <div
        className="terms-content"
        style={{ paddingTop: "170px", paddingBottom: "90px" }}
      >
        <div className="container">
          <div className="row">
            <div className="terms-info">
              {slugData && (
                <div
                  className="text-black"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(slugData.description),
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomSlugComponent;
