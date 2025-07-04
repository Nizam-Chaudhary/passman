export default function Loading() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      <p className="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  );
}
