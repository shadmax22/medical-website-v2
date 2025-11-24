import { Typography } from "@material-tailwind/react";

interface LoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export function Loader({
  message = "Loading...",
  size = "md",
  fullScreen = false,
}: LoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        {/* Animated Pulse Loader */}
        <div className="relative">
          {/* Outer ring */}
          <div
            className={`${sizeClasses[size]} rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin`}
          />

          {/* Inner pulse */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
              size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8"
            } rounded-full bg-blue-500 animate-pulse`}
          />
        </div>

        {/* Loading Message */}
        {message && (
          <Typography
            variant={size === "sm" ? "small" : "paragraph"}
            className="text-blue-gray-600 font-medium animate-pulse"
          >
            {message}
          </Typography>
        )}
      </div>
    </div>
  );
}

// Alternative Medical-themed loader with heartbeat animation
export function MedicalLoader({
  message = "Loading...",
  size = "md",
  fullScreen = false,
}: LoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        {/* Medical Cross with Pulse */}
        <div className="relative">
          <svg
            className={`${sizeClasses[size]} text-blue-500 animate-pulse`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" />
          </svg>

          {/* Animated rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`${sizeClasses[size]} rounded-full border-2 border-blue-300 animate-ping opacity-75`}
            />
          </div>
        </div>

        {/* Loading Message */}
        {message && (
          <Typography
            variant={size === "sm" ? "small" : "paragraph"}
            className="text-blue-gray-600 font-medium"
          >
            {message}
          </Typography>
        )}
      </div>
    </div>
  );
}

// Skeleton loader for content
export function SkeletonLoader({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-4 py-6">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-blue-gray-100 rounded w-3/4" />
          <div className="h-4 bg-blue-gray-100 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
