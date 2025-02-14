"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.access_token;

    if (token) {
      if (auth?.user?.user_type !== 2) {
        console.log(auth?.user?.user_type);
        router.push("/login");
        toast.error("User Type not Valid");
      } else {
        axios
          .get(
            `${process.env.NEXT_PUBLIC_BASE_URL}api/user/push-notifications?token=${token}`
          )
          .then((res) => {
            setNotifications(res.data.push_notifications);
          })
          .catch((err) => {
            console.error(err);
            toast.error("Failed to fetch notifications");
          });
      }
    }
  }, [router]);

  // Helper function to calculate how many days ago a notification was sent
  const calculateDaysAgo = (date) => {
    const notificationDate = new Date(date);
    const currentDate = new Date();
    const timeDifference = currentDate - notificationDate;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="container mt-5" style={{paddingTop:"170px",paddingBottom:"90px"}}>
      <h3 className="mb-4">Notifications</h3>
      <div className="row">
        {notifications.map((notification) => (
          <div className="col-md-4 mb-4" key={notification.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{notification.title}</h5>
                <p className="card-text">{notification.body}</p>
                <p className="text-muted">
                  Sent {calculateDaysAgo(notification.created_at)} days ago
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationComponent;
