import { Binoculars } from "lucide-react";

const ParcelCardSkeleton = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="h-8 bg-gray-500 rounded w-1/2 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-500 rounded w-1/3"></div>
        <div className="h-4 bg-gray-500 rounded w-2/3"></div>
        <div className="h-4 bg-gray-500 rounded w-full"></div>
        <div className="h-4 bg-gray-500 rounded w-3/4"></div>
        <div className="h-4 bg-gray-500 rounded w-2/3"></div>
        <div className="h-4 bg-gray-500 rounded w-1/2"></div>
      </div>
    </div>
  );
};

// Container for multiple skeleton cards.
// You can adjust the number of skeleton cards by changing the array length.
export function ParcelSearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index}>
          <ParcelCardSkeleton />
        </div>
      ))}
    </div>
  );
}

export function BinocularsSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <Binoculars className="w-16 h-16 text-gray-400 mx-auto animate-pulse" />
      <p className="text-center">Searching for parcels...</p>
    </div>
  );
}
