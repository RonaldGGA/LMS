import { Skeleton } from "@/components/ui/skeleton";

const BookSkeleton = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Image Section Skeleton */}
          <div className="relative aspect-[5/4] lg:aspect-[4/5]">
            <Skeleton className="h-full w-full rounded-xl bg-gray-200" />
          </div>

          {/* Content Section Skeleton */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4 border-b border-gray-100 pb-6">
              <Skeleton className="h-8 w-3/4 bg-gray-200" />
              <Skeleton className="h-6 w-1/2 bg-gray-200" />
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-5 w-5 rounded-full bg-gray-200"
                  />
                ))}
                <Skeleton className="h-5 w-12 bg-gray-200" />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-6 w-20 rounded-full bg-gray-200"
                />
              ))}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-gray-200" />
              <Skeleton className="h-4 w-4/5 bg-gray-200" />
              <Skeleton className="h-4 w-3/4 bg-gray-200" />
              <Skeleton className="h-4 w-5/6 bg-gray-200" />
            </div>

            {/* Price & Stock */}
            <div className="space-y-4 bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-24 bg-gray-300" />
                <Skeleton className="h-8 w-32 bg-gray-300" />
              </div>
            </div>

            {/* Status & Actions */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/2 bg-gray-200" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full bg-gray-200" />
                <Skeleton className="h-10 w-full bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default BookSkeleton;
