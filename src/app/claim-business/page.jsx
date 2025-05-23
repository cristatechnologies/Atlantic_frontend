import UpdateBusinessPage from "@/components/claim-business/page";
import { Suspense } from "react";
const ClaimBusiness = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <UpdateBusinessPage />{" "}
      </Suspense>
    </>
  );
};

export default ClaimBusiness;
