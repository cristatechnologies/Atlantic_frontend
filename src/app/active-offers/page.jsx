"use client";

import DailyDealsComponent from "@/components/DailyDealsComponent/page";
import PageHead from "@/components/helper/PageHead/page";

const ActiveDeals = () => {
  return (
    <>
      <PageHead title="Active Offers" metaDes="Active Offers" />
      <DailyDealsComponent />
    </>
  );
};

export default ActiveDeals;
