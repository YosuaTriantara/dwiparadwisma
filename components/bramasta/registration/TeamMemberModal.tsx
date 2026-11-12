"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  AlertCircle,
  CheckCircle2,
  Plus,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import { addTeamMember, updateTeamMember } from "@/lib/evora/members";
import { uploadFileBase64, fileToBase64 } from "@/lib/evora/upload";
import type { EvoraTeamMember, RoleInTeam } from "@/types/evora";

export type MemberModalMode = "view" | "edit" | "add";

export interface MemberQuotaInfo {
  coreCount: number;
  maxCoreMembers: number;
  coachCount: number;
  maxCoaches: number | null;
  officialCount: number;
  maxOfficials: number | null;
}

const INPUT_CLASS =
  "w-full min-h-[44px] px-3 py-2 bg-paper-light border border-bramasta-ink/50 rounded-sm font-jakarta text-base text-bramasta-ink placeholder:text-bramasta-ink-mute focus:outline-none focus:border-bramasta-accent focus:ring-2 focus:ring-bramasta-accent/25 transition-colors";

const FIELD_LABEL_CLASS =
  "block font-jakarta text-xs font-semibold uppercase tracking-wider text-bramasta-ink-soft mb-1";

const FOCUS_RING_CLASS =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2";

const ROLE_FULL_LABELS: Record<RoleInTeam, string> = {
  leader: "Komandan Tim (Danton)",
  member: "Anggota Tim (Pasukan)",
  coach: "Pelatih",
  official: "Official / Pembina / Manajer",
};

function formatDateInput(iso?: string): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

function formatBirthDisplay(place?: string, dateIso?: string): string {
  const cleanPlace = place?.trim() || "";
  let formattedDate = "";
  if (dateIso) {
    const rawDate = dateIso.slice(0, 10);
    const parsed = new Date(`${rawDate}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      formattedDate = new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(parsed);
    } else {
      formattedDate = rawDate;
    }
  }
  if (cleanPlace && formattedDate) return `${cleanPlace}, ${formattedDate}`;
  return cleanPlace || formattedDate || "-";
}

interface TeamMemberModalProps {
  isOpen: boolean;
  initialMode: MemberModalMode;
  member?: EvoraTeamMember | null;
  memberNumber?: number;
  teamId: string;
  teamName?: string;
  isLocked?: boolean;
  quotaInfo?: MemberQuotaInfo;
  externalLoading?: boolean;
  onClose: () => void;
  onSaved: (
    savedMember: EvoraTeamMember,
    isEdit: boolean
  ) => Promise<void> | void;
  onDelete?: (member: EvoraTeamMember) => Promise<void> | void;
}

export function TeamMemberModal({
  isOpen,
  initialMode,
  member = null,
  memberNumber,
  teamId,
  teamName,
  isLocked = false,
  quotaInfo,
  externalLoading = false,
  onClose,
  onSaved,
  onDelete,
}: TeamMemberModalProps) {
  const [mode, setMode] = useState<MemberModalMode>(initialMode);
  const [activeMember, setActiveMember] = useState<EvoraTeamMember | null>(
    member
  );

  // Form state untuk mode "edit" dan "add"
  const [fullName, setFullName] = useState("");
  const [roleInTeam, setRoleInTeam] = useState<RoleInTeam>("member");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [nisn, setNisn] = useState("");
  const [positionLabel, setPositionLabel] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const isBusy = submitting || externalLoading;
  const isEditable = mode === "edit" || mode === "add";
  const todayIso = new Date().toISOString().slice(0, 10);

  // Hitung kuota efektif di luar anggota yang sedang diedit (agar tetap bisa simpan peran saat ini)
  const editingRole = mode === "edit" ? activeMember?.role_in_team : undefined;
  const effectiveCoreCount =
    (quotaInfo?.coreCount || 0) -
    (editingRole === "leader" || editingRole === "member" ? 1 : 0);
  const effectiveCoachCount =
    (quotaInfo?.coachCount || 0) - (editingRole === "coach" ? 1 : 0);
  const effectiveOfficialCount =
    (quotaInfo?.officialCount || 0) - (editingRole === "official" ? 1 : 0);

  const maxCoaches = quotaInfo?.maxCoaches ?? null;
  const maxOfficials = quotaInfo?.maxOfficials ?? null;

  const isCoachDisallowed = maxCoaches === 0;
  const isCoachFull =
    maxCoaches !== null && maxCoaches > 0 && effectiveCoachCount >= maxCoaches;
  const isOfficialDisallowed = maxOfficials === 0;
  const isOfficialFull =
    maxOfficials !== null &&
    maxOfficials > 0 &&
    effectiveOfficialCount >= maxOfficials;

  const populateFormFromMember = (source: EvoraTeamMember | null) => {
    if (source) {
      setFullName(source.full_name || "");
      setRoleInTeam(source.role_in_team || "member");
      setBirthPlace(source.birth_place || "");
      setBirthDate(formatDateInput(source.birth_date));
      setNisn(source.nisn || "");
      setPositionLabel(source.position_label || "");
      setPhotoFile(null);
      setPhotoPreview(source.photo_url || null);
      setPhotoRemoved(false);
    } else {
      setFullName("");
      setRoleInTeam("member");
      setBirthPlace("");
      setBirthDate("");
      setNisn("");
      setPositionLabel("");
      setPhotoFile(null);
      setPhotoPreview(null);
      setPhotoRemoved(false);
    }
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  // Sinkronkan state ketika modal dibuka atau target anggota berubah
  useEffect(() => {
    if (!isOpen) return;
    setMode(initialMode);
    setActiveMember(member);
    populateFormFromMember(initialMode === "add" ? null : member);
    setErrorMessage(null);
    setLocalSuccess(null);
  }, [isOpen, initialMode, member]);

  // Body scroll-lock & tombol Escape
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isBusy) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isBusy, onClose]);

  if (!isOpen) return null;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
    if (file) {
      setPhotoRemoved(false);
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    if (isBusy) return;
    onClose();
  };

  const handleSwitchToEdit = () => {
    if (!activeMember || isLocked) return;
    populateFormFromMember(activeMember);
    setErrorMessage(null);
    setLocalSuccess(null);
    setMode("edit");
  };

  const handleCancelEdit = () => {
    if (isBusy) return;
    if (mode === "edit" && activeMember) {
      populateFormFromMember(activeMember);
      setErrorMessage(null);
      setMode("view");
    } else {
      handleClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId || !fullName.trim()) {
      setErrorMessage("Nama lengkap wajib diisi.");
      return;
    }

    if (!birthPlace.trim()) {
      setErrorMessage("Tempat lahir wajib diisi.");
      return;
    }

    if (!birthDate) {
      setErrorMessage("Tanggal lahir wajib diisi.");
      return;
    }

    const birthYear = Number(birthDate.slice(0, 4));
    if (
      Number.isNaN(birthYear) ||
      birthYear < 1940 ||
      birthDate > todayIso
    ) {
      setErrorMessage(
        "Tanggal lahir tidak valid (minimal tahun 1940 dan tidak boleh melebihi hari ini)."
      );
      return;
    }

    if (roleInTeam === "coach" && (isCoachDisallowed || isCoachFull)) {
      setErrorMessage(
        isCoachDisallowed
          ? "Peran Pelatih tidak diizinkan pada event ini."
          : `Batas maksimal Pelatih (${maxCoaches} orang) sudah tercapai.`
      );
      return;
    }

    if (roleInTeam === "official" && (isOfficialDisallowed || isOfficialFull)) {
      setErrorMessage(
        isOfficialDisallowed
          ? "Peran Official tidak diizinkan pada event ini."
          : `Batas maksimal Official (${maxOfficials} orang) sudah tercapai.`
      );
      return;
    }

    setErrorMessage(null);
    setLocalSuccess(null);
    setSubmitting(true);

    try {
      let photoUrl = "";
      if (photoFile) {
        const base64 = await fileToBase64(photoFile);
        const uploaded = await uploadFileBase64(
          base64,
          photoFile.name,
          "/evora/events/members"
        );
        photoUrl = uploaded.url;
      } else if (
        mode === "edit" &&
        !photoRemoved &&
        activeMember?.photo_url
      ) {
        photoUrl = activeMember.photo_url;
      }

      const payload = {
        full_name: fullName.trim(),
        role_in_team: roleInTeam,
        birth_place: birthPlace.trim(),
        birth_date: birthDate,
        nisn: nisn.trim(),
        position_label: positionLabel.trim(),
        photo_url: photoUrl,
      };

      if (mode === "edit" && activeMember) {
        const updated = await updateTeamMember(teamId, activeMember.id, payload);
        const mergedMember: EvoraTeamMember = {
          ...activeMember,
          ...payload,
          ...updated,
        };
        setActiveMember(mergedMember);
        populateFormFromMember(mergedMember);
        await onSaved(mergedMember, true);
        setLocalSuccess(
          "Perubahan berhasil disimpan. Silakan cek data terbaru lalu tekan Tutup."
        );
        setMode("view");
      } else {
        const created = await addTeamMember(teamId, payload);
        await onSaved(created, false);
        populateFormFromMember(null);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          (mode === "edit"
            ? "Gagal memperbarui data personil tim."
            : "Gagal menambahkan personil tim.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const displayedPhotoUrl = isEditable
    ? photoPreview
    : activeMember?.photo_url || null;

  const roleLabel = activeMember
    ? ROLE_FULL_LABELS[activeMember.role_in_team] || activeMember.role_in_team
    : "";

  const roleQuotaHint = (() => {
    if (!quotaInfo) return null;
    if (roleInTeam === "coach") {
      if (isCoachDisallowed) return "Peran Pelatih tidak diizinkan event ini.";
      return `Di luar kuota pasukan inti · Kuota Pelatih: ${effectiveCoachCount + 1}${
        maxCoaches !== null ? ` / ${maxCoaches}` : " (tanpa batas)"
      }`;
    }
    if (roleInTeam === "official") {
      if (isOfficialDisallowed)
        return "Peran Official tidak diizinkan event ini.";
      return `Di luar kuota pasukan inti · Kuota Official: ${effectiveOfficialCount + 1}${
        maxOfficials !== null ? ` / ${maxOfficials}` : " (tanpa batas)"
      }`;
    }
    const nextCore = effectiveCoreCount + 1;
    return `Masuk kuota pasukan inti kategori (${nextCore} / ${quotaInfo.maxCoreMembers})${
      nextCore > quotaInfo.maxCoreMembers ? " · Melebihi batas maksimal" : ""
    }`;
  })();

  const headerEyebrow =
    mode === "view"
      ? `${memberNumber ? `Personil #${memberNumber}` : "Informasi Personil"}${
          teamName ? ` · ${teamName}` : ""
        }`
      : mode === "edit"
      ? `Edit Personil${memberNumber ? ` #${memberNumber}` : ""}${
          teamName ? ` · ${teamName}` : ""
        }`
      : `Tambah Personil${teamName ? ` · ${teamName}` : ""}`;

  const headerTitle =
    mode === "view" && activeMember
      ? activeMember.full_name
      : mode === "edit"
      ? activeMember?.full_name || "Edit Data Personil"
      : "Personil Tim Baru";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-member-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-bramasta-ink/75 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="font-jakarta bg-paper-light border-2 border-bramasta-ink shadow-[0_2px_0_#B5AD73,0_16px_40px_rgba(20,18,16,0.28)] rounded-xl max-w-md w-full max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-4 sm:px-6 pt-4 pb-3.5 bg-paper border-b border-paper-deep flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <span className="font-jakarta font-bold text-xs uppercase tracking-[0.14em] text-bramasta-accent block truncate">
              {headerEyebrow}
            </span>
            <h2
              id="team-member-modal-title"
              className="font-bodoni font-bold text-xl sm:text-2xl uppercase tracking-tight text-bramasta-ink mt-0.5 leading-tight break-words"
            >
              {headerTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isBusy}
            aria-label="Tutup pop-up personil tim"
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center border border-bramasta-ink/50 bg-paper-light text-bramasta-ink hover:bg-bramasta-ink hover:text-bramasta-accent-on rounded-md transition-colors cursor-pointer shrink-0 disabled:opacity-50 ${FOCUS_RING_CLASS}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alert Error */}
        {errorMessage && (
          <div
            role="alert"
            className="px-4 sm:px-6 py-3 bg-[#9B2C2C] text-bramasta-accent-on font-jakarta text-sm border-b border-bramasta-ink flex items-start gap-2.5 shrink-0"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="leading-snug font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Alert Berhasil Setelah Edit (Saat kembali ke mode View) */}
        {localSuccess && mode === "view" && (
          <div
            role="status"
            className="px-4 sm:px-6 py-2.5 bg-[#2F6B3F] text-bramasta-accent-on font-jakarta text-xs sm:text-sm border-b border-bramasta-ink flex items-start gap-2 shrink-0"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-snug font-medium">{localSuccess}</p>
          </div>
        )}

        {/* Body Pop-up Tunggal — Struktur Sama untuk View, Edit, maupun Add */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <form
            id="team-member-modal-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* 1. Area Pas Foto */}
            <div className="bg-paper border border-paper-deep rounded-md p-3 flex flex-col items-center gap-3">
              {displayedPhotoUrl ? (
                <img
                  src={displayedPhotoUrl}
                  alt={
                    fullName || activeMember?.full_name || "Pas foto kandidat"
                  }
                  className="max-h-52 w-auto max-w-full object-contain rounded-sm border border-paper-deep bg-paper-light"
                />
              ) : (
                <div className="w-36 h-44 rounded-sm border border-dashed border-paper-deep bg-paper-dark/50 flex flex-col items-center justify-center text-bramasta-ink-soft gap-1.5 text-center px-3">
                  <User className="w-8 h-8" />
                  <span className="text-xs font-medium">
                    {isEditable
                      ? "Belum ada pas foto (opsional)"
                      : "Belum ada pas foto"}
                  </span>
                </div>
              )}

              {isEditable && (
                <div className="flex flex-wrap items-center justify-center gap-2 w-full pt-1 border-t border-paper-deep/60">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={isBusy}
                    className={`min-h-[40px] px-3.5 py-1.5 border border-bramasta-ink/60 bg-paper-light font-semibold text-xs sm:text-sm text-bramasta-ink hover:bg-bramasta-ink hover:text-bramasta-accent-on rounded-md transition-colors cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50 ${FOCUS_RING_CLASS}`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {displayedPhotoUrl ? "Ganti Foto" : "Pilih Pas Foto"}
                    </span>
                  </button>

                  {displayedPhotoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                        setPhotoRemoved(true);
                        if (photoInputRef.current)
                          photoInputRef.current.value = "";
                      }}
                      disabled={isBusy}
                      className={`min-h-[40px] px-3 py-1.5 border border-[#9B2C2C]/50 bg-paper-light text-[#9B2C2C] hover:bg-[#9B2C2C] hover:text-bramasta-accent-on font-semibold text-xs sm:text-sm rounded-md transition-colors cursor-pointer disabled:opacity-50 ${FOCUS_RING_CLASS}`}
                    >
                      Hapus Foto
                    </button>
                  )}

                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* 2. Wadah Informasi Personil */}
            <div className="bg-paper border border-paper-deep rounded-md divide-y divide-paper-deep text-sm">
              {/* Nama Lengkap */}
              <div className="px-3.5 py-3">
                {isEditable ? (
                  <>
                    <label
                      htmlFor="modal-member-name"
                      className={FIELD_LABEL_CLASS}
                    >
                      Nama Lengkap
                    </label>
                    <input
                      id="modal-member-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Contoh: I Kadek Dwi Anggara"
                      className={INPUT_CLASS}
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-bramasta-ink-soft">
                      Nama Lengkap
                    </span>
                    <span className="font-bold text-bramasta-ink text-right break-words">
                      {activeMember?.full_name || "-"}
                    </span>
                  </div>
                )}
              </div>

              {/* Peran di Tim */}
              <div className="px-3.5 py-3">
                {isEditable ? (
                  <>
                    <label
                      htmlFor="modal-member-role"
                      className={FIELD_LABEL_CLASS}
                    >
                      Peran di Tim
                    </label>
                    <select
                      id="modal-member-role"
                      value={roleInTeam}
                      onChange={(e) =>
                        setRoleInTeam(e.target.value as RoleInTeam)
                      }
                      className={INPUT_CLASS}
                    >
                      <option value="leader">Komandan Tim (Danton)</option>
                      <option value="member">Anggota Tim (Pasukan)</option>
                      <option
                        value="coach"
                        disabled={isCoachDisallowed || isCoachFull}
                      >
                        Pelatih
                        {isCoachDisallowed
                          ? " (Tidak diizinkan)"
                          : isCoachFull
                          ? ` (Penuh ${effectiveCoachCount}/${maxCoaches})`
                          : maxCoaches !== null
                          ? ` (${effectiveCoachCount}/${maxCoaches})`
                          : ""}
                      </option>
                      <option
                        value="official"
                        disabled={isOfficialDisallowed || isOfficialFull}
                      >
                        Official / Pembina / Manajer
                        {isOfficialDisallowed
                          ? " (Tidak diizinkan)"
                          : isOfficialFull
                          ? ` (Penuh ${effectiveOfficialCount}/${maxOfficials})`
                          : maxOfficials !== null
                          ? ` (${effectiveOfficialCount}/${maxOfficials})`
                          : ""}
                      </option>
                    </select>
                    {roleQuotaHint && (
                      <p className="mt-1.5 text-xs text-bramasta-ink-soft">
                        {roleQuotaHint}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-bramasta-ink-soft">
                      Peran di Tim
                    </span>
                    <span className="font-bold text-bramasta-ink text-right">
                      {roleLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Tempat & Tanggal Lahir (Wajib per API EVORA) */}
              <div className="px-3.5 py-3">
                {isEditable ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="modal-member-birth-place"
                        className={FIELD_LABEL_CLASS}
                      >
                        Tempat Lahir
                      </label>
                      <input
                        id="modal-member-birth-place"
                        type="text"
                        required
                        value={birthPlace}
                        onChange={(e) => setBirthPlace(e.target.value)}
                        placeholder="Contoh: Badung"
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="modal-member-birth-date"
                        className={FIELD_LABEL_CLASS}
                      >
                        Tanggal Lahir
                      </label>
                      <input
                        id="modal-member-birth-date"
                        type="date"
                        required
                        min="1940-01-01"
                        max={todayIso}
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className={INPUT_CLASS}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-bramasta-ink-soft">
                      Tempat, Tgl Lahir
                    </span>
                    <span className="font-semibold text-bramasta-ink text-right">
                      {formatBirthDisplay(
                        activeMember?.birth_place,
                        activeMember?.birth_date
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* NISN / No. Identitas */}
              <div className="px-3.5 py-3">
                {isEditable ? (
                  <>
                    <label
                      htmlFor="modal-member-nisn"
                      className={FIELD_LABEL_CLASS}
                    >
                      NISN / No. Identitas{" "}
                      <span className="normal-case font-normal text-bramasta-ink-soft">
                        (Opsional)
                      </span>
                    </label>
                    <input
                      id="modal-member-nisn"
                      type="text"
                      value={nisn}
                      onChange={(e) => setNisn(e.target.value)}
                      placeholder="Contoh: 0061234567"
                      className={INPUT_CLASS}
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-bramasta-ink-soft">
                      NISN / No. Identitas
                    </span>
                    <span className="font-semibold text-bramasta-ink tabular-nums text-right">
                      {activeMember?.nisn || "-"}
                    </span>
                  </div>
                )}
              </div>

              {/* Posisi / Tugas */}
              <div className="px-3.5 py-3">
                {isEditable ? (
                  <>
                    <label
                      htmlFor="modal-member-position"
                      className={FIELD_LABEL_CLASS}
                    >
                      Posisi Barisan / Tugas{" "}
                      <span className="normal-case font-normal text-bramasta-ink-soft">
                        (Opsional)
                      </span>
                    </label>
                    <input
                      id="modal-member-position"
                      type="text"
                      value={positionLabel}
                      onChange={(e) => setPositionLabel(e.target.value)}
                      placeholder={
                        roleInTeam === "coach"
                          ? "Contoh: Pelatih Utama / PBB"
                          : roleInTeam === "official"
                          ? "Contoh: Pembina / Manajer"
                          : "Contoh: Banjar 1 Kanan"
                      }
                      className={INPUT_CLASS}
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-bramasta-ink-soft">
                      Posisi / Tugas
                    </span>
                    <span className="font-semibold text-bramasta-ink text-right">
                      {activeMember?.position_label || "-"}
                    </span>
                  </div>
                )}
              </div>

              {/* Kontak Tambahan (Jika tersedia dari server saat mode View) */}
              {!isEditable && activeMember?.phone && (
                <div className="px-3.5 py-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-bramasta-ink-soft">
                    No. Telepon
                  </span>
                  <span className="font-semibold text-bramasta-ink tabular-nums text-right">
                    {activeMember.phone}
                  </span>
                </div>
              )}

              {!isEditable && activeMember?.email && (
                <div className="px-3.5 py-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-bramasta-ink-soft">
                    Email
                  </span>
                  <span className="font-semibold text-bramasta-ink break-all text-right">
                    {activeMember.email}
                  </span>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Sticky Footer */}
        <div className="px-4 sm:px-6 py-3.5 bg-paper border-t border-paper-deep flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          {mode === "view" && activeMember ? (
            <>
              {!isLocked && onDelete ? (
                <button
                  type="button"
                  onClick={() => onDelete(activeMember)}
                  disabled={isBusy}
                  className={`min-h-[44px] px-3.5 py-2 border border-[#9B2C2C]/60 bg-paper-light text-[#9B2C2C] hover:bg-[#9B2C2C] hover:text-bramasta-accent-on font-semibold text-sm rounded-md transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5 ${FOCUS_RING_CLASS}`}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isBusy}
                  className={`min-h-[44px] px-4 py-2 border border-bramasta-ink/60 bg-paper-light text-bramasta-ink font-semibold text-sm hover:bg-paper-dark rounded-md transition-colors cursor-pointer disabled:opacity-50 ${FOCUS_RING_CLASS}`}
                >
                  Tutup
                </button>

                {!isLocked && (
                  <button
                    type="button"
                    onClick={handleSwitchToEdit}
                    disabled={isBusy}
                    className={`min-h-[44px] px-4 py-2 bg-bramasta-accent text-bramasta-accent-on font-bold text-sm uppercase tracking-[0.05em] hover:bg-bramasta-accent-hover rounded-md shadow-sm transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5 ${FOCUS_RING_CLASS}`}
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Edit Informasi</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isBusy}
                className={`min-h-[48px] px-4 border border-bramasta-ink/60 bg-paper-light text-bramasta-ink font-semibold text-sm hover:bg-paper-dark rounded-md transition-colors cursor-pointer disabled:opacity-50 ${FOCUS_RING_CLASS}`}
              >
                Batal
              </button>
              <button
                type="submit"
                form="team-member-modal-form"
                disabled={isBusy}
                className={`flex-1 min-h-[48px] py-3 px-5 bg-bramasta-accent text-bramasta-accent-on font-bold text-sm uppercase tracking-[0.06em] hover:bg-bramasta-accent-hover transition-colors rounded-md shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 ${FOCUS_RING_CLASS}`}
              >
                {mode === "edit" ? (
                  <Pencil className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>
                  {isBusy
                    ? "Menyimpan..."
                    : mode === "edit"
                    ? "Simpan Perubahan"
                    : "Simpan Personil"}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
