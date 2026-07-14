"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Plus, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface MultiImageUploaderProps {
  bucket: string;
  currentUrls?: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  label?: string;
  hiddenFieldName?: string;
}

export function MultiImageUploader({
  bucket,
  currentUrls = [],
  onChange,
  maxImages = 8,
  label = "Screenshots",
  hiddenFieldName = "screenshots",
}: MultiImageUploaderProps) {
  const [images, setImages] = useState<string[]>(currentUrls);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        alert("Please upload an image or video file");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        alert("File too large. Max 20MB.");
        return;
      }
      if (images.length >= maxImages) {
        alert(`Maximum ${maxImages} images allowed`);
        return;
      }

      setUploading(true);
      try {
        const supabase = createClient();
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
        const filePath = `screenshots/${fileName}`;

        const { error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, { upsert: true });

        if (error) throw error;

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        const newImages = [...images, data.publicUrl];
        setImages(newImages);
        onChange(newImages);
      } catch (err) {
        alert("Upload failed: " + (err instanceof Error ? err.message : "Unknown error"));
      } finally {
        setUploading(false);
      }
    },
    [bucket, images, maxImages, onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      uploadFile(files[i]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith("image/") || files[i].type.startsWith("video/")) {
        uploadFile(files[i]);
      }
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onChange(newImages);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label} ({images.length}/{maxImages})
      </label>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, index) => (
            <div key={url} className="group relative">
              {url.match(/\.(mp4|webm|mov|mkv)$/i) || url.includes("video/") ? (
                <video
                  src={url}
                  className="w-full max-h-40 rounded-lg object-contain"
                />
              ) : (
                <img src={url} alt="" className="w-full max-h-40 rounded-lg object-contain" />
              )}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 rounded-full bg-red-500/90 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {images.length < maxImages && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-1
            rounded-lg border-2 border-dashed transition-colors
            ${dragActive
              ? "border-secondary bg-secondary/5"
              : "border-border bg-card hover:border-secondary/40"
            }
          `}
        >
          {uploading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
              <span className="font-mono text-[10px] text-muted-foreground">Uploading...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Plus className="h-4 w-4" />
              <span className="font-mono text-[10px]">Add screenshot</span>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Hidden input for form submission */}
      <input type="hidden" name={hiddenFieldName} value={JSON.stringify(images)} />
    </div>
  );
}
