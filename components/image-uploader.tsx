"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploaderProps {
  bucket: string;
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  onRemove: () => void;
  label?: string;
  hiddenFieldName?: string;
}

export function ImageUploader({
  bucket,
  currentUrl,
  onUpload,
  onRemove,
  label = "Image",
  hiddenFieldName = "image_url",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        alert("Please upload an image or video file (PNG, JPG, GIF, WebP, SVG, MP4, WebM)");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        alert("File too large. Max 20MB.");
        return;
      }

      setUploading(true);
      try {
        const supabase = createClient();
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, { upsert: true });

        if (error) throw error;

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        setPreview(data.publicUrl);
        onUpload(data.publicUrl);
      } catch (err) {
        alert("Upload failed: " + (err instanceof Error ? err.message : "Unknown error"));
      } finally {
        setUploading(false);
      }
    },
    [bucket, onUpload]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </label>

      {preview ? (
        <div className="relative group">
          {preview.match(/\.(mp4|webm|mov|mkv)$/i) || preview.includes("video/") ? (
            <video
              src={preview}
              className="w-full max-h-60 rounded-lg object-contain"
              controls
            />
          ) : (
            <img
              src={preview}
              alt={label}
              className="w-full max-h-60 rounded-lg object-contain"
            />
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 rounded-full bg-red-500/90 p-2 text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
          <input type="hidden" name={hiddenFieldName} value={preview} />
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2
            rounded-lg border-2 border-dashed transition-colors
            ${dragActive
              ? "border-secondary bg-secondary/5"
              : "border-border bg-card hover:border-secondary/40 hover:bg-card/80"
            }
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
              <span className="font-mono text-[10px] text-muted-foreground">Uploading...</span>
            </div>
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
              <span className="font-mono text-[10px] text-muted-foreground">
                Click or drag file here
              </span>
              <span className="font-mono text-[9px] text-muted-foreground/50">
                PNG, JPG, GIF, WebP, SVG, MP4, WebM — Max 20MB
              </span>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
