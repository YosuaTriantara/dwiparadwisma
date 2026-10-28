import React from "react";

interface NewsRuleProps {
  variant?: "thin" | "std" | "thick" | "double";
  className?: string;
}

export function NewsRule({ variant = "std", className = "" }: NewsRuleProps) {
  if (variant === "thin") {
    return <div className={`w-full border-t border-bramasta-ink/40 my-3 ${className}`} />;
  }

  if (variant === "thick") {
    return <div className={`w-full border-t-4 border-bramasta-ink my-4 ${className}`} />;
  }

  if (variant === "double") {
    return (
      <div className={`w-full my-4 ${className}`} aria-hidden="true">
        <div className="w-full border-t-4 border-bramasta-ink" />
        <div className="w-full border-t-2 border-bramasta-ink mt-1" />
      </div>
    );
  }

  // std default
  return <div className={`w-full border-t-2 border-bramasta-ink my-3 ${className}`} />;
}

