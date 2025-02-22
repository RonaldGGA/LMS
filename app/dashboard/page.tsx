"use client";
import React, { useEffect } from "react";

const DashboardPage = () => {
  useEffect(() => {
    window.history.pushState({}, "Dashboard page", "/dashboard");
  }, []);
  return (
    <div className=" text-center text-3xl text-white mx-auto mt-10 ">
      DashboardPage
    </div>
  );
};

export default DashboardPage;
