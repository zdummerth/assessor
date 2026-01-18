export function TableSkeleton() {
  return (
    <div className="mt-6 space-y-4 animate-pulse">
      {/* Summary skeleton */}
      <div className="flex gap-2">
        <div className="h-6 w-20 bg-gray-200 rounded" />
        <div className="h-6 w-32 bg-gray-200 rounded" />
      </div>

      {/* Result cards skeleton */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3">
          {/* Header */}
          <div className="flex justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-6 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-3 w-1/4 bg-gray-200 rounded" />
            </div>
            <div className="h-6 w-16 bg-gray-200 rounded" />
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200" />

          {/* Values grid */}
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="bg-gray-100 p-3 rounded space-y-2">
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-6 w-20 bg-gray-200 rounded ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
