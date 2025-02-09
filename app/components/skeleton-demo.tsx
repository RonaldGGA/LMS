import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDemo() {
  return (
    <div className="flex flex-col space-y-4 bg-white rounded-md">
      {/* Title */}
      <Skeleton className="h-4 w-[100px]" />

      {/* Content with image and sentences */}
      <div className="flex items-center space-x-4">
        {/* Image on the left */}
        <Skeleton className="h-48 w-48 rounded-lg" />{" "}
        {/* Adjust dimensions as needed */}
        {/* Sentences on the right */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[180px]" />
        </div>
      </div>

      {/* Button at the bottom */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
}
