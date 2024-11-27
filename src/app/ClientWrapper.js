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


           const themeColor = JSON.parse(localStorage.getItem("settings"));
           if (themeColor) {
            
             const root = document.querySelector(":root");
             root.style.setProperty(
               "--primary-color",
               `${themeColor?.primary_color}`
             );
             root.style.setProperty(
               "--secondary-color",
               `${themeColor?.secondary_color}`
             );
             root.style.setProperty(
               "--primary-text-color",
               `${themeColor?.primary_text_color}`
             );
             root.style.setProperty(
               "--secondary-text-color",
               `${themeColor?.secondary_text_color}`
             );
            //  root.style.setProperty(
            //    "--footer-color",
            //    `${themeColor?.footer_color}`
            //  );
            //  root.style.setProperty(
            //    "--footer-text-color",
            //    `${themeColor?.footer_text_color}`
            //  );
            
           }
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
