"use client";

import Head from "next/head";
import HomePage from "@/components/HomePage/page";
import PageHead from "@/components/helper/PageHead/page";

export default function Home() {
  return (
    <>
      <Head>
        <meta
          name="google-site-verification"
          content="6PMtHZQCYmr6ZqDTumqj-lyyjJ2B_mHrk14TnvfOfKU"
        />
      </Head>
      <PageHead title="Active Deals" metaDes="Active Deals" />
      <HomePage />
    </>
  );
}
