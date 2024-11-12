"use client";
import { useEffect, useState } from "react";

import UserDashboardComponent from "@/components/UserDashboardComponent/page";
import BusinessDashboardComponent from "@/components/BusinessDashboardComponent/page";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
const Dashboard = () => {
  const router = useRouter();
  const [userType, setUserType] = useState(null);

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
    return <div className="mt-lg-5 pt-5">Loading...</div>;
  }
  if (userType === "invalid") {
    toast.error("Invalid user! Please Login Again ");
    router.push("/login");
    return <div>Invalid User Type</div>;
  }
  return userType === "individual" ? (
    <UserDashboardComponent />
  ) : (
    <BusinessDashboardComponent />
  );
};

export default Dashboard;
