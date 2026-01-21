import LoginComponent from "@/components/login";
import { Metadata } from "next";
import React from "react";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Login | Cubing Kerala",
  description: "Login to Cubing Kerala",
};

const Login = () => {
  return <LoginComponent />;
};

export default Login;
