import React from "react";
import Image from "next/image";

interface SepiaPhotoProps {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: "16/10" | "4/3" | "16/9" | "3/2" | "1/1";
  priority?: boolean;
  className?: string;
}

export function SepiaPhoto({
  src,
  alt,
  caption,
  aspectRatio = "16/10",
  priority = false,
  className = "",
}: SepiaPhotoProps) {
  const aspectClass = {
    "16/10": "aspect-[16/10]",
    "4/3": "aspect-[4/3]",
    "16/9": "aspect-[16/9]",
    "3/2": "aspect-[3/2]",
    "1/1": "aspect-square",
  }[aspectRatio];

  return (
    <figure className={`flex flex-col ${className}`}>
      <div
        className={`relative w-full overflow-hidden border-2 border-bramasta-ink bg-paper-dark ${aspectClass}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 65vw"
          className="object-cover transition-all duration-300 filter grayscale contrast-105 brightness-95 sepia-[0.35] hover:filter-none"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs sm:text-[13px] text-bramasta-ink-mute font-bodoni italic tracking-wide">
          Foto: {caption}
        </figcaption>
      )}
    </figure>
  );
}

