import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDemo() {
  return (
    <div className="relative group bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 transition-all">
      <div className="overflow-hidden">
        {/* Promo Badge Skeleton */}
        <div className="absolute top-3 right-3 z-10">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        {/* Image Section */}
        <div className="relative aspect-[6/4] bg-gray-100">
          <Skeleton className="h-full w-full rounded-none" />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/40">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Rating & Categories */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-4 rounded-full" />
              ))}
              <Skeleton className="h-4 w-8 ml-1" />
            </div>

            <div className="flex flex-wrap gap-2">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-md" />
              ))}
            </div>
          </div>

          {/* Action Button Skeleton */}
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
