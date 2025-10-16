import React, { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { CloseIcon, UploadCloudIcon } from "../components/ui/Icons";

const FileUpload = ({ file, setFile }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const dropRef = useRef();

  // File preview effect
  useEffect(() => {
    if (!file) return setPreviewUrl(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/"))
      return toast.error("Only image files are allowed.");
    if (selectedFile.size > 5 * 1024 * 1024)
      return toast.error("File size cannot exceed 5MB.");
    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropRef.current.classList.add("border-primary", "bg-primary/10");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dropRef.current.classList.remove("border-primary", "bg-primary/10");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropRef.current.classList.remove("border-primary", "bg-primary/10");
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => handleFileSelect(e.target.files?.[0]);
  const handleRemoveFile = () => setFile(null);

  return (
    <div>
      <label className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
        Upload Photo (Optional)
      </label>
      <div
        ref={dropRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="relative border-2 border-dashed rounded-lg h-60 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 transition-colors border-slate-300 dark:border-slate-600"
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain rounded-md p-1"
            />
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600"
            >
              <CloseIcon />
            </button>
          </>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-center p-4">
            <UploadCloudIcon />
            <span className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-primary">
                Click to upload
              </span>{" "}
              or drag & drop
            </span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
