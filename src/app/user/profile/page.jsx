"use client";
import { useEffect, useState } from "react";
import ProfileComponent from "@/components/ProfileComponent/page";
import BusinessProfileComponent from "@/components/BusinessProfileComponent/page";

const Profile = () => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));

    if (authData?.user?.user_type === 2) {
      setUserType(2);
    } else if (authData?.user?.user_type === 1) {
      setUserType(1);
    } else {
      // Handle cases where user_type is missing or invalid
      setUserType("invalid");
    }
  }, []);
  console.log("usertypoe is ", userType);

  // if (userType === null) {
  //   // Loading state
  //   console.log("user tyope is ", userType);
  //   return <div className="mt-lg-5 pt-5">Loading...</div>;
  // }

  if (userType === "invalid") {
    {console.log("invalid user")}
    // Handle invalid case (e.g., redirect or error message)
    return <div>Invalid User Type</div>;
  }

  return (
    <>
      {userType === 2 ? (
      
        <ProfileComponent /> 
        // Show ProfileComponent for user_type 2
      ) : (
        <>
          <BusinessProfileComponent />
        </> // Show BusinessProfileComponent for user_type 1
      )}
    </>
  );
};

export default Profile;
