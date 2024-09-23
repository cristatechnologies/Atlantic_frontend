"use client";
import React from "react";
import { usePathname } from "next/navigation";
import CustomSlugComponent from "@/components/common/CustomSlugComponent/page";

const CommonSlug = () => {
  const pathName = usePathname();
  return (
    <>
      <CustomSlugComponent pathName={pathName} />
    </>
  );
};

export default CommonSlug;
