export default function NotFound404() {
  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center px-4">
      {/* 404 Number */}
      <h1 className="text-9xl font-extrabold text-yellow-400 tracking-tight">
        404
      </h1>

      {/* Divider */}
      <div className="w-16 h-1 bg-yellow-400 rounded-full my-6" />

      {/* Message */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-500 text-center max-w-sm mb-8">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      {/* Buttons */}
      <div className="flex gap-3">
        <a
          href="/login"
          className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg transition-colors cursor-pointer"
        >
          Login
        </a>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2.5 border border-yellow-400 text-yellow-500 hover:bg-yellow-50 font-semibold rounded-lg transition-colors cursor-pointer"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
