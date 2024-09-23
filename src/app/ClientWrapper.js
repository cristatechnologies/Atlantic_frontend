"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setupAction } from "@/store/websiteSetup";
export default function ClientWrapper({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(`${process.env.NEXT_PUBLIC_BASE_URL}api/website-setup`)
    const apiFetch = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}api/website-setup`)
        .then((res) => {
          // handle success
          dispatch(setupAction(res.data));
          localStorage.setItem("settings", JSON.stringify(res.data?.setting));
          localStorage.setItem("language", JSON.stringify(res.data?.language));
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });

     
    };

    apiFetch();
  }, [dispatch]);

  return <>{children}</>;
}
