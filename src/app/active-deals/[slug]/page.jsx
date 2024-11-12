'use client'

import { usePathname } from "next/navigation";
import AcitveDealsComponent from "@/components/ActiveDealsComponent/page";
const ActiveDealsDesc = () => {
  const pathName = usePathname();
  console.log("pathname is ", pathName);
  return (
    <AcitveDealsComponent pathName={pathName} />
  );
};

export default ActiveDealsDesc;
