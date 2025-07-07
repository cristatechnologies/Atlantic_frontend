const { Suspense } = require("react");
import businessSignupComponent from "@/components/signupComponent/businessSignupcomponent/page";
const BusinessSignup = () =>{
  return (
    <Suspense >
      <businessSignupComponent />
    </Suspense>
  )
}


export default BusinessSignup;