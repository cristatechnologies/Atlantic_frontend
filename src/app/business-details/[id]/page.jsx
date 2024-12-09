// page.js
import { notFound } from "next/navigation";
import ServiceDetails from "@/components/serviceDetails/page";

async function getBusinessData(id, token = null) {
  const url = token
    ? `${process.env.NEXT_PUBLIC_BASE_URL}api/business/${id}?token=${token}`
    : `${process.env.NEXT_PUBLIC_BASE_URL}api/business/${id}`;

  const res = await fetch(url, { 
    next: { revalidate: 3600 },
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error("Failed to fetch business");
  }

  return res.json();
}

export async function generateMetadata({ params }) {
  try {
    const businessData = await getBusinessData(params.id);
console.log(businessData)
    return {
      title: businessData.name,
      description: businessData.description,
      openGraph: {
        type: "website",
        title: businessData.name,
        description: businessData.description,
        images: `https://s1.shopico.in/atlantic/${businessData.image}`
          ? [
              {
                url: `https://s1.shopico.in/atlantic/${businessData.image}`,
                width: 800,
                height: 600,
              },
              {
                url: `https://s1.shopico.in/atlantic/${businessData.image}`,
                width: 1200,
                height: 630,
              },
            ]
          : [],
      },
    };
  } catch (error) {
    return {
      title: "Business Not Found",
      description: "Unable to retrieve business details"
    };
  }
}

export default async function BusinessDetails({ params }) {
  try {
    const businessData = await getBusinessData(params.id);

    if (!businessData) {
      return notFound();
    }

    return (
      <ServiceDetails 
        data={businessData} 

      />
    );
  } catch (error) {
    return notFound();
  }
}

// loading.js
export function Loading() {
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

// error.js
