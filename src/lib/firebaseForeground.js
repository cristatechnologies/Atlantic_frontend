"use client";

import firebaseApp from "@/lib/authHook/firebase";
import useFcmToken from "./useFcmToken";
import { getMessaging, onMessage } from "firebase/messaging";
import { useEffect } from "react";
import { useSelector } from "react-redux";
export default function FcmTokenComp() {
  const { fcmToken, notificationPermissionStatus } = useFcmToken();
  const websiteData = useSelector((state) => state.websiteSetup.data);
  
  
  
  
  
  
  
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      if (notificationPermissionStatus === "granted") {
        const messaging = getMessaging(firebaseApp);

        // Listen for foreground messages
        const unsubscribe = onMessage(messaging, (payload) => {
          console.log("Foreground push notification received:", payload);

          const { title, body, icon, image, ...data } =
            payload.notification || payload.data;

          // Display the notification using the Notification API
          if (Notification.permission === "granted") {
            new Notification(title, {
              body,
              icon:  image || '/icons/firebase-logo.png', // Fallback icon
              data, // Additional data for potential interaction
            });
          } else {
            console.warn("Notifications are not permitted in this browser.");
          }
        });

        return () => {
          unsubscribe(); // Unsubscribe from the onMessage event on cleanup
        };
      }
    }
  }, [notificationPermissionStatus]);

  return null; // This component is primarily for handling foreground notifications
}
