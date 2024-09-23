import React from "react";

import Link from "next/link";

const FourZeroFourPage = () => {
  return (
    <>
      <div className="content mt-lg-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mx-auto">
              <div className="error-wrap">
                <div className="error-logo">
                  {/* <Link href="/">
                    <img className="img-fluid" src={"Sdf"} alt="img" />
                  </Link> */}
                </div>
                <h2>Something went wrong</h2>
                <div className="error-img">
                  <img
                    className="img-fluid"
                    src={"/img/404-error.jpg"}
                    alt="img"
                  />
                </div>
                <Link href="/" className="btn btn-primary rounded-pill">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default FourZeroFourPage;
