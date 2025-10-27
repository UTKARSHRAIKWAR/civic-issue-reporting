import React, { useState, useEffect } from "react";
import { UploadCloud } from "lucide-react";

const UploadSection = ({ onFileSelect }) => {
  const [preview, setPreview] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if the user is on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  // Handle image selection or capture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file); // Send file to parent
      setPreview(URL.createObjectURL(file)); // Preview image
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl p-6 bg-gray-50 dark:bg-slate-800/40 transition">
      {/* Icon */}
      <div className="text-blue-600 dark:text-blue-400">
        <UploadCloud size={42} />
      </div>

      {/* Instructions */}
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 text-center">
        <span className="font-semibold text-primary cursor-pointer">
          Click to upload
        </span>{" "}
        or drag and drop an image
      </p>

      {/* Upload Input */}
      <input
        id="uploadInput"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <label
        htmlFor="uploadInput"
        className="mt-3 text-sm bg-primary text-white px-4 py-2 rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
      >
        📂 Upload from Gallery
      </label>

      {/* Mobile Camera Capture */}
      {isMobile && (
        <>
          <button
            type="button"
            onClick={() => document.getElementById("cameraInput").click()}
            className="mt-2 text-sm bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            📸 Click a Photo
          </button>

          <input
            id="cameraInput"
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}

      {/* Preview */}
      {preview && (
        <div className="mt-5 w-full max-w-xs">
          <img
            src={preview}
            alt="Preview"
            className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default UploadSection;
