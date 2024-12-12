'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { RWebShare } from "react-web-share";
import { usePathname } from "next/navigation";

const DailyDealsComponent = () => {
  useAuth();

  const pathName = usePathname()
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
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/daily-offers
`
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
      {/* <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center text-center">
            <div className="col-md-12 col-12">
              <h2 className="breadcrumb-title">Active Offers</h2>
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Active-Offers
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div> */}
      <div className="list-content">
        <div className="container">
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {dailyOffers.map((offer) => (
              <div className="col" key={offer.id}>
                <Link href={`/active-offers/${offer.slug}`}>
                <div className="card h-100 offer-card">
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${offer.image}`}
                    className="card-img-top offer-image"
                    alt={offer.title}
                    />
                  <div className="card-body">
                    <h6 className="card-title">
                      {offer.title}
                    </h6>
                    <p className="card-text">{offer.description}</p>
                  
                  </div>
                </div>
                    </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        
      `}</style>
    </>
  );
};

export default DailyDealsComponent;