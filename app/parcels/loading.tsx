import { House } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <House className="w-12 h-12 text-gray-400 mx-auto animate-pulse" />
      <p className="text-center">Loading parcels</p>
    </div>
  );
}
