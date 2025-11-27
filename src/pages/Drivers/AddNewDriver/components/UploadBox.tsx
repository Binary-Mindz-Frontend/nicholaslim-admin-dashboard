"use client";

import { Camera } from "lucide-react";
import { useState } from "react";

export default function UploadBox({
  label,
  onChange,
}: {
  label: string;
  onChange: (file: File | null) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }

    onChange(file);
  }

  return (
    <label className="border-2 border-green-500 border-dashed rounded-xl p-6 w-full flex flex-col items-center justify-center text-center cursor-pointer hover:bg-green-50 transition min-h-[180px] relative overflow-hidden">

      {/* SHOW IMAGE PREVIEW */}
      {preview ? (
        <img
          src={preview}
          alt="preview"
          className="absolute inset-0 w-full h-full object-cover rounded-xl"
        />
      ) : (
        <>
          <p className="text-sm text-gray-700 mb-2">{label}</p>

          <span className="flex items-center gap-0.5 justify-center border border-green rounded-md px-1">
            <Camera className="text-green-600" size={22} />
            <span className="text-xs sm:text-sm">Upload Photo</span>
          </span>
        </>
      )}

      <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
    </label>
  );
}
