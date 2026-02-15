import React from "react";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <div>
      <p className="text-3xl bg-gray-200 p-5 rounded-md text-center mt-10">
        Ups, an error ocurred
      </p>
      <Link
        className="text-center text-blue-500 underline underline-offset-4"
        href={"/"}
      >
        Keep looking books
      </Link>
    </div>
  );
};

export default ErrorPage;
