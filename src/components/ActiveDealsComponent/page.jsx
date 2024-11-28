const { useState, useEffect } = require("react");
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import { RWebShare } from "react-web-share";
import { useRouter } from "next/navigation";

const AcitveDealsComponent = ({ pathName }) => {

const router = useRouter()
  const slug = pathName.split("/")[2];
  console.log("slug in active-deals slug page is ", slug);
  const [apiData, setApiData] = useState();

  useEffect(() => {
    // Fetch token from local storage on the client side
    const auth =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("auth"))
        : null;
    const token = auth?.access_token;

    if (!token) {
      toast.error("Please log in.");
      router.push("/login");
      return;
    } 
  }, []);

  useEffect(() => {
    const fetchDailyOffersBySlug = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem("auth") || "null");
        const token = auth?.access_token;

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/daily-offers-slug/${slug}?token=${token}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setApiData(data);
      } catch (error) {
        console.error("Error fetching daily offers:", error);
      }
    };

    if (slug) {
      fetchDailyOffersBySlug();
    }
  }, [slug]);

  return (
    <>
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center text-center">
            <div className="col-md-12 col-12">
              <h2 className="breadcrumb-title">{apiData?.title}</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href="/active-deals">Active Deals</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {apiData?.slug}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="my-3 sm:my-5">
        <div className="container card">
          <div className="row">
            <div className="col-md-6 h-auto">
              <div className="container">
                <div className="row gx-4">
                  <div className="col-12">
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}${apiData?.image}`}
                      className="img-fluid w-100 h-100 d-md-block"
                      style={{ maxHeight: "500px", maxWidth: "500px" }}
                      alt="deal-img"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 h-auto">
              <div>
                <h3 className="deal-title">{apiData?.title}</h3>{" "}
                <a className="pe-auto">
                  <RWebShare
                    data={{
                      text: "Look i got a Great Deal from IndoAtlantic !!",
                      url: `https://indoatlantic.ca${pathName}`,
                      title: "indoatlantic",
                    }}
                    sites={[
                      "facebook",
                      "twitter",
                      "whatsapp",
                      "linkedin",
                      "reddit",
                      "mail",
                      "copy",
                    ]}
                    onClick={() => console.log("shared successfully!")}
                  >
                    <i className="feather-share-2" />
                  </RWebShare>
                </a>
                <p className="mb-0">{apiData?.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};



export default AcitveDealsComponent;
