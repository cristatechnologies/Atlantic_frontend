"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomSlugComponent from "@/components/common/CustomSlugComponent/page";
import axios from "axios";

const CommonSlug = () => {
  
  return (
    <CustomSlugComponent
      pathName={window.location.pathname}
      data={slugData}
      metaDetails={metaDetails}
      loading={loading}
      error={error}
    />
  );
};

export default CommonSlug;
