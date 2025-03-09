"use client";

import { useEffect, useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? 95 : prev + 5));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-6">
      {/* Book flipping animation */}
      <div className="relative w-24 h-24 perspective-1000">
        <div className="absolute w-full h-full preserve-3d animate-book-flip">
          <div className="absolute w-full h-full bg-golden-amber rounded-lg backface-hidden flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
          <div className="absolute w-full h-full bg-library-midfrom-library-midnight rounded-lg backface-hidden rotate-y-180 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-library-midnight to-golden-amber transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Text animation */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-lg font-medium text-foreground animate-pulse">
          Loading your next read...
        </p>
        <span className="text-sm text-muted-foreground">
          {progress}% completed
        </span>
      </div>
    </div>
  );
};

export default LoadingPage;
