import AddListingComponent from "@/components/AddLisitingComponent/page";
import PageHead from "@/components/helper/PageHead/page";
const addListing = () => {
  return (
    <>
      <PageHead title="Add Lising" metaDes="Add Listing" />
      <AddListingComponent />
    </>
  );
};

export default addListing;
