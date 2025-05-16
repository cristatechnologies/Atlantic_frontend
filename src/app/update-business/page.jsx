import UpdateBusinessPage from "@/components/update-business/page";
import { Suspense } from "react";
const UpdateBusiness = () => {
  return (
    <>
      <Suspense>
        <UpdateBusinessPage />{" "}
      </Suspense>
    </>
  );
};

export default UpdateBusiness;
