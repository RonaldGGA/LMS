import React from "react";

const NextImprovements = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`p-5 shadow-md rounded-md bg-blue-200 w-[500px] mx-auto max-w-[95%] shadow-gray-400 ${className}`}
    >
      <p className="font-bold">NEXT IMPROVEMENTS:</p>
      {children}
    </div>
  );
};

export default NextImprovements;
