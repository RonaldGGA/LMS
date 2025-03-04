import React from "react";
import NextImprovements from "../components/next-improvements";
import Link from "next/link";

const ErrorPage = () => {
  const next = [
    "Pass the error in params and handle each one independently",
    "Make this prettier and user friendly",
  ];
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

      <NextImprovements>
        <ul className="space-y-2">
          {next.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </NextImprovements>
    </div>
  );
};

export default ErrorPage;
