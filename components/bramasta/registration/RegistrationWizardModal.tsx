"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Copy,
  Upload,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { NewsRule } from "../ui/NewsRule";
import {
  registerParticipant,
  loginParticipant,
  loginWithGoogle,
  getCurrentUser,
  logoutParticipant,
} from "@/lib/evora/auth";
import { validatePassword } from "@/lib/evora/validation";
import { registerTeam } from "@/lib/evora/teams";
import { uploadFileBase64, fileToBase64 } from "@/lib/evora/upload";
import type { EvoraCategory, EvoraEvent, EvoraTeam, EvoraUser } from "@/types/evora";

const DRAFT_KEY = "bramasta_reg_draft_v1";

interface RegistrationWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: EvoraCategory[];
  event: EvoraEvent | null;
  onSuccess: (team: EvoraTeam, user: EvoraUser) => void;
  initialCategoryId?: string;
}

export function RegistrationWizardModal({
  isOpen,
  onClose,
  categories,
  event,
  onSuccess,
  initialCategoryId,
}: RegistrationWizardModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedBank, setCopiedBank] = useState(false);
  const [isDraftRestored, setIsDraftRestored] = useState(false);

  // Authenticated user state
  const [loggedInUser, setLoggedInUser] = useState<EvoraUser | null>(null);
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  // Form states
  const [selectedCatId, setSelectedCatId] = useState(initialCategoryId || "");
  const [schoolName, setSchoolName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coachName, setCoachName] = useState("");
  const [coachPhone, setCoachPhone] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);

  // Login shortcut mode jika akun pembina sudah pernah dibuat
  const [isExistingAccount, setIsExistingAccount] = useState(false);

  // 1. Sinkronkan sesi user aktif saat modal dibuka
  useEffect(() => {
    if (!isOpen) return;
    const user = getCurrentUser();
    if (user) {
      setLoggedInUser(user);
      if (!coachName) setCoachName(user.full_name || "");
      if (!authEmail) setAuthEmail(user.email || "");
    }
  }, [isOpen]);

  // 2. Google Identity Services (GSI) script loader & initializer
  useEffect(() => {
    if (typeof window === "undefined" || !isOpen) return;
    const scriptId = "google-gsi-client";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const initGsi = () => {
      if (!window.google?.accounts?.id || !googleClientId) return;
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (res: { credential: string }) => {
            if (!res.credential) return;
            try {
              setLoading(true);
              setErrorMessage(null);
              const authRes = await loginWithGoogle(res.credential);
              setLoggedInUser(authRes.user);
              setCoachName(authRes.user.full_name || "");
              setAuthEmail(authRes.user.email || "");
            } catch (err: any) {
              setErrorMessage(err.message || "Gagal masuk dengan akun Google.");
            } finally {
              setLoading(false);
            }
          },
        });

        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "outline",
            size: "large",
            width: 320,
            text: "continue_with",
            shape: "rectangular",
          });
        }
      } catch (e) {
        console.warn("GSI init notice:", e);
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGsi;
      document.body.appendChild(script);
    } else if (window.google?.accounts?.id) {
      initGsi();
    }
  }, [isOpen, step, googleClientId]);

  // 3. Sinkronkan initialCategoryId jika berubah dari luar (misal: klik kartu kategori tertentu)
  useEffect(() => {
    if (initialCategoryId) {
      setSelectedCatId(initialCategoryId);
    }
  }, [initialCategoryId]);

  // 4. Restore draft dari sessionStorage saat modal pertama dibuka
  useEffect(() => {
    if (!isOpen) return;

    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.selectedCatId && !initialCategoryId) setSelectedCatId(data.selectedCatId);
        if (data.schoolName) setSchoolName(data.schoolName);
        if (data.teamName) setTeamName(data.teamName);
        if (data.coachName) setCoachName(data.coachName);
        if (data.coachPhone) setCoachPhone(data.coachPhone);
        if (data.authEmail) setAuthEmail(data.authEmail);
        if (data.authPassword) setAuthPassword(data.authPassword);
        if (data.step && (data.step === 1 || data.step === 2 || data.step === 3)) {
          setStep(data.step);
        }
        setIsDraftRestored(true);
      } else if (initialCategoryId) {
        setSelectedCatId(initialCategoryId);
      }
    } catch {
      // Ignore parse error
    }
  }, [isOpen, initialCategoryId]);

  // Set default category jika belum terpilih
  useEffect(() => {
    if (!selectedCatId && categories.length > 0) {
      setSelectedCatId(categories[0].id);
    }
  }, [categories, selectedCatId]);

  // 5. Simpan draft ke sessionStorage secara otomatis setiap ada perubahan data
  useEffect(() => {
    if (!isOpen) return;
    try {
      const draft = {
        selectedCatId,
        schoolName,
        teamName,
        coachName,
        coachPhone,
        authEmail,
        authPassword,
        step,
      };
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Ignore storage quota error
    }
  }, [isOpen, selectedCatId, schoolName, teamName, coachName, coachPhone, authEmail, authPassword, step]);

  // Kunci scroll halaman belakang saat modal aktif
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Real-time password validation
  const pwdCheck = validatePassword(authPassword);

  // Rincian Pembayaran
  const feeNumber = Number(event?.registration_fee || "300000");
  const feeFormatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(feeNumber);

  const bankName = event?.payment_info?.bank_name || "BCA";
  const accountHolder = event?.payment_info?.account_holder || "Panitia";
  const accountNumber = event?.payment_info?.account_number || "12314342942";

  const handleCopyAccount = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(accountNumber);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPaymentProofFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPaymentProofPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPaymentProofPreview(null);
    }
  };

  const handleResetDraft = () => {
    sessionStorage.removeItem(DRAFT_KEY);
    setSchoolName("");
    setTeamName("");
    setLogoFile(null);
    setLogoPreview(null);
    setCoachName("");
    setCoachPhone("");
    setAuthEmail("");
    setAuthPassword("");
    setPaymentProofFile(null);
    setPaymentProofPreview(null);
    setStep(1);
    setIsDraftRestored(false);
  };

  const handleGoogleFallbackClick = () => {
    if (window.google?.accounts?.id && googleClientId) {
      window.google.accounts.id.prompt();
    } else {
      setErrorMessage(
        "Koneksi Google Client ID belum aktif di konfigurasi (NEXT_PUBLIC_GOOGLE_CLIENT_ID). Silakan gunakan formulir pendaftaran email di bawah."
      );
    }
  };

  // Validasi Step 1
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!selectedCatId) {
      setErrorMessage("Silakan pilih kategori lomba terlebih dahulu.");
      return;
    }
    if (!schoolName.trim()) {
      setErrorMessage("Silakan masukkan nama asal sekolah / instansi pangkalan Anda.");
      return;
    }
    if (!teamName.trim()) {
      setErrorMessage("Silakan masukkan nama satuan peleton / tim Anda.");
      return;
    }
    setStep(2);
  };

  // Validasi & Autentikasi Step 2 (Memastikan Akun Terverifikasi Sebelum ke Step 3)
  const handleNextStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!coachPhone.trim()) {
      setErrorMessage("Silakan isi nomor WhatsApp pembina yang aktif untuk koordinasi panitia.");
      return;
    }

    // Jika sudah login sebelumnya (via Google atau sesi tersimpan)
    if (loggedInUser) {
      setStep(3);
      return;
    }

    // Validasi input email
    if (!authEmail.trim() || !authEmail.includes("@")) {
      setErrorMessage("Alamat email tidak valid.");
      return;
    }

    // Kasus 1: Login ke Akun Lama
    if (isExistingAccount) {
      if (!authPassword) {
        setErrorMessage("Silakan masukkan kata sandi akun Anda.");
        return;
      }

      setLoading(true);
      try {
        const loginRes = await loginParticipant(authEmail.trim(), authPassword);
        setLoggedInUser(loginRes.user);
        if (!coachName.trim()) setCoachName(loginRes.user.full_name);
        setStep(3);
      } catch (err: any) {
        setErrorMessage(err.message || "Email atau kata sandi tidak cocok. Silakan periksa kembali.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Kasus 2: Pendaftaran Akun Baru (Wajib Validasi Password)
    if (!coachName.trim()) {
      setErrorMessage("Silakan isi nama lengkap pembina / pelatih peleton.");
      return;
    }

    const pwdVal = validatePassword(authPassword);
    if (!pwdVal.isValid) {
      setErrorMessage(pwdVal.errorMessage || "Kata sandi belum memenuhi kriteria keamanan.");
      return;
    }

    setLoading(true);
    try {
      try {
        await registerParticipant(coachName.trim(), authEmail.trim(), authPassword);
      } catch (regErr: any) {
        const msg = regErr.message?.toLowerCase() || "";
        if (msg.includes("already") || msg.includes("terdaftar") || msg.includes("exists")) {
          // Jika email sudah ada, coba langsung login dengan kredensial ini
          try {
            const loginRes = await loginParticipant(authEmail.trim(), authPassword);
            setLoggedInUser(loginRes.user);
            setStep(3);
            return;
          } catch {
            throw new Error("Email ini sudah terdaftar. Silakan centang 'Sudah punya akun?' atau periksa kembali kata sandi Anda.");
          }
        } else {
          throw regErr;
        }
      }

      const loginRes = await loginParticipant(authEmail.trim(), authPassword);
      setLoggedInUser(loginRes.user);
      setStep(3);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal memproses pembuatan akun pembina.");
    } finally {
      setLoading(false);
    }
  };

  // Submit Final di Step 3 (Pengguna SUDAH terautentikasi dan memiliki token aktif)
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const activeUser = loggedInUser || getCurrentUser();
      if (!activeUser) {
        setErrorMessage("Sesi login Anda tidak ditemukan. Silakan kembali ke langkah sebelumnya untuk masuk.");
        setStep(2);
        return;
      }

      // 1. Upload Logo Tim / Lambang Sekolah jika dilampirkan (dengan token login)
      let logoUrl = "";
      if (logoFile) {
        try {
          const base64 = await fileToBase64(logoFile);
          const uploaded = await uploadFileBase64(
            base64,
            logoFile.name,
            "/evora/events/teams"
          );
          logoUrl = uploaded.url;
        } catch (uploadErr) {
          console.warn("Upload logo tim gagal, lanjut pendaftaran tim:", uploadErr);
        }
      }

      // 2. Upload Bukti Transfer jika dilampirkan (dengan token login)
      let paymentProofUrl = "";
      if (paymentProofFile) {
        try {
          const base64 = await fileToBase64(paymentProofFile);
          const uploaded = await uploadFileBase64(
            base64,
            paymentProofFile.name,
            "/evora/events/payment"
          );
          paymentProofUrl = uploaded.url;
        } catch (uploadErr) {
          console.warn("Upload bukti bayar gagal, lanjut pendaftaran tim:", uploadErr);
        }
      }

      // 3. Pendaftaran Tim Peleton Resmi (Memerlukan token login aktif)
      const teamRes = await registerTeam({
        category_id: selectedCatId,
        team_name: teamName.trim(),
        school_name: schoolName.trim(),
        school: schoolName.trim(),
        logo_url: logoUrl || undefined,
        coach_name: coachName.trim() || activeUser.full_name,
        coach_phone: coachPhone.trim(),
        payment_proof_url: paymentProofUrl || undefined,
      });

      // 4. Hapus draf sementara karena pendaftaran telah sukses
      sessionStorage.removeItem(DRAFT_KEY);

      // 5. Konstruksi objek tim awal untuk dashboard
      const registeredTeam: EvoraTeam = {
        id: teamRes.team_id,
        category_id: selectedCatId,
        team_name: teamName.trim(),
        school_name: schoolName.trim(),
        school: schoolName.trim(),
        logo_url: logoUrl || null,
        coach_name: coachName.trim() || activeUser.full_name,
        coach_phone: coachPhone.trim(),
        status: "submitted",
        category: categories.find((c) => c.id === selectedCatId),
        payment_proof_url: paymentProofUrl,
        members: [],
      };

      onSuccess(registeredTeam, activeUser);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal memproses pendaftaran peleton. Periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wizard-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-paper-light border-2 sm:border-3 border-bramasta-ink shadow-[4px_4px_0px_#141210] rounded-xl max-w-lg w-full max-h-[92vh] flex flex-col relative animate-in zoom-in-95 duration-150 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER MODAL & INDIKATOR LANGKAH ── */}
        <div className="p-3.5 sm:p-4 bg-paper border-b-2 border-bramasta-ink">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div>
              <span className="font-bodoni font-bold text-[11px] sm:text-xs uppercase tracking-[0.18em] text-bramasta-ink-mute block">
                PENDAFTARAN RESMI EVORA
              </span>
              <h2 id="wizard-title" className="font-bodoni font-bold text-lg sm:text-xl uppercase tracking-tight text-bramasta-ink leading-tight mt-0.5">
                Formulir Pendaftaran Peleton
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center border-2 border-bramasta-ink bg-paper hover:bg-bramasta-ink hover:text-bramasta-accent-on rounded-md transition-colors cursor-pointer shrink-0"
              aria-label="Tutup pendaftaran"
              title="Tutup (draf tersimpan otomatis)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Indikator Langkah (Sesuai Hirarki Aksen Teal design.md) */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1">
            <div
              className={`text-center py-2 px-1 border-2 font-bodoni text-xs uppercase tracking-wider rounded-md transition-colors ${
                step === 1
                  ? "bg-bramasta-accent text-bramasta-accent-on border-bramasta-accent font-bold shadow-xs"
                  : step > 1
                  ? "bg-bramasta-accent-soft text-bramasta-accent border-bramasta-accent/40 font-bold"
                  : "bg-paper border-bramasta-ink/30 text-bramasta-ink-mute"
              }`}
            >
              1. Kategori
            </div>
            <div
              className={`text-center py-2 px-1 border-2 font-bodoni text-xs uppercase tracking-wider rounded-md transition-colors ${
                step === 2
                  ? "bg-bramasta-accent text-bramasta-accent-on border-bramasta-accent font-bold shadow-xs"
                  : step > 2
                  ? "bg-bramasta-accent-soft text-bramasta-accent border-bramasta-accent/40 font-bold"
                  : "bg-paper border-bramasta-ink/30 text-bramasta-ink-mute"
              }`}
            >
              2. Pembina
            </div>
            <div
              className={`text-center py-2 px-1 border-2 font-bodoni text-xs uppercase tracking-wider rounded-md transition-colors ${
                step === 3
                  ? "bg-bramasta-accent text-bramasta-accent-on border-bramasta-accent font-bold shadow-xs"
                  : "bg-paper border-bramasta-ink/30 text-bramasta-ink-mute"
              }`}
            >
              3. Bukti Bayar
            </div>
          </div>
        </div>

        {/* Notifikasi Draf Dipulihkan */}
        {isDraftRestored && (
          <div className="px-3.5 py-2 bg-paper-dark border-b border-bramasta-ink/30 flex items-center justify-between gap-2 text-xs font-bodoni text-bramasta-ink font-medium">
            <span>Draf formulir pendaftaran Anda telah dipulihkan otomatis.</span>
            <button
              type="button"
              onClick={handleResetDraft}
              className="inline-flex items-center gap-1 font-bold text-bramasta-ink underline hover:text-[#9B2C2C] cursor-pointer shrink-0"
              title="Mulai ulang formulir dari awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Draf</span>
            </button>
          </div>
        )}

        {/* Alert Error (Sesuai Token --danger #9B2C2C di design.md) */}
        {errorMessage && (
          <div className="p-3.5 bg-[#9B2C2C] text-[#F4F1DC] font-bodoni text-xs sm:text-sm border-b-2 border-bramasta-ink flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#F4F1DC]" />
            <p className="leading-snug">{errorMessage}</p>
          </div>
        )}

        {/* ── KONTEN STEP BY STEP ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* ───────────────── LANGKAH 1: KATEGORI & PELETON ───────────────── */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-4">
              <div>
                <label className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider block text-bramasta-ink mb-2">
                  1. Pilih Kategori Perlombaan
                </label>
                {categories.length === 0 ? (
                  <div className="p-3 bg-paper border border-bramasta-ink rounded-md text-xs sm:text-sm font-bodoni text-bramasta-ink-soft text-center">
                    Memuat kategori lomba dari EVORA Engine...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {categories.map((c) => {
                      const remaining = Math.max(0, c.slot_count - c.slot_taken);
                      const isSelected = selectedCatId === c.id;
                      return (
                        <div
                          key={c.id}
                          onClick={() => setSelectedCatId(c.id)}
                          className={`p-3.5 border-2 rounded-md cursor-pointer transition-all flex items-center justify-between gap-3 ${
                            isSelected
                              ? "bg-paper-light border-bramasta-accent ring-2 ring-bramasta-accent shadow-xs"
                              : "bg-paper border-bramasta-ink/40 hover:border-bramasta-ink"
                          }`}
                        >
                          <div>
                            <span className="font-bodoni font-bold text-base sm:text-lg uppercase text-bramasta-ink block">
                              {c.name}
                            </span>
                            <span className="text-xs sm:text-sm font-bodoni text-bramasta-ink-soft block mt-0.5">
                              Personil: {c.min_team_members} – {c.max_team_members} orang (termasuk danton)
                            </span>
                          </div>
                          <span
                            className={`px-3 py-1 font-bodoni font-bold text-xs uppercase tracking-wider rounded-sm shrink-0 ${
                              isSelected
                                ? "bg-bramasta-accent text-bramasta-accent-on"
                                : "bg-paper-dark border border-bramasta-ink text-bramasta-ink"
                            }`}
                          >
                            {remaining} Slot Tersisa
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. Nama Asal Sekolah / Pangkalan */}
              <div>
                <label className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider block text-bramasta-ink mb-1.5">
                  2. Nama Asal Sekolah / Pangkalan
                </label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Contoh: SMAN 2 Mengwi"
                  className="w-full min-h-[48px] p-3 bg-paper border-2 border-bramasta-ink rounded-sm font-bodoni text-base text-bramasta-ink placeholder:text-bramasta-ink-mute/70 focus:outline-none focus:ring-2 focus:ring-bramasta-accent focus:border-bramasta-accent focus:bg-paper-light shadow-xs"
                />
                <span className="text-xs font-bodoni text-bramasta-ink-soft mt-1 block">
                  Nama sekolah atau institusi resmi yang mengutus kontingen.
                </span>
              </div>

              {/* 3. Nama Satuan Peleton / Tim */}
              <div>
                <label className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider block text-bramasta-ink mb-1.5">
                  3. Nama Satuan Peleton / Nama Tim
                </label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Contoh: Peleton A - Yudhistira"
                  className="w-full min-h-[48px] p-3 bg-paper border-2 border-bramasta-ink rounded-sm font-bodoni text-base text-bramasta-ink placeholder:text-bramasta-ink-mute/70 focus:outline-none focus:ring-2 focus:ring-bramasta-accent focus:border-bramasta-accent focus:bg-paper-light shadow-xs"
                />
                <span className="text-xs font-bodoni text-bramasta-ink-soft mt-1 block">
                  Nama barisan atau sebutan peleton yang akan berlaga di arena lomba.
                </span>
              </div>

              {/* 4. Logo Tim / Lambang Sekolah */}
              <div>
                <label className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider block text-bramasta-ink mb-1.5">
                  4. Logo Tim / Lambang Sekolah <span className="text-bramasta-ink-soft font-normal">(Opsional)</span>
                </label>
                <div className="border-2 border-dashed border-bramasta-ink/50 hover:border-bramasta-accent rounded-md p-3.5 sm:p-4 bg-paper hover:bg-paper-light transition-colors text-center relative">
                  {logoPreview ? (
                    <div className="flex items-center justify-center gap-3.5">
                      <img
                        src={logoPreview}
                        alt="Preview Logo"
                        className="w-14 h-14 object-contain border-2 border-bramasta-ink bg-paper-light p-1 rounded-sm shadow-xs shrink-0"
                      />
                      <div className="text-left">
                        <p className="font-bodoni font-bold text-xs sm:text-sm text-bramasta-ink truncate max-w-[200px] sm:max-w-[260px]">
                          {logoFile?.name || "Logo Terpilih"}
                        </p>
                        <span className="text-xs font-bodoni text-bramasta-ink-soft block">
                          Logo berhasil dilampirkan
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setLogoFile(null);
                            setLogoPreview(null);
                          }}
                          className="text-xs font-bodoni font-bold uppercase text-[#9B2C2C] hover:underline mt-0.5 block cursor-pointer"
                        >
                          Hapus / Ganti Logo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-5 h-5 mx-auto mb-1 text-bramasta-ink/70" />
                      <span className="font-bodoni font-bold text-xs uppercase text-bramasta-ink block mb-0.5">
                        Unggah Lambang / Logo Tim
                      </span>
                      <span className="font-bodoni text-xs text-bramasta-ink-soft block mb-2.5">
                        Format PNG, JPG, atau JPEG (Maks. 5 MB)
                      </span>
                      <label className="inline-block min-h-[44px] px-4 py-2.5 border-2 border-bramasta-ink bg-paper font-bodoni font-bold text-xs uppercase tracking-wider hover:bg-bramasta-ink hover:text-white rounded-md transition-colors cursor-pointer shadow-xs">
                        <span>Pilih File Logo</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full min-h-[48px] py-3.5 px-6 bg-bramasta-accent text-bramasta-accent-on font-bodoni font-bold text-xs sm:text-sm uppercase tracking-[0.1em] hover:bg-bramasta-accent-hover transition-all rounded-md shadow-sm flex items-center justify-center gap-2 cursor-pointer active:translate-y-px"
                >
                  <span>Lanjut ke Data Pembina</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ───────────────── LANGKAH 2: PEMBINA & AKUN ───────────────── */}
          {step === 2 && (
            <form onSubmit={handleNextStep2} className="space-y-4">
              {/* KONDISI 1: Pembina SUDAH Terverifikasi (via Google / Sesi Sebelumnya) */}
              {loggedInUser ? (
                <div className="bg-paper border-2 border-bramasta-ink rounded-md p-4 space-y-3.5 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-bramasta-ink/20">
                    <div className="flex items-center gap-2 text-[#2F6B3F]">
                      <ShieldCheck className="w-5 h-5 shrink-0" />
                      <span className="font-bodoni font-bold text-xs uppercase tracking-wider">
                        Akun Pembina Terhubung
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logoutParticipant();
                        setLoggedInUser(null);
                      }}
                      className="text-xs font-bodoni font-bold text-bramasta-ink-mute hover:text-[#9B2C2C] underline cursor-pointer"
                    >
                      Ganti Akun
                    </button>
                  </div>

                  <div className="text-xs sm:text-sm font-bodoni text-bramasta-ink bg-paper-light border border-bramasta-ink/30 rounded-sm p-3">
                    <span className="text-bramasta-ink-mute block text-[11px] uppercase tracking-wider">
                      Identitas Terverifikasi:
                    </span>
                    <span className="font-bold block text-sm sm:text-base text-bramasta-ink">
                      {loggedInUser.full_name}
                    </span>
                    <span className="text-bramasta-ink-soft block">{loggedInUser.email}</span>
                  </div>

                  <div>
                    <label className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider block text-bramasta-ink mb-1.5">
                      Nomor WhatsApp Pembina (Untuk TM & Verifikasi Panitia)
                    </label>
                    <input
                      type="tel"
                      required
                      value={coachPhone}
                      onChange={(e) => setCoachPhone(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      className="w-full min-h-[48px] p-3 bg-paper-light border-2 border-bramasta-ink rounded-sm font-bodoni text-base text-bramasta-ink focus:outline-none focus:ring-2 focus:ring-bramasta-accent shadow-xs"
                    />
                  </div>
                </div>
              ) : (
                /* KONDISI 2: Belum Login -> Pilihan Google atau Form Email */
                <div className="space-y-4">
                  {/* Tombol Cepat Google Sign-In */}
                  <div>
                    <span className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider block text-bramasta-ink mb-2">
                      Masuk Cepat dengan Akun Google
                    </span>
                    <div className="space-y-2">
                      <div ref={googleBtnRef} className="flex justify-center min-h-[48px]">
                        <button
                          type="button"
                          onClick={handleGoogleFallbackClick}
                          className="w-full min-h-[48px] flex items-center justify-center gap-2.5 py-3 px-4 border-2 border-bramasta-ink bg-paper-light hover:bg-paper transition-colors font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider text-bramasta-ink rounded-md shadow-xs cursor-pointer"
                        >
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                          </svg>
                          <span>Lanjut dengan Akun Google</span>
                        </button>
                      </div>
                      <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-bramasta-ink/20"></div>
                        <span className="shrink-0 mx-3 font-bodoni text-[11px] uppercase tracking-wider text-bramasta-ink-mute font-bold">
                          atau isi formulir akun
                        </span>
                        <div className="flex-grow border-t border-bramasta-ink/20"></div>
                      </div>
                    </div>
                  </div>

                  {/* Form Email & Password Manual */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider text-bramasta-ink">
                        {isExistingAccount ? "Masuk ke Akun Pembina" : "Data Akun Pembina"}
                      </span>
                      <label className="inline-flex items-center gap-1.5 text-xs font-bodoni font-semibold cursor-pointer text-bramasta-ink">
                        <input
                          type="checkbox"
                          checked={isExistingAccount}
                          onChange={(e) => setIsExistingAccount(e.target.checked)}
                          className="accent-bramasta-ink w-4 h-4 cursor-pointer"
                        />
                        <span>Sudah punya akun?</span>
                      </label>
                    </div>

                    {!isExistingAccount && (
                      <div>
                        <label className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider block text-bramasta-ink mb-1.5">
                          Nama Lengkap Pembina / Pelatih
                        </label>
                        <input
                          type="text"
                          required
                          value={coachName}
                          onChange={(e) => setCoachName(e.target.value)}
                          placeholder="Contoh: I Putu Adnyana, S.Pd."
                          className="w-full min-h-[48px] p-3 bg-paper border-2 border-bramasta-ink rounded-sm font-bodoni text-base text-bramasta-ink placeholder:text-bramasta-ink-mute/70 focus:outline-none focus:ring-2 focus:ring-bramasta-accent focus:bg-paper-light"
                        />
                      </div>
                    )}

                    <div>
                      <label className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider block text-bramasta-ink mb-1.5">
                        Nomor WhatsApp Pembina (Untuk TM & Koordinasi)
                      </label>
                      <input
                        type="tel"
                        required
                        value={coachPhone}
                        onChange={(e) => setCoachPhone(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="w-full min-h-[48px] p-3 bg-paper border-2 border-bramasta-ink rounded-sm font-bodoni text-base text-bramasta-ink placeholder:text-bramasta-ink-mute/70 focus:outline-none focus:ring-2 focus:ring-bramasta-accent focus:bg-paper-light"
                      />
                    </div>

                    <div>
                      <label className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider block text-bramasta-ink mb-1.5">
                        Alamat Email Aktif
                      </label>
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="pembina@sekolah.sch.id"
                        className="w-full min-h-[48px] p-3 bg-paper border-2 border-bramasta-ink rounded-sm font-bodoni text-base text-bramasta-ink placeholder:text-bramasta-ink-mute/70 focus:outline-none focus:ring-2 focus:ring-bramasta-accent focus:bg-paper-light"
                      />
                    </div>

                    <div>
                      <label className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider block text-bramasta-ink mb-1.5">
                        {isExistingAccount ? "Kata Sandi Akun" : "Buat Kata Sandi Akun"}
                      </label>
                      <input
                        type="password"
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder={
                          isExistingAccount
                            ? "Masukkan kata sandi akun Anda"
                            : "Minimal 8 karakter (huruf kapital, kecil, angka)"
                        }
                        className="w-full min-h-[48px] p-3 bg-paper border-2 border-bramasta-ink rounded-sm font-bodoni text-base text-bramasta-ink placeholder:text-bramasta-ink-mute/70 focus:outline-none focus:ring-2 focus:ring-bramasta-accent focus:bg-paper-light"
                      />

                      {/* Checklist Validasi Password Real-Time (Khusus Pendaftaran Baru) */}
                      {!isExistingAccount && authPassword.length > 0 && (
                        <div className="mt-2.5 p-3 bg-paper border border-bramasta-ink/40 rounded-sm text-xs font-bodoni space-y-1">
                          <span className="font-bold uppercase tracking-wider text-bramasta-ink block text-[11px] mb-1">
                            Kriteria Keamanan Kata Sandi:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            <div
                              className={`flex items-center gap-1.5 ${
                                pwdCheck.hasMinLen ? "text-[#2F6B3F] font-bold" : "text-bramasta-ink-mute"
                              }`}
                            >
                              {pwdCheck.hasMinLen ? (
                                <Check className="w-3.5 h-3.5 text-[#2F6B3F] shrink-0" />
                              ) : (
                                <span className="w-3.5 h-3.5 inline-block text-center text-bramasta-ink-mute">•</span>
                              )}
                              <span>Minimal 8 karakter</span>
                            </div>
                            <div
                              className={`flex items-center gap-1.5 ${
                                pwdCheck.hasUpper ? "text-[#2F6B3F] font-bold" : "text-bramasta-ink-mute"
                              }`}
                            >
                              {pwdCheck.hasUpper ? (
                                <Check className="w-3.5 h-3.5 text-[#2F6B3F] shrink-0" />
                              ) : (
                                <span className="w-3.5 h-3.5 inline-block text-center text-bramasta-ink-mute">•</span>
                              )}
                              <span>Minimal 1 huruf kapital (A-Z)</span>
                            </div>
                            <div
                              className={`flex items-center gap-1.5 ${
                                pwdCheck.hasLower ? "text-[#2F6B3F] font-bold" : "text-bramasta-ink-mute"
                              }`}
                            >
                              {pwdCheck.hasLower ? (
                                <Check className="w-3.5 h-3.5 text-[#2F6B3F] shrink-0" />
                              ) : (
                                <span className="w-3.5 h-3.5 inline-block text-center text-bramasta-ink-mute">•</span>
                              )}
                              <span>Minimal 1 huruf kecil (a-z)</span>
                            </div>
                            <div
                              className={`flex items-center gap-1.5 ${
                                pwdCheck.hasNumber ? "text-[#2F6B3F] font-bold" : "text-bramasta-ink-mute"
                              }`}
                            >
                              {pwdCheck.hasNumber ? (
                                <Check className="w-3.5 h-3.5 text-[#2F6B3F] shrink-0" />
                              ) : (
                                <span className="w-3.5 h-3.5 inline-block text-center text-bramasta-ink-mute">•</span>
                              )}
                              <span>Minimal 1 angka (0-9)</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="min-w-[48px] min-h-[48px] px-4 border-2 border-bramasta-ink bg-paper text-bramasta-ink font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-paper-dark rounded-md transition-colors cursor-pointer flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 min-h-[48px] py-3.5 px-6 bg-bramasta-accent text-bramasta-accent-on font-bodoni font-bold text-xs sm:text-sm uppercase tracking-[0.1em] hover:bg-bramasta-accent-hover transition-all rounded-md shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 active:translate-y-px"
                >
                  <span>{loading ? "Memverifikasi Akun..." : "Lanjut ke Biaya & Bukti Bayar"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ───────────────── LANGKAH 3: BIAYA & BUKTI BAYAR ───────────────── */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              {/* Kartu Informasi Rekening Resmi */}
              <div className="border-2 border-bramasta-ink bg-paper rounded-md p-3.5 sm:p-4 shadow-xs">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider text-bramasta-ink-soft">
                    Biaya Pendaftaran Peleton
                  </span>
                  <span className="font-bodoni font-bold text-xl sm:text-2xl text-bramasta-ink">
                    {feeFormatted}
                  </span>
                </div>

                <NewsRule variant="thin" className="my-2" />

                <div className="flex items-center justify-between gap-3 mt-1.5">
                  <div>
                    <span className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider text-bramasta-ink block">
                      Transfer Bank {bankName}
                    </span>
                    <span className="font-bodoni font-bold text-base sm:text-lg text-bramasta-ink block mt-0.5 tracking-wider">
                      {accountNumber}
                    </span>
                    <span className="text-xs font-bodoni text-bramasta-ink-mute font-medium block">
                      a.n. {accountHolder}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 border-2 border-bramasta-ink bg-paper-light hover:bg-bramasta-ink hover:text-white rounded-md transition-colors text-xs sm:text-sm font-bodoni font-bold uppercase tracking-wider cursor-pointer shrink-0"
                    title="Salin nomor rekening ke clipboard"
                  >
                    {copiedBank ? <Check className="w-4 h-4 text-[#2F6B3F]" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedBank ? "Tersalin!" : "Salin No"}</span>
                  </button>
                </div>
              </div>

              {/* Upload Bukti Pembayaran */}
              <div>
                <label className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider block text-bramasta-ink mb-1.5">
                  Unggah Bukti Transfer / Slip Pembayaran <span className="text-bramasta-ink-soft font-normal">(Opsional)</span>
                </label>
                <div className="border-2 border-dashed border-bramasta-ink/50 hover:border-bramasta-accent rounded-md bg-paper p-3.5 sm:p-4 text-center transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-xs sm:text-sm font-bodoni cursor-pointer"
                  />
                  <span className="text-xs font-bodoni text-bramasta-ink-mute block mt-1.5">
                    Format: JPG / PNG (Bisa difoto langsung dari ponsel)
                  </span>

                  {paymentProofPreview && (
                    <div className="mt-3 inline-block border-2 border-bramasta-ink p-1 bg-paper-light rounded-sm shadow-xs">
                      <img
                        src={paymentProofPreview}
                        alt="Preview Bukti Transfer"
                        className="h-28 object-contain mx-auto"
                      />
                    </div>
                  )}
                </div>
                <span className="text-xs font-bodoni text-bramasta-ink-soft block mt-1.5 leading-relaxed">
                  *Catatan: Bukti transfer juga dapat diunggah atau diganti nanti melalui Dashboard Tim sebelum verifikasi pendaftaran ditutup panitia.
                </span>
              </div>

              {/* Tombol Eksekusi Final */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={loading}
                  className="min-w-[48px] min-h-[48px] px-4 border-2 border-bramasta-ink bg-paper text-bramasta-ink font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-paper-dark rounded-md transition-colors cursor-pointer flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 min-h-[48px] py-3.5 px-6 bg-bramasta-accent text-bramasta-accent-on font-bodoni font-bold text-xs sm:text-sm uppercase tracking-[0.1em] hover:bg-bramasta-accent-hover transition-all rounded-md shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:translate-y-px"
                >
                  {loading ? (
                    <span>Memproses & Menyimpan Tim...</span>
                  ) : (
                    <>
                      <span>Selesaikan & Masuk Dashboard</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
