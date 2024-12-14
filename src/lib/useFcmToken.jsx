"use client";
import { useEffect, useState } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import firebaseApp from "./authHook/firebase";

const useFcmToken = () => {
  const [token, setToken] = useState("");
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState("");

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        // Ensure we're in a browser environment
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
          // Register service worker before getting token
          const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          );

          const messaging = getMessaging(firebaseApp);

          // Request notification permission
          const permission = await Notification.requestPermission();
          setNotificationPermissionStatus(permission);

          if (permission === "granted") {
            const currentToken = await getToken(messaging, {
              vapidKey:
                "BCQiRRU7l84qS58EC2Jtg-2zgclQr4-86aQAomlCP49O3XLVEKX2ho89yDkqNpip-rz3wfIhJao8wM-9Fpfq6Zs",
              serviceWorkerRegistration: registration,
            });

            if (currentToken) {
              setToken(currentToken);
              console.log("Token generated successfully", currentToken);
               localStorage.setItem("fcmToken", currentToken);
            } else {
              console.log("No registration token available.");
            }
          }
        }
      } catch (error) {
        console.error("Error in token retrieval process:", error);
      }
    };

    retrieveToken();
  }, []);

  return { token, notificationPermissionStatus };
};

export default useFcmToken;
