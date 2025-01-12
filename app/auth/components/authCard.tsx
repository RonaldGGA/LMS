import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

import React from "react";

interface AuthCardProps {
  type: string;
  children: React.ReactNode;
  footerLink: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ type, children, footerLink }) => {
  return (
    <Card className=" border-none text-gray-100 bg-transparent">
      <CardHeader className="flex text-gray-100 items-center justify-center">
        <CardDescription className="text-xl text-gray-200">
          Library Management System
        </CardDescription>
        <CardTitle className="text-3xl">{type.toUpperCase()}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex items-center justify-center">
        <p>
          {type === "login" ? (
            <>
              If you don’t have an account,{" "}
              <Link href={footerLink} className="  underline">
                Register
              </Link>{" "}
              first.
            </>
          ) : (
            <>
              If you already have an account,{" "}
              <Link href={footerLink} className="  underline">
                Login
              </Link>{" "}
              instead.
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthCard;
