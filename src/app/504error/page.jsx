import React from "react";
import Link from "next/link";
import { LogoSvg, error504 } from "../../imagepath";




const Error504 = () => {
    return (
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mx-auto">
              <div className="error-wrap unexpecterror">
                <div className="error-logo">
                  <Link href ="/index">
                    <img className="img-fluid" src="./img/logo.svg" alt="img" />
                  </Link>
                </div>
                <h2>Sorry unexpected Error</h2>
                <div className="error-img ">
                  <img className="img-fluid" src={error504} alt="img" />
                </div>
                <Link href ="/index" className="btn btn-primary rounded-pill">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
export default Error504;