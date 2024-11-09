'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
const DailyDealsComponent = () => {
  useAuth();
  const router = useRouter();
  const [dailyOffers, setDailyOffers] = useState([]);
  const [Error,setError]=useState(null)
  useEffect(() => {
    // Fetch token from local storage on the client side
    const auth =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("auth"))
        : null;
    const token = auth?.access_token;

    if (!token) {
      toast.error("Please log in.");
    router.push("/login")
      return;
    }

    const fetchDailyOffers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/daily-offers`
        );
        setDailyOffers(response.data);
      } catch (error) {
        console.error("Error fetching daily offers:", error);
        
      }
    };

    fetchDailyOffers();
  }, []);

  return (
    <>
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center text-center">
            <div className="col-md-12 col-12">
              <h2 className="breadcrumb-title">Active Deals</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Active-deals
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="list-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="blog-listview">
                {dailyOffers.map((offer) => (
                  <div className="card border hover-overlay hover-zoom hover-shadow ripple" key={offer.id}>
                    <div className="blog-widget">
                      <div className="blog-img">
                        <img
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}${offer.image}`}
                          className="img-fluid offer-image"
                          alt={offer.title}
                          width={225}
                          height={225}
                        />
                      </div>
                      <div className="bloglist-content">
                        <div className="card-body">
                          <h6>
                            <Link href="#">{offer.title}</Link>
                          </h6>
                          <div className="blogfeaturelink">
                            <div className="blog-features">
                              <Link href="#">
                                <span>{offer.description}</span>
                              </Link>
                            </div>
                          </div>

                          {/* <div className="blog-location-details">
                            <div className="location-info">
                              <i className="feather-map-pin" /> Location
                            </div>
                            <div className="location-info">
                              <i className="feather-phone-call" /> Contact
                            </div>
                            <div className="location-info">
                              <i className="feather-eye" /> Views
                            </div>
                          </div>
                          <p className="ratings">
                            <span>4.0</span> ( 50 Reviews )
                          </p>
                          <div className="amount-details">
                            <div className="amount">
                              <span className="validrate">$350</span>
                              <span>$450</span>
                            </div>
                            <Link href="/service-details">View details</Link>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="blog-pagination">{/* Pagination content */}</div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .offer-image {
          width: 225px;
          height: 225px;
          object-fit: cover;
          object-position: center;
        }
        .offer-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s ease;
        }
        .offer-card:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
         
      `}</style>
    </>
  );
};

export default DailyDealsComponent;