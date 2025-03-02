import React from "react";

const NextImprovements = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-5 shadow rounded-md bg-blue-200 w-[500px] mx-auto max-w-[95%]">
      <p className="font-bold">NEXT IMPROVEMENTS:</p>
      {children}
    </div>
  );
};

export default NextImprovements;
