import React from "react";
import type { TeamStatus } from "@/types/evora";

interface StatusBadgeProps {
  status:
    | "soon"
    | "open"
    | "closed"
    | "info"
    | "rejected"
    | TeamStatus;
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
      defaultText = "TIM TERDAFTAR";
      break;
    case "registration_verified":
      bgStyles = "bg-bramasta-accent text-bramasta-accent-on";
      defaultText = "PENDAFTARAN TERVERIFIKASI";
      break;
    case "roster_submitted":
      bgStyles = "bg-[#B7791F] text-[#F4F1DC]";
      defaultText = "ROSTER DIAJUKAN";
      break;
    case "verified":
      bgStyles = "bg-[#2F6B3F] text-[#F4F1DC]";
      defaultText = "SAH / TERVERIFIKASI";
      break;
    case "rejected":
    case "registration_rejected":
      bgStyles = "bg-[#9B2C2C] text-[#F4F1DC]";
      defaultText = "REVISI IDENTITAS TIM";
      break;
    case "roster_rejected":
      bgStyles = "bg-[#9B2C2C] text-[#F4F1DC]";
      defaultText = "REVISI ANGGOTA TIM";
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

