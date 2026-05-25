"use client";

import React, { useState, useRef, useCallback } from "react";
import { storageService, type UploadResult } from "@/lib/services";
import type { StorageBucket } from "@/lib/supabase/config";
import { Upload, X, CheckCircle, AlertCircle, FileAudio, FileImage, FileVideo, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  bucket: StorageBucket;
  accept?: string;
  maxSize?: number; // bytes
  label?: string;
  description?: string;
  onUploaded?: (result: UploadResult) => void;
  onError?: (error: string) => void;
  currentUrl?: string;
  className?: string;
}

type UploadState = "idle" | "selected" | "uploading" | "success" | "error";

export function FileUpload({
  bucket,
  accept,
  maxSize = 50 * 1024 * 1024,
  label,
  description,
  onUploaded,
  onError,
  currentUrl,
  className,
}: FileUploadProps) {
  const [state, setState] = useState<UploadState>(currentUrl ? "success" : "idle");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState(currentUrl || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (maxSize && selectedFile.size > maxSize) {
      const maxMB = Math.round(maxSize / (1024 * 1024));
      setError(`File too large. Maximum size is ${maxMB}MB.`);
      setState("error");
      return;
    }
    setFile(selectedFile);
    setState("selected");
    setError("");
  }, [maxSize]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  }, [handleFileSelect]);

  const handleUpload = async () => {
    if (!file) return;
    setState("uploading");
    setProgress(0);

    const result = await storageService.uploadFile(
      bucket,
      file,
      undefined,
      (p) => setProgress(p.percentage)
    );

    if (result.success && result.data) {
      setState("success");
      setUploadedUrl(result.data.url);
      onUploaded?.(result.data);
    } else {
      setState("error");
      setError(result.error || "Upload failed");
      onError?.(result.error || "Upload failed");
    }
  };

  const handleRemove = () => {
    setFile(null);
    setState("idle");
    setUploadedUrl("");
    setProgress(0);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const getFileIcon = () => {
    if (!file) return <Upload className="w-8 h-8 text-gray-400" />;
    if (file.type.startsWith("audio")) return <FileAudio className="w-8 h-8 text-blue-500" />;
    if (file.type.startsWith("image")) return <FileImage className="w-8 h-8 text-green-500" />;
    if (file.type.startsWith("video")) return <FileVideo className="w-8 h-8 text-purple-500" />;
    return <Upload className="w-8 h-8 text-gray-400" />;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center transition-colors",
          state === "idle" && "border-gray-200 hover:border-brand-navy-300 cursor-pointer",
          state === "selected" && "border-blue-300 bg-blue-50",
          state === "uploading" && "border-blue-400 bg-blue-50",
          state === "success" && "border-green-300 bg-green-50",
          state === "error" && "border-red-300 bg-red-50"
        )}
        onClick={() => state === "idle" && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />

        <div className="flex flex-col items-center gap-2">
          {state === "uploading" ? (
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          ) : state === "success" ? (
            <CheckCircle className="w-8 h-8 text-green-500" />
          ) : state === "error" ? (
            <AlertCircle className="w-8 h-8 text-red-500" />
          ) : (
            getFileIcon()
          )}

          {state === "idle" && (
            <>
              <p className="text-sm text-gray-600">
                <span className="text-brand-navy-700 font-medium">Click to upload</span> or drag and drop
              </p>
              {description && <p className="text-xs text-gray-400">{description}</p>}
            </>
          )}

          {state === "selected" && file && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              <div className="flex gap-2">
                <button onClick={handleUpload} className="px-4 py-1.5 bg-brand-navy-900 text-white text-sm rounded-lg hover:bg-brand-navy-800">
                  Upload
                </button>
                <button onClick={handleRemove} className="px-4 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300">
                  Remove
                </button>
              </div>
            </div>
          )}

          {state === "uploading" && (
            <div className="w-full max-w-xs space-y-1">
              <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-blue-600">{progress}% uploaded</p>
            </div>
          )}

          {state === "success" && (
            <div className="space-y-2">
              <p className="text-sm text-green-700 font-medium">Upload complete</p>
              {uploadedUrl && <p className="text-xs text-gray-500 truncate max-w-xs">{uploadedUrl}</p>}
              <button onClick={handleRemove} className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1">
                <X className="w-3 h-3" /> Replace file
              </button>
            </div>
          )}

          {state === "error" && (
            <div className="space-y-2">
              <p className="text-sm text-red-600">{error}</p>
              <button onClick={handleRemove} className="text-xs text-gray-500 hover:text-brand-navy-700">
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
