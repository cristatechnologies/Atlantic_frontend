"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import Link from "next/link";
import { setupAction } from "@/store/websiteSetup";
import PageHead from "@/components/helper/PageHead/page";

const CustomSlugComponent = ({ pathName }) => {
  const dispatch = useDispatch();
    const websiteData = useSelector((state) => state.websiteSetup.data);
  const loading = useSelector((state) => state.websiteSetup.loading);
  const error = useSelector((state) => state.websiteSetup.error);
  const [metaDetails, setMetaDetails] = useState({
    meta_title: "",
    meta_description: "",
    meta_keyword: "",
  });
  const [slugData, setSlugData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!websiteData) {
      const fetchWebsiteSetup = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/websiteSetup`); // Adjust the API endpoint
          const data = await response.json();
          dispatch(setupAction(data));
        } catch (error) {
          console.error("Error fetching website setup:", error);
        }
      };
      fetchWebsiteSetup();
    }
  }, [dispatch, websiteData]);

  useEffect(() => {
    if (websiteData) {
      const slug = pathName.split("/")[1];
      const findPage = (pages) => {
        for (let page of pages) {
          if (page.slug === slug) {
            return page;
          }
          if (page.children && page.children.length > 0) {
            const childResult = findPage(page.children);
            if (childResult) return childResult;
          }
        }
        return null;
      };
      const customPage = findPage(websiteData.customPages);
      if (customPage) {
        const { description, page_name, slug } = customPage;
        setMetaDetails({
          meta_title: page_name,
          meta_description: description,
          meta_keyword: slug,
        });
        setSlugData(customPage);
      } else {
        router.push("/404");
      }
    }
  }, [websiteData, pathName, router]);

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <PageHead
        title={metaDetails.meta_title}
        metaDes={metaDetails.meta_description}
        metaKeyword={metaDetails.meta_keyword}
      />
      {/* Breadcrumb Section */}
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center text-center">
            <div className="col-md-12 col-12">
              <h2 className="breadcrumb-title">{metaDetails.meta_title}</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {metaDetails.meta_title}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb Section */}

      {/* Content Section */}
      <div className="terms-content">
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
      {/* /Content Section */}
    </>
  );
};

export default CustomSlugComponent;
