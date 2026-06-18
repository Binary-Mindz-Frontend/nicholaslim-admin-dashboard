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
    // Hard reload to "/" to reset any corrupted global states (e.g., Redux, local cache)
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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4 font-sans select-none relative overflow-hidden">
      {/* Decorative background glow elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main glassmorphism card */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative z-10 text-center transition-all duration-300">
        
        {/* Glow Warning Icon */}
        <div className="inline-flex items-center justify-center p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl mb-6 shadow-[0_0_30px_rgba(244,63,94,0.15)] animate-pulse">
          <AlertTriangle className="h-12 w-12 text-rose-500" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 bg-clip-text text-transparent mb-3">
          Something went wrong
        </h1>
        
        {/* Description */}
        <p className="text-slate-400 text-base max-w-md mx-auto mb-6">
          The application encountered an unexpected runtime error. We apologize for the inconvenience.
        </p>

        {/* Error message block */}
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4 mb-8 text-left select-text max-h-48 overflow-y-auto">
          <div className="text-xs text-rose-400/80 font-semibold uppercase tracking-wider mb-1 font-mono">
            {errorStatus ? `Error Status: ${errorStatus}` : "Error Message"}
          </div>
          <div className="text-sm font-medium text-slate-300 break-words font-mono">
            {errorMessage}
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 rounded-xl text-sm font-semibold transition-all cursor-pointer text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
          
          <button
            onClick={handleReload}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl text-sm font-semibold transition-all cursor-pointer text-slate-100"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Page
          </button>
          
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 border border-blue-500 rounded-xl text-sm font-semibold transition-all cursor-pointer text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </button>
        </div>

        {/* Accordion for developer details */}
        {(errorStack || errorMessage) && (
          <div className="border-t border-slate-800/80 pt-6 text-left">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
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
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer bg-slate-800/40 hover:bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/40"
                  title="Copy error details to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-400">Copied!</span>
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
                <pre className="max-h-60 overflow-y-auto text-xs font-mono text-rose-300/90 bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 text-left select-text whitespace-pre-wrap break-all shadow-inner">
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
