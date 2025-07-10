const { Suspense } = require("react");
import BusinessSignupComponent from "@/components/signupComponent/BusinessSignupcomponent/page";
const BusinessSignup = () =>{
  return (
    <Suspense>
      <BusinessSignupComponent />
    </Suspense>
  );
}


export default BusinessSignup;