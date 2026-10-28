import React from "react";

interface StatusBadgeProps {
  status: "soon" | "open" | "closed" | "info" | "submitted" | "verified" | "rejected";
  children?: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className = "" }: StatusBadgeProps) {
  let bgStyles = "bg-bramasta-ink text-paper";
  let defaultText = "COMING SOON";

  switch (status) {
    case "soon":
      bgStyles = "bg-bramasta-ink text-paper";
      defaultText = "EDISI KE-4 · 2027";
      break;
    case "open":
      bgStyles = "bg-[#2F6B3F] text-[#F4F1DC]";
      defaultText = "PENDAFTARAN DIBUKA";
      break;
    case "closed":
      bgStyles = "bg-[#9B2C2C] text-[#F4F1DC]";
      defaultText = "KUOTA PENUH";
      break;
    case "info":
      bgStyles = "bg-bramasta-accent-soft text-bramasta-accent border border-bramasta-accent/30";
      defaultText = "INFORMASI RESMI";
      break;
    case "submitted":
      bgStyles = "bg-[#B7791F] text-[#F4F1DC]";
      defaultText = "BERKAS DIAJUKAN";
      break;
    case "verified":
      bgStyles = "bg-[#2F6B3F] text-[#F4F1DC]";
      defaultText = "TERVERIFIKASI";
      break;
    case "rejected":
      bgStyles = "bg-[#9B2C2C] text-[#F4F1DC]";
      defaultText = "PERLU REVISI";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-sm ${bgStyles} ${className}`}
    >
      {children || defaultText}
    </span>
  );
}

