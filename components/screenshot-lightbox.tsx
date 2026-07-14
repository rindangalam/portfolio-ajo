"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useCallback } from "react";

interface ScreenshotLightboxProps {
  images: string[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".mkv"];

function isVideo(src: string): boolean {
  const lower = src.split("?")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function ScreenshotLightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: ScreenshotLightboxProps) {
  const handlePrev = useCallback(() => {
    if (currentIndex === null) return;
    onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex === null) return;
    onNavigate(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    if (currentIndex !== null) {
      window.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [currentIndex, onClose, handlePrev, handleNext]);

  const currentSrc = currentIndex !== null ? images[currentIndex] : null;
  const isCurrentVideo = currentSrc ? isVideo(currentSrc) : false;

  return (
    <AnimatePresence>
      {currentIndex !== null && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            className="absolute right-4 top-4 z-10 text-muted-foreground transition-colors hover:text-foreground"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 z-10 text-muted-foreground transition-colors hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                className="absolute right-4 z-10 text-muted-foreground transition-colors hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {isCurrentVideo ? (
            <motion.video
              key={currentIndex}
              src={currentSrc!}
              controls
              autoPlay
              className="max-h-[85vh] max-w-[90vw] object-contain"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <motion.img
              key={currentIndex}
              src={currentSrc!}
              alt={`Screenshot ${currentIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            />
          )}

          {images.length > 1 && (
            <div className="absolute bottom-4 flex gap-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentIndex
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-muted-foreground/40"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(i);
                  }}
                  aria-label={`Go to screenshot ${i + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
