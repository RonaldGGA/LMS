"use client";

import { Separator } from "@/components/ui/separator";
import { Clock2, Info, X } from "lucide-react";
import React, { useState } from "react";

interface IssuedBooksSpanProps {
  length: number | undefined;
}

const IssuedBooksSpan: React.FC<IssuedBooksSpanProps> = ({ length }) => {
  const [hide, setHide] = useState(false);
  if (hide) {
    return null;
  }
  return (
    <div className=" hidden md:block fixed bottom-10 right-2 p-4 space-y-2 border border-gray-300 backdrop-blur-sm bg-gray-900 text-gray-200  shadow-lg rounded-md ">
      <X
        onClick={() => setHide(true)}
        width={15}
        height={15}
        className="absolute top-3 right-3 hover:text-white cursor-pointer scale-105"
      />

      <span className="text-sm flex gap-1 items-center justify-center text-gray-200 hover:text-blue-500 cursor-pointer transition-colors">
        <Info width={18} className="text-blue-500" />
        <span>More</span>
      </span>
      <Separator />
      <div className="text-gray-100">
        Issued Books:
        <span className="ml-1 font-semibold ">{length}</span>
      </div>
      <span className="flex text-sm justify-center items-center gap-1  ">
        <Clock2 width={17} />
        <span>10:20:30</span>
      </span>
    </div>
  );
};

export default IssuedBooksSpan;
