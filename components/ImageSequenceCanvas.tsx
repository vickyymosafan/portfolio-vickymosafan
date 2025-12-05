"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface ImageSequenceCanvasProps {
  baseUrl: string;
  totalFrames: number;
  scrollStart: number;
  scrollEnd: number;
  className?: string;
}

const ImageSequenceCanvas = ({
  baseUrl,
  totalFrames,
  scrollStart,
  scrollEnd,
  className = '',
}: ImageSequenceCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const loadedCount = useRef(0);

  const getFrameUrl = useCallback((index: number) => {
    const paddedIndex = String(index).padStart(3, '0');
    return `${baseUrl.replace('frame_000', `frame_${paddedIndex}`)}`;
  }, [baseUrl]);

  // Preload images
  useEffect(() => {
    const imageArray: HTMLImageElement[] = [];
    loadedCount.current = 0;
    imagesRef.current = imageArray;

    const preloadImage = (index: number) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = getFrameUrl(index);
      img.onload = () => {
        loadedCount.current++;
        if (loadedCount.current >= Math.min(10, totalFrames)) {
          setIsLoading(false);
        }
      };
      img.onerror = () => {
        loadedCount.current++;
      };
      imageArray[index] = img;
    };

    // Load first 10 frames immediately
    for (let i = 0; i < Math.min(10, totalFrames); i++) {
      preloadImage(i);
    }

    // Lazy load remaining frames
    const loadRemaining = () => {
      for (let i = 10; i < totalFrames; i++) {
        preloadImage(i);
      }
    };

    const timeout = setTimeout(loadRemaining, 500);

    return () => clearTimeout(timeout);
  }, [baseUrl, totalFrames, getFrameUrl]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollRange = scrollEnd - scrollStart;
      const scrollProgress = Math.max(0, Math.min(1, (scrollY - scrollStart) / scrollRange));
      const frameIndex = Math.min(Math.floor(scrollProgress * (totalFrames - 1)), totalFrames - 1);
      setCurrentFrame(frameIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollStart, scrollEnd, totalFrames]);

  // Draw to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imagesRef.current[currentFrame];

    // Check if image exists, is complete, and has valid dimensions (not broken)
    if (!canvas || !ctx || !img || !img.complete || img.naturalWidth === 0) return;

    const draw = () => {
      const container = containerRef.current;
      if (!container) return;

      // Double-check image is still valid before drawing
      if (!img.complete || img.naturalWidth === 0) return;

      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      // Cover fit
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = canvas.width / canvas.height;

      let drawWidth, drawHeight, drawX, drawY;

      if (canvasRatio > imgRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        drawX = 0;
        drawY = (canvas.height - drawHeight) / 2;
      } else {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgRatio;
        drawX = (canvas.width - drawWidth) / 2;
        drawY = 0;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      try {
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      } catch {
        // Image might be in broken state, skip drawing
      }
    };

    requestAnimationFrame(draw);
  }, [currentFrame]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease' }}
      />
    </div>
  );
};

export default ImageSequenceCanvas;
