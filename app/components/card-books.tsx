import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card className="bg-gray-100 border shadow-md mx-auto max-w-[500px] mt-10">
      <CardHeader className="flex items-center justify-center">
        <CardTitle className="text-3xl">
          {type == "add" ? "Add a New Book" : "Return a book"}
        </CardTitle>
      </CardHeader>
      <CardContent className="max-w-[600px] mx-auto">{children}</CardContent>
      <CardFooter className="flex items-center justify-center text-red-600">
        {footerText}
      </CardFooter>
    </Card>
  );
};

export default CardBooks;
