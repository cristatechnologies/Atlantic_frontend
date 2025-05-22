'use client'

import LoginComponent from "@/components/LoginComponent/page";
import { useState } from "react";
import { Suspense } from "react";
const Login = () => {

  return (<Suspense>
  <LoginComponent />
  </Suspense>
  );
};

export default Login;
