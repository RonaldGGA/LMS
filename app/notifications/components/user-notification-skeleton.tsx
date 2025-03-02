import { Skeleton } from "@/components/ui/skeleton";

export const UserNotificationSkeleton = () => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm w-full max-w-3xl relative">
      {/* Unread Indicator Skeleton */}
      <Skeleton className="absolute left-0 top-1/2 h-4/5 w-1 -translate-y-1/2 rounded-l-lg" />

      <div className="flex items-start gap-3">
        {/* Icon Skeleton */}
        <Skeleton className="h-8 w-8 rounded-full" />

        {/* Content Skeleton */}
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Action Button Skeleton */}
        <div className="hidden md:flex gap-2 pl-4">
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
};
