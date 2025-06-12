import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  showAvatar?: boolean;
}

export function LoadingSkeleton({
  className,
  lines = 3,
  showAvatar = false,
}: LoadingSkeletonProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="flex items-start space-x-4">
        {showAvatar && (
          <div className="w-10 h-10 bg-gray-200 rounded-full dark:bg-gray-700" />
        )}
        <div className="flex-1 space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-4 bg-gray-200 rounded dark:bg-gray-700",
                i === lines - 1 ? "w-3/4" : "w-full",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4 animate-pulse">
          <div className="w-12 h-12 bg-gray-200 rounded dark:bg-gray-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded dark:bg-gray-700" />
            <div className="h-3 bg-gray-200 rounded w-3/4 dark:bg-gray-700" />
          </div>
          <div className="w-20 h-8 bg-gray-200 rounded dark:bg-gray-700" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 border rounded-lg animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-1/3 dark:bg-gray-700" />
        <div className="w-8 h-8 bg-gray-200 rounded dark:bg-gray-700" />
      </div>
      <div className="space-y-3">
        <div className="h-8 bg-gray-200 rounded w-1/2 dark:bg-gray-700" />
        <div className="h-4 bg-gray-200 rounded w-2/3 dark:bg-gray-700" />
      </div>
    </div>
  );
}
