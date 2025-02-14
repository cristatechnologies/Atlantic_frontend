"use client";
import { useEffect, useState } from "react";
import ProfileComponent from "@/components/ProfileComponent/page";
import BusinessProfileComponent from "@/components/BusinessProfileComponent/page";

const Profile = () => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));

console.log(typeof(authData?.user?.user_type )) 
console.log(typeof(1)); 


    if (authData?.user?.user_type === 2) {
      setUserType("individual");
    } else if (authData?.user?.user_type === 1) {
      setUserType("business");
    } else {
    
      setUserType("invalid");
    }
  }, []);


  console.log(typeof (userType));

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
  if (userType === "invalid") {
    return <div style={{marginTop:"50vh",marginBottom:"50vh", textAlign:"center", fontWeight:"800",fontSize:"25px"}}>Invalid User Type</div>;
  }
  return userType === "individual" ? (
    <ProfileComponent />
  ) : (
    <BusinessProfileComponent />
  );
};

export default Profile;
