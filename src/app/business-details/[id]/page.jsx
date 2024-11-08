"use client";

import { notFound } from "next/navigation";
import ServiceDetails from "@/components/serviceDetails/page";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

async function getBusinessData(id, token = null) {
  const url = token
    ? `${process.env.NEXT_PUBLIC_BASE_URL}api/business/${id}?token=${token}`
    : `${process.env.NEXT_PUBLIC_BASE_URL}api/business/${id}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch business");
  }

  return res.json();
}

export default function BusinessDetails() {
  const params = useParams();
  const id = params?.id;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem("auth") || "null");
        const token = auth?.access_token;

        const businessData = await getBusinessData(id, token);

        if (!businessData) {
          notFound();
        }

        setData(businessData);
      } catch (error) {
        console.error("Error fetching business:", error);
        setError(error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (error) {
    return notFound();
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return <ServiceDetails data={data} />;
}
