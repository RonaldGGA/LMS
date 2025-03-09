import { SparklesIcon } from "lucide-react";
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
      className={`hidden bg-antique-white p-6 rounded-xl border border-antique-gold/20 shadow-library-inner ${className}`}
    >
      <h3 className="font-serif text-xl text-library-dark mb-4 flex items-center">
        <SparklesIcon className="h-6 w-6 mr-2 text-antique-gold" />
        Próximas Actualizaciones
      </h3>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
};

export default NextImprovements;
