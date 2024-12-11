// app/active-offers/[slug]/page.jsx
import { redirect } from "next/navigation";
import AcitveDealsComponent from "@/components/ActiveDealsComponent/page";

async function fetchDailyOffersBySlug(slug) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/user/daily-offers`;

   const res = await fetch(url, {
     next: { revalidate: 3600 },
     cache: "no-store",
   });

  if (!res.ok) {
    throw new Error("Failed to fetch business");
  }

  return res.json();
}

export async function generateMetadata({ params }) {
  const dailyOffers = await fetchDailyOffersBySlug();
  const selectedOffer = dailyOffers.find((offer) => offer.slug === params.slug);

  if (!selectedOffer) {
    return {
      title: "Active Deal Not Found",
      description: "The requested active deal could not be found",
    };
  }

  return {
    title: selectedOffer.title,
    description: selectedOffer.description,
    openGraph: {
      title: selectedOffer.title,
      description: selectedOffer.description,
      images: [
        {
          url: selectedOffer.image
            ? `${process.env.NEXT_PUBLIC_BASE_URL}${selectedOffer.image}`
            : "/default-og-image.png",
          width: 1200,
          height: 630,
          alt: selectedOffer.title,
        },
      ],
      type: "website",
    },
  };
}

export default async function ActiveDealsPage({ params }) {
  const { slug } = params;

  const dailyOffers = await fetchDailyOffersBySlug();
  const selectedOffer = dailyOffers.find((offer) => offer.slug === slug);

  if (!selectedOffer) {
    console.log(selectedOffer);
    redirect("/404");
  }

  return <AcitveDealsComponent pathName={`/active-offers/${slug}`} />;
}
