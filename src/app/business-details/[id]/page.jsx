import { notFound } from "next/navigation";
import ServiceDetails from "@/components/serviceDetails/page";

async function getBusinessData(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/business/${id}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch business");
  }

  return res.json();
}

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/business`);
  const businesses = await res.json();

  return businesses.map((business) => ({
    id: business.id.toString(),
  }));
}

export default async function BusinessDetails({ params }) {
  const { id } = params;

  try {
    const data = await getBusinessData(id);

    if (!data) {
      notFound();
    }

    return <ServiceDetails data={data} />;
  } catch (error) {
    console.error("Error fetching business:", error);
    notFound();
  }
}
