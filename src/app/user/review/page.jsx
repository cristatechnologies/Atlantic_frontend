"use client";
import { useEffect, useState } from "react";

import UserDashboardComponent from "@/components/UserDashboardComponent/page";
import BusinessDashboardComponent from "@/components/BusinessDashboardComponent/page";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";


const Review  = () => {
  const router = useRouter();
  const [userType, setUserType] = useState(null);



  
  const handleLogout = async () => {
    
    const authJson = localStorage.getItem("auth");
    if (authJson) {
      const auth = JSON.parse(authJson);
      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/logout?token=${auth.access_token}`
        );
        localStorage.removeItem("auth");
        setIsLoggedIn(false);
        setUserType(null);
        router.push("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));

    console.log(typeof authData?.user?.user_type);
    console.log(typeof 1);

    if (authData?.user?.user_type === 2) {
      setUserType("individual");
    } else if (authData?.user?.user_type === 1) {
      setUserType("business");
    } else {
      setUserType("invalid");
    }
  }, []);

  console.log(typeof userType);

  if (userType === null) {
    // Loading state
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
  if (userType === "invalid" || userType === "individual") {
    toast.error("Invalid user! Please Login Again ");
  handleLogout();
    return <div>Invalid User Type</div>;
  }
  return userType === "individual" ? (
    <></>
  ) : (
    <BusinessDashboardComponent />
  );
};

export default Review;
