import React, { useState } from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { AlertTriangle, RefreshCw, Home, ArrowLeft, ChevronDown, ChevronRight, Copy, Check } from "lucide-react";

const GlobalErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  // Extract error details safely
  let errorMessage = "An unexpected error occurred.";
  let errorStack = "";
  let errorStatus = "";

  if (isRouteErrorResponse(error)) {
    errorStatus = `${error.status} ${error.statusText}`;
    errorMessage = error.data?.message || error.statusText || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorStack = error.stack || "";
  } else if (typeof error === "string") {
    errorMessage = error;
  } else if (error && typeof error === "object") {
    errorMessage = (error as any).message || JSON.stringify(error);
    errorStack = (error as any).stack || "";
  }

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleCopyToClipboard = async () => {
    const textToCopy = `Error: ${errorMessage}\nStatus: ${errorStatus}\nStack Trace:\n${errorStack || "No stack trace available."}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] text-gray-800 p-4 font-sans select-none relative overflow-hidden">
      {/* Decorative background yellow/orange glow elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main card */}
      <div className="bg-white border border-[#E6EFF5] rounded-2xl p-8 max-w-2xl w-full shadow-lg relative z-10 text-center transition-all duration-300">
        
        {/* Glow Warning Icon */}
        <div className="inline-flex items-center justify-center p-4 bg-yellow-50 border border-yellow-200 rounded-2xl mb-6 shadow-sm">
          <AlertTriangle className="h-12 w-12 text-yellow-600" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-3">
          Something went wrong
        </h1>
        
        {/* Description */}
        <p className="text-gray-500 text-base max-w-md mx-auto mb-6">
          The application encountered an unexpected runtime error. We apologize for the inconvenience.
        </p>

        {/* Error message block */}
        <div className="bg-red-50/40 border border-red-100 rounded-xl p-4 mb-8 text-left select-text max-h-48 overflow-y-auto">
          <div className="text-xs text-red-600 font-semibold uppercase tracking-wider mb-1 font-mono">
            {errorStatus ? `Error Status: ${errorStatus}` : "Error Message"}
          </div>
          <div className="text-sm font-semibold text-red-700 wrap-break-word font-mono">
            {errorMessage}
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 active:bg-gray-100 rounded-xl text-sm font-semibold transition-all cursor-pointer text-gray-700 shadow-xs"
          >
            <ArrowLeft className="h-4 w-4 text-gray-500" />
            Go Back
          </button>
          
          <button
            onClick={handleReload}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 active:bg-gray-100 rounded-xl text-sm font-semibold transition-all cursor-pointer text-gray-700 shadow-xs"
          >
            <RefreshCw className="h-4 w-4 text-gray-500" />
            Reload Page
          </button>
          
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 border border-yellow-400 hover:border-yellow-500 rounded-xl text-sm font-bold transition-all cursor-pointer text-black shadow-md shadow-yellow-400/10 hover:shadow-yellow-400/20"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </button>
        </div>

        {/* Accordion for developer details */}
        {(errorStack || errorMessage) && (
          <div className="border-t border-gray-100 pt-6 text-left">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              >
                {showDetails ? (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Hide Technical Details
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4" />
                    Show Technical Details
                  </>
                )}
              </button>

              {showDetails && (
                <button
                  onClick={handleCopyToClipboard}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200"
                  title="Copy error details to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-green-600" />
                      <span className="text-green-600 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy Log</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {showDetails && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-1 duration-200">
                <pre className="max-h-60 overflow-y-auto text-xs font-mono text-gray-600 bg-gray-50 border border-gray-200 rounded-xl p-4 text-left select-text whitespace-pre-wrap break-all shadow-inner">
                  {errorStack || `Error: ${errorMessage}`}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalErrorBoundary;
