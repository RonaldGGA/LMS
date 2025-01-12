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

interface CardBooksProps {
  type: string;
  children: React.ReactNode;
  footerText: string;
}

const CardBooks: React.FC<CardBooksProps> = ({
  type,
  children,
  footerText,
}) => {
  return (
    <Card className=" border-none bg-transparent">
      <CardHeader className="flex items-center justify-center">
        <CardTitle className="text-3xl">
          {type == "add" ? "Add a New Book" : "Return a book"}
        </CardTitle>
      </CardHeader>
      <CardContent className="max-w-[600px] mx-auto">{children}</CardContent>
      <CardFooter className="flex items-center justify-center">
        {footerText}
      </CardFooter>
    </Card>
  );
};

export default CardBooks;
