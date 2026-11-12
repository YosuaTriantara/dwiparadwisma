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
  ShieldCheck,
  RotateCcw,
  Eye,
  EyeOff,
  Circle,
} from "lucide-react";
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
import type {
  EvoraCategory,
  EvoraEvent,
  EvoraTeam,
  EvoraUser,
  TeamType,
} from "@/types/evora";

const DRAFT_KEY = "bramasta_reg_draft_v1";

const STEP_META: Record<1 | 2 | 3, { title: string; shortLabel: string }> = {
  1: { title: "Kategori & Data Tim", shortLabel: "Data Tim" },
  2: { title: "Akun & Kontak Pembina", shortLabel: "Akun Pembina" },
  3: { title: "Biaya & Bukti Transfer", shortLabel: "Pembayaran" },
};

const INPUT_CLASS =
  "w-full min-h-[48px] px-3.5 py-2.5 bg-paper-light border border-bramasta-ink/50 rounded-sm font-jakarta text-base text-bramasta-ink placeholder:text-bramasta-ink-mute focus:outline-none focus:border-bramasta-accent focus:ring-2 focus:ring-bramasta-accent/25 transition-colors";

const LABEL_CLASS =
  "block font-jakarta font-semibold text-sm text-bramasta-ink mb-1.5";

const FOCUS_RING_CLASS =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2";

interface ImageUploadDropzoneProps {
  title: string;
  hint: string;
  accept: string;
  fileName?: string;
  previewUrl: string | null;
  previewAlt: string;
  buttonLabel: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

function ImageUploadDropzone({
  title,
  hint,
  accept,
  fileName,
  previewUrl,
  previewAlt,
  buttonLabel,
  onFileChange,
  onClear,
}: ImageUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border border-dashed border-bramasta-ink/45 hover:border-bramasta-accent rounded-md p-4 bg-paper transition-colors">
      {previewUrl ? (
        <div className="flex items-center gap-3.5">
          <img
            src={previewUrl}
            alt={previewAlt}
            className="w-16 h-16 object-contain border border-paper-deep bg-paper-light p-1 rounded-sm shrink-0"
          />
          <div className="min-w-0 flex-1 text-left">
            <p className="font-jakarta font-semibold text-sm text-bramasta-ink truncate">
              {fileName || "Berkas terpilih"}
            </p>
            <p className="font-jakarta text-[13px] font-medium text-[#2F6B3F] mt-0.5">
              Berkas siap diunggah
            </p>
            <button
              type="button"
              onClick={onClear}
              className={`mt-1.5 min-h-[36px] inline-flex items-center font-jakarta text-[13px] font-semibold text-[#9B2C2C] hover:underline cursor-pointer ${FOCUS_RING_CLASS}`}
            >
              Hapus / Ganti Berkas
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <Upload className="w-5 h-5 mx-auto mb-1.5 text-bramasta-ink-soft" />
          <p className="font-jakarta font-semibold text-sm text-bramasta-ink">
            {title}
          </p>
          <p className="font-jakarta text-[13px] text-bramasta-ink-soft mt-0.5 mb-3">
            {hint}
          </p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={`inline-flex items-center justify-center min-h-[44px] px-4 py-2 border border-bramasta-ink/60 bg-paper-light font-jakarta font-semibold text-sm text-bramasta-ink hover:bg-bramasta-ink hover:text-bramasta-accent-on rounded-md transition-colors cursor-pointer ${FOCUS_RING_CLASS}`}
          >
            {buttonLabel}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={onFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

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
  const allowedTeamTypes: TeamType[] =
    event?.allowed_team_types && event.allowed_team_types.length > 0
      ? event.allowed_team_types
      : ["school", "club"];

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedBank, setCopiedBank] = useState(false);
  const [isDraftRestored, setIsDraftRestored] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Authenticated user state
  const [loggedInUser, setLoggedInUser] = useState<EvoraUser | null>(null);
  const [gsiRendered, setGsiRendered] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  // Form states
  const [selectedCatId, setSelectedCatId] = useState(initialCategoryId || "");
  const [teamType, setTeamType] = useState<TeamType>(
    allowedTeamTypes[0] || "school"
  );
  const [institutionName, setInstitutionName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coachName, setCoachName] = useState("");
  const [coachPhone, setCoachPhone] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(
    null
  );

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
    if (typeof window === "undefined" || !isOpen || step !== 2 || loggedInUser) {
      setGsiRendered(false);
      return;
    }
    if (!googleClientId) {
      setGsiRendered(false);
      return;
    }

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
          googleBtnRef.current.innerHTML = "";
          const containerWidth = googleBtnRef.current.clientWidth || 300;
          const btnWidth = Math.min(360, Math.max(240, containerWidth));
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "outline",
            size: "large",
            width: btnWidth,
            text: "continue_with",
            shape: "rectangular",
          });
          setGsiRendered(true);
        }
      } catch (e) {
        console.warn("GSI init notice:", e);
        setGsiRendered(false);
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
  }, [isOpen, step, loggedInUser, googleClientId]);

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
        if (data.selectedCatId && !initialCategoryId) {
          setSelectedCatId(data.selectedCatId);
        }
        if (data.teamType && allowedTeamTypes.includes(data.teamType)) {
          setTeamType(data.teamType);
        } else {
          setTeamType(allowedTeamTypes[0] || "school");
        }
        if (data.institutionName || data.schoolName) {
          setInstitutionName(data.institutionName || data.schoolName);
        }
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

  // Pastikan teamType selalu valid terhadap allowedTeamTypes
  useEffect(() => {
    if (!allowedTeamTypes.includes(teamType)) {
      setTeamType(allowedTeamTypes[0] || "school");
    }
  }, [event?.allowed_team_types, teamType]);

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
        teamType,
        institutionName,
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
  }, [
    isOpen,
    selectedCatId,
    teamType,
    institutionName,
    teamName,
    coachName,
    coachPhone,
    authEmail,
    authPassword,
    step,
  ]);

  // Kunci scroll halaman belakang & dukung tombol Escape untuk menutup modal
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "unset";
      return;
    }

    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

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

  const handleImageSelection = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    setPreview: (preview: string | null) => void
  ) => {
    const file = e.target.files?.[0] || null;
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleResetDraft = () => {
    sessionStorage.removeItem(DRAFT_KEY);
    setTeamType(allowedTeamTypes[0] || "school");
    setInstitutionName("");
    setTeamName("");
    setLogoFile(null);
    setLogoPreview(null);
    setCoachName("");
    setCoachPhone("");
    setAuthEmail("");
    setAuthPassword("");
    setPaymentProofFile(null);
    setPaymentProofPreview(null);
    setErrorMessage(null);
    setStep(1);
    setIsDraftRestored(false);
  };

  const handleGoogleFallbackClick = () => {
    if (window.google?.accounts?.id && googleClientId) {
      window.google.accounts.id.prompt();
    } else {
      setErrorMessage(
        "Masuk dengan Google belum aktif pada konfigurasi ini. Silakan isi formulir email dan kata sandi di bawah."
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
    const instTrimmed = institutionName.trim();
    const instLabel = teamType === "club" ? "Nama Club" : "Nama Sekolah";
    if (instTrimmed.length < 2) {
      setErrorMessage(`${instLabel} wajib diisi minimal 2 karakter.`);
      return;
    }
    if (instTrimmed.length > 150) {
      setErrorMessage(`${instLabel} maksimal 150 karakter.`);
      return;
    }
    if (!teamName.trim()) {
      setErrorMessage("Silakan masukkan nama tim Anda.");
      return;
    }
    setStep(2);
  };

  // Validasi & Autentikasi Step 2 (Memastikan Akun Terverifikasi Sebelum ke Step 3)
  const handleNextStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!coachPhone.trim()) {
      setErrorMessage("Silakan isi nomor WhatsApp yang aktif.");
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
        setErrorMessage(
          err.message ||
            "Email atau kata sandi tidak cocok. Silakan periksa kembali."
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    // Kasus 2: Pendaftaran Akun Baru (Wajib Validasi Password)
    if (!coachName.trim()) {
      setErrorMessage("Silakan isi nama lengkap pembina atau penanggung jawab tim.");
      return;
    }

    const pwdVal = validatePassword(authPassword);
    if (!pwdVal.isValid) {
      setErrorMessage(
        pwdVal.errorMessage || "Kata sandi belum memenuhi kriteria keamanan."
      );
      return;
    }

    setLoading(true);
    try {
      try {
        await registerParticipant(
          coachName.trim(),
          authEmail.trim(),
          authPassword
        );
      } catch (regErr: any) {
        const msg = regErr.message?.toLowerCase() || "";
        if (
          msg.includes("already") ||
          msg.includes("terdaftar") ||
          msg.includes("exists")
        ) {
          // Jika email sudah ada, coba langsung login dengan kredensial ini
          try {
            const loginRes = await loginParticipant(
              authEmail.trim(),
              authPassword
            );
            setLoggedInUser(loginRes.user);
            setStep(3);
            return;
          } catch {
            throw new Error(
              "Email ini sudah terdaftar. Aktifkan opsi 'Sudah punya akun?' atau periksa kata sandi Anda."
            );
          }
        } else {
          throw regErr;
        }
      }

      const loginRes = await loginParticipant(authEmail.trim(), authPassword);
      setLoggedInUser(loginRes.user);
      setStep(3);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal memproses pembuatan akun.");
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
        setErrorMessage(
          "Sesi login Anda tidak ditemukan. Silakan kembali ke langkah sebelumnya untuk masuk."
        );
        setStep(2);
        return;
      }

      // 1. Upload Logo Tim / Lambang Sekolah jika dilampirkan
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
          console.warn(
            "Upload logo tim gagal, lanjut pendaftaran tim:",
            uploadErr
          );
        }
      }

      // 2. Upload Bukti Transfer jika dilampirkan
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
          console.warn(
            "Upload bukti bayar gagal, lanjut pendaftaran tim:",
            uploadErr
          );
        }
      }

      // 3. Pendaftaran Tim Resmi
      const teamRes = await registerTeam({
        category_id: selectedCatId,
        team_name: teamName.trim(),
        team_type: teamType,
        institution_name: institutionName.trim(),
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
        team_type: teamType,
        institution_name: institutionName.trim(),
        logo_url: logoUrl || null,
        coach_name: coachName.trim() || activeUser.full_name,
        coach_phone: coachPhone.trim(),
        status: (teamRes.status as EvoraTeam["status"]) || "submitted",
        category: categories.find((c) => c.id === selectedCatId),
        payment_proof_url: paymentProofUrl,
        members: [],
      };

      onSuccess(registeredTeam, activeUser);
      onClose();
    } catch (err: any) {
      setErrorMessage(
        err.message || "Gagal memproses pendaftaran tim. Periksa koneksi Anda."
      );
    } finally {
      setLoading(false);
    }
  };

  const activeFormId = `wizard-step-${step}`;
  const passwordRules = [
    { ok: pwdCheck.hasMinLen, label: "Minimal 8 karakter" },
    { ok: pwdCheck.hasUpper, label: "1 huruf besar (A–Z)" },
    { ok: pwdCheck.hasLower, label: "1 huruf kecil (a–z)" },
    { ok: pwdCheck.hasNumber, label: "1 angka (0–9)" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wizard-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-bramasta-ink/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="font-jakarta bg-paper-light border-2 border-bramasta-ink shadow-[0_2px_0_#B5AD73,0_16px_40px_rgba(20,18,16,0.28)] rounded-xl max-w-lg w-full max-h-[92vh] flex flex-col relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER MODAL & STEPPER EDITORIAL ── */}
        <div className="px-4 sm:px-6 pt-4 pb-3.5 bg-paper border-b border-paper-deep shrink-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <span className="font-jakarta font-bold text-xs uppercase tracking-[0.14em] text-bramasta-accent block">
                Langkah {step} dari 3 · Pendaftaran Tim
              </span>
              <h2
                id="wizard-title"
                className="font-bodoni font-bold text-xl sm:text-2xl uppercase tracking-tight text-bramasta-ink mt-0.5 leading-tight"
              >
                {STEP_META[step].title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center border border-bramasta-ink/50 bg-paper-light text-bramasta-ink hover:bg-bramasta-ink hover:text-bramasta-accent-on rounded-md transition-colors cursor-pointer shrink-0 ${FOCUS_RING_CLASS}`}
              aria-label="Tutup pendaftaran"
              title="Tutup (draf tersimpan otomatis)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Bar (Non-tombol agar tidak membingungkan user) */}
          <div className="grid grid-cols-3 gap-2" aria-label="Progres pendaftaran">
            {([1, 2, 3] as const).map((s) => {
              const isActive = step === s;
              const isDone = step > s;
              return (
                <div key={s} className="space-y-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-colors ${
                      isActive || isDone
                        ? "bg-bramasta-accent"
                        : "bg-paper-deep"
                    }`}
                  />
                  <div className="flex items-center gap-1.5">
                    {isDone && (
                      <Check
                        className="w-3.5 h-3.5 text-[#2F6B3F] shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={`font-jakarta text-xs sm:text-[13px] truncate ${
                        isActive
                          ? "font-bold text-bramasta-accent"
                          : isDone
                          ? "font-semibold text-bramasta-ink"
                          : "font-medium text-bramasta-ink-soft"
                      }`}
                    >
                      {s}. {STEP_META[s].shortLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifikasi Draf Dipulihkan */}
        {isDraftRestored && (
          <div className="px-4 sm:px-6 py-2 bg-paper-dark border-b border-paper-deep flex items-center justify-between gap-2 text-[13px] font-jakarta text-bramasta-ink shrink-0">
            <span className="font-medium">
              Draf pendaftaran Anda dipulihkan otomatis.
            </span>
            <button
              type="button"
              onClick={handleResetDraft}
              className={`min-h-[36px] px-2 inline-flex items-center gap-1 font-semibold text-bramasta-accent underline hover:text-[#9B2C2C] cursor-pointer shrink-0 ${FOCUS_RING_CLASS}`}
              title="Mulai ulang formulir dari awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        )}

        {/* Alert Error */}
        {errorMessage && (
          <div
            role="alert"
            className="px-4 sm:px-6 py-3 bg-[#9B2C2C] text-bramasta-accent-on font-jakarta text-sm border-b border-bramasta-ink flex items-start gap-2.5 shrink-0"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-bramasta-accent-on" />
            <p className="leading-snug font-medium">{errorMessage}</p>
          </div>
        )}

        {/* ── KONTEN STEP BY STEP (SCROLLABLE) ── */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
          {/* ───────────────── LANGKAH 1: KATEGORI & TIM ───────────────── */}
          {step === 1 && (
            <form
              id="wizard-step-1"
              onSubmit={handleNextStep1}
              className="space-y-4"
            >
              {/* 1. Pilihan Kategori */}
              <div>
                <label className={LABEL_CLASS}>1. Kategori Perlombaan</label>
                {categories.length === 0 ? (
                  <div className="p-3.5 bg-paper border border-paper-deep rounded-md text-sm font-jakarta text-bramasta-ink-soft text-center">
                    Memuat kategori lomba...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {categories.map((c) => {
                      const remaining = Math.max(0, c.slot_count - c.slot_taken);
                      const isSelected = selectedCatId === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedCatId(c.id)}
                          aria-pressed={isSelected}
                          className={`w-full min-h-[48px] p-3.5 rounded-md cursor-pointer transition-all text-left flex items-center justify-between gap-3 ${FOCUS_RING_CLASS} ${
                            isSelected
                              ? "bg-paper border-2 border-bramasta-accent shadow-sm"
                              : "bg-paper border border-paper-deep hover:border-bramasta-ink/60"
                          }`}
                        >
                          <div className="min-w-0">
                            <span className="font-jakarta font-bold text-sm sm:text-base text-bramasta-ink block">
                              {c.name}
                            </span>
                            <span className="font-jakarta text-[13px] text-bramasta-ink-soft block mt-0.5 tabular-nums">
                              {c.min_team_members}–{c.max_team_members} anggota
                              (termasuk danton)
                            </span>
                          </div>
                          <span
                            className={`px-2.5 py-1 font-jakarta font-semibold text-xs rounded-full shrink-0 tabular-nums ${
                              isSelected
                                ? "bg-bramasta-accent text-bramasta-accent-on"
                                : "bg-bramasta-accent-soft text-bramasta-accent"
                            }`}
                          >
                            {remaining} slot
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. Pilihan Jenis Tim (Sekolah / Club) */}
              <div>
                <label className={LABEL_CLASS}>2. Jenis Tim</label>
                {allowedTeamTypes.length > 1 ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    {(
                      [
                        {
                          value: "school" as TeamType,
                          label: "Sekolah",
                          desc: "Satuan Paskibra sekolah",
                        },
                        {
                          value: "club" as TeamType,
                          label: "Club",
                          desc: "Club / komunitas independen",
                        },
                      ] as const
                    )
                      .filter((opt) => allowedTeamTypes.includes(opt.value))
                      .map((opt) => {
                        const isSelected = teamType === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setTeamType(opt.value)}
                            aria-pressed={isSelected}
                            className={`min-h-[56px] p-3 rounded-md text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${FOCUS_RING_CLASS} ${
                              isSelected
                                ? "bg-paper border-2 border-bramasta-accent shadow-sm"
                                : "bg-paper border border-paper-deep hover:border-bramasta-ink/60"
                            }`}
                          >
                            <div>
                              <span className="font-jakarta font-bold text-sm sm:text-base text-bramasta-ink block leading-tight">
                                {opt.label}
                              </span>
                              <span className="font-jakarta text-xs text-bramasta-ink-soft block mt-0.5 leading-snug">
                                {opt.desc}
                              </span>
                            </div>
                            <span
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? "bg-bramasta-accent border-bramasta-accent text-bramasta-accent-on"
                                  : "border-bramasta-ink/40 bg-paper-light"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                ) : (
                  <div className="p-3 border border-paper-deep bg-paper rounded-md flex items-center justify-between">
                    <span className="font-jakarta text-sm text-bramasta-ink-soft">
                      Jenis tim pada event ini:
                    </span>
                    <span className="px-3 py-1 bg-bramasta-accent-soft text-bramasta-accent font-jakarta font-semibold text-xs uppercase rounded-full">
                      {teamType === "club" ? "Club" : "Sekolah"}
                    </span>
                  </div>
                )}
              </div>

              {/* 3. Nama Sekolah / Nama Club */}
              <div>
                <label htmlFor="wizard-institution-name" className={LABEL_CLASS}>
                  3. {teamType === "club" ? "Nama Club" : "Nama Sekolah"}
                </label>
                <input
                  id="wizard-institution-name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={150}
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder={
                    teamType === "club"
                      ? "Contoh: Garuda Muda Club"
                      : "Contoh: SMAN 2 Mengwi"
                  }
                  className={INPUT_CLASS}
                />
              </div>

              {/* 4. Nama Tim */}
              <div>
                <label htmlFor="wizard-team-name" className={LABEL_CLASS}>
                  4. Nama Tim
                </label>
                <input
                  id="wizard-team-name"
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder={
                    teamType === "club"
                      ? "Contoh: Garuda Muda A"
                      : "Contoh: Peleton A - Yudhistira"
                  }
                  className={INPUT_CLASS}
                />
                <span className="font-jakarta text-[13px] text-bramasta-ink-soft mt-1 block">
                  Ditampilkan di daftar peserta, papan lomba, dan sertifikat.
                </span>
              </div>

              {/* 5. Logo Tim (Opsional) */}
              <div>
                <label className={LABEL_CLASS}>
                  5. Logo Tim / {teamType === "club" ? "Club" : "Sekolah"}{" "}
                  <span className="text-bramasta-ink-soft font-normal">
                    (Opsional)
                  </span>
                </label>
                <ImageUploadDropzone
                  title="Unggah Logo Tim"
                  hint="Format PNG, JPG, atau JPEG · Maks. 1 MB"
                  accept="image/png,image/jpeg,image/jpg"
                  fileName={logoFile?.name}
                  previewUrl={logoPreview}
                  previewAlt="Preview Logo Tim"
                  buttonLabel="Pilih File Logo"
                  onFileChange={(e) =>
                    handleImageSelection(e, setLogoFile, setLogoPreview)
                  }
                  onClear={() => {
                    setLogoFile(null);
                    setLogoPreview(null);
                  }}
                />
              </div>
            </form>
          )}

          {/* ───────────────── LANGKAH 2: PEMBINA & AKUN ───────────────── */}
          {step === 2 && (
            <form
              id="wizard-step-2"
              onSubmit={handleNextStep2}
              className="space-y-4"
            >
              {/* KONDISI 1: Pembina SUDAH Terverifikasi */}
              {loggedInUser ? (
                <div className="bg-paper border border-paper-deep rounded-md p-4 space-y-4">
                  <div className="flex items-center justify-between pb-2.5 border-b border-paper-deep">
                    <div className="flex items-center gap-2 text-[#2F6B3F]">
                      <ShieldCheck className="w-5 h-5 shrink-0" />
                      <span className="font-jakarta font-bold text-sm">
                        Akun Terhubung
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logoutParticipant();
                        setLoggedInUser(null);
                      }}
                      className={`min-h-[36px] px-2 font-jakarta text-[13px] font-semibold text-bramasta-accent hover:text-[#9B2C2C] underline cursor-pointer ${FOCUS_RING_CLASS}`}
                    >
                      Ganti Akun
                    </button>
                  </div>

                  <div className="font-jakarta bg-paper-light border border-paper-deep rounded-sm p-3">
                    <span className="text-bramasta-ink-soft block text-xs uppercase tracking-wider font-medium">
                      Identitas Terverifikasi
                    </span>
                    <span className="font-bold block text-base text-bramasta-ink mt-0.5">
                      {loggedInUser.full_name}
                    </span>
                    <span className="text-sm text-bramasta-ink-soft block">
                      {loggedInUser.email}
                    </span>
                  </div>

                  <div>
                    <label htmlFor="wizard-phone-auth" className={LABEL_CLASS}>
                      Nomor WhatsApp Aktif
                    </label>
                    <input
                      id="wizard-phone-auth"
                      type="tel"
                      required
                      value={coachPhone}
                      onChange={(e) => setCoachPhone(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
              ) : (
                /* KONDISI 2: Belum Login -> Pilihan Google atau Form Email */
                <div className="space-y-4">
                  {/* Tombol Cepat Google Sign-In */}
                  <div>
                    <span className={LABEL_CLASS}>Masuk Cepat (1 Klik)</span>
                    <div className="space-y-2">
                      {googleClientId && (
                        <div
                          ref={googleBtnRef}
                          className="w-full flex justify-center min-h-[44px]"
                        />
                      )}
                      {!gsiRendered && (
                        <button
                          type="button"
                          onClick={handleGoogleFallbackClick}
                          className={`w-full min-h-[48px] flex items-center justify-center gap-2.5 py-3 px-4 border border-bramasta-ink/60 bg-paper-light hover:bg-paper transition-colors font-jakarta font-semibold text-sm text-bramasta-ink rounded-md cursor-pointer ${FOCUS_RING_CLASS}`}
                        >
                          <svg
                            className="w-4 h-4 shrink-0"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
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
                      )}

                      <div className="relative flex py-1.5 items-center">
                        <div className="flex-grow border-t border-paper-deep" />
                        <span className="shrink-0 mx-3 font-jakarta text-xs font-medium text-bramasta-ink-soft">
                          atau isi data akun manual
                        </span>
                        <div className="flex-grow border-t border-paper-deep" />
                      </div>
                    </div>
                  </div>

                  {/* Form Email & Password Manual */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-jakarta font-bold text-sm text-bramasta-ink">
                        {isExistingAccount
                          ? "Masuk ke Akun Pembina"
                          : "Buat Akun Pembina"}
                      </span>
                      <label className="inline-flex items-center gap-2 min-h-[36px] text-[13px] font-jakarta font-semibold cursor-pointer text-bramasta-accent">
                        <input
                          type="checkbox"
                          checked={isExistingAccount}
                          onChange={(e) =>
                            setIsExistingAccount(e.target.checked)
                          }
                          className="accent-bramasta-accent w-4 h-4 cursor-pointer"
                        />
                        <span>Sudah punya akun?</span>
                      </label>
                    </div>

                    {!isExistingAccount && (
                      <div>
                        <label
                          htmlFor="wizard-coach-name"
                          className={LABEL_CLASS}
                        >
                          Nama Lengkap Pembina / Pelatih
                        </label>
                        <input
                          id="wizard-coach-name"
                          type="text"
                          required
                          value={coachName}
                          onChange={(e) => setCoachName(e.target.value)}
                          placeholder="Contoh: I Putu Adnyana, S.Pd."
                          className={INPUT_CLASS}
                        />
                      </div>
                    )}

                    <div>
                      <label htmlFor="wizard-phone" className={LABEL_CLASS}>
                        Nomor WhatsApp Aktif
                      </label>
                      <input
                        id="wizard-phone"
                        type="tel"
                        required
                        value={coachPhone}
                        onChange={(e) => setCoachPhone(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div>
                      <label htmlFor="wizard-email" className={LABEL_CLASS}>
                        Alamat Email Aktif
                      </label>
                      <input
                        id="wizard-email"
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder={
                          teamType === "club"
                            ? "official@clubanda.id"
                            : "pembina@sekolah.sch.id"
                        }
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div>
                      <label htmlFor="wizard-password" className={LABEL_CLASS}>
                        {isExistingAccount
                          ? "Kata Sandi Akun"
                          : "Buat Kata Sandi"}
                      </label>
                      <div className="relative">
                        <input
                          id="wizard-password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder={
                            isExistingAccount
                              ? "Masukkan kata sandi akun Anda"
                              : "Minimal 8 karakter"
                          }
                          className={`${INPUT_CLASS} pr-12`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={
                            showPassword
                              ? "Sembunyikan kata sandi"
                              : "Tampilkan kata sandi"
                          }
                          className={`absolute right-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-bramasta-ink-soft hover:text-bramasta-ink rounded-sm cursor-pointer ${FOCUS_RING_CLASS}`}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Checklist Validasi Password Real-Time */}
                      {!isExistingAccount && (
                        <div className="mt-2.5 p-3 bg-paper border border-paper-deep rounded-md font-jakarta">
                          <span className="font-semibold text-xs uppercase tracking-wider text-bramasta-ink-soft block mb-2">
                            Syarat Kata Sandi:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[13px]">
                            {passwordRules.map((rule) => (
                              <div
                                key={rule.label}
                                className={`flex items-center gap-2 ${
                                  rule.ok
                                    ? "text-[#2F6B3F] font-semibold"
                                    : "text-bramasta-ink-soft"
                                }`}
                              >
                                {rule.ok ? (
                                  <Check className="w-4 h-4 text-[#2F6B3F] shrink-0" />
                                ) : (
                                  <Circle className="w-3.5 h-3.5 text-bramasta-ink-mute shrink-0" />
                                )}
                                <span>{rule.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* ───────────────── LANGKAH 3: BIAYA & BUKTI BAYAR ───────────────── */}
          {step === 3 && (
            <form
              id="wizard-step-3"
              onSubmit={handleFinalSubmit}
              className="space-y-4"
            >
              {/* Kartu Informasi Rekening Resmi */}
              <div className="border border-paper-deep bg-paper rounded-md p-4 space-y-3">
                <div className="flex justify-between items-baseline gap-3">
                  <span className="font-jakarta font-semibold text-sm text-bramasta-ink-soft">
                    Biaya Pendaftaran
                  </span>
                  <span className="font-bodoni font-bold text-2xl text-bramasta-ink tabular-nums">
                    {feeFormatted}
                  </span>
                </div>

                <div className="border-t border-paper-deep" />

                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-jakarta font-semibold text-sm text-bramasta-ink block">
                      Transfer Bank {bankName}
                    </span>
                    <span className="font-jakarta font-bold text-lg text-bramasta-ink block mt-0.5 tracking-wide tabular-nums">
                      {accountNumber}
                    </span>
                    <span className="font-jakarta text-[13px] text-bramasta-ink-soft block mt-0.5">
                      a.n. {accountHolder}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className={`min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 border border-bramasta-ink/60 bg-paper-light hover:bg-bramasta-ink hover:text-bramasta-accent-on rounded-md transition-colors text-sm font-jakarta font-semibold cursor-pointer shrink-0 ${FOCUS_RING_CLASS}`}
                    title="Salin nomor rekening ke clipboard"
                  >
                    {copiedBank ? (
                      <Check className="w-4 h-4 text-[#2F6B3F]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copiedBank ? "Tersalin" : "Salin"}</span>
                  </button>
                </div>
              </div>

              {/* Upload Bukti Pembayaran (Dropzone seragam) */}
              <div>
                <label className={LABEL_CLASS}>
                  Unggah Bukti Transfer{" "}
                  <span className="text-bramasta-ink-soft font-normal">
                    (Opsional)
                  </span>
                </label>
                <ImageUploadDropzone
                  title="Unggah Bukti Transfer"
                  hint="Format PNG atau JPG · Maks. 1 MB"
                  accept="image/*"
                  fileName={paymentProofFile?.name}
                  previewUrl={paymentProofPreview}
                  previewAlt="Preview Bukti Transfer"
                  buttonLabel="Pilih Bukti Bayar"
                  onFileChange={(e) =>
                    handleImageSelection(
                      e,
                      setPaymentProofFile,
                      setPaymentProofPreview
                    )
                  }
                  onClear={() => {
                    setPaymentProofFile(null);
                    setPaymentProofPreview(null);
                  }}
                />
                <p className="font-jakarta text-[13px] text-bramasta-ink-soft mt-2 leading-relaxed">
                  Bukti transfer dapat diunggah atau diganti nanti melalui
                  Dashboard Tim sebelum verifikasi pendaftaran ditutup panitia.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* ── STICKY FOOTER NAVIGASI ── */}
        <div className="px-4 sm:px-6 py-3.5 bg-paper border-t border-paper-deep flex items-center gap-2.5 shrink-0">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((step - 1) as 1 | 2)}
              disabled={loading}
              aria-label="Kembali ke langkah sebelumnya"
              className={`min-w-[48px] min-h-[48px] px-4 border border-bramasta-ink/60 bg-paper-light text-bramasta-ink font-jakarta font-semibold text-sm hover:bg-paper-dark rounded-md transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50 ${FOCUS_RING_CLASS}`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            form={activeFormId}
            disabled={loading}
            className={`flex-1 min-h-[48px] py-3 px-5 bg-bramasta-accent text-bramasta-accent-on font-jakarta font-bold text-sm sm:text-[15px] uppercase tracking-[0.06em] hover:bg-bramasta-accent-hover transition-all rounded-md shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:translate-y-px ${FOCUS_RING_CLASS}`}
          >
            {step === 1 && (
              <>
                <span>Lanjut ke Akun Pembina</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
            {step === 2 && (
              <>
                <span>
                  {loading ? "Memverifikasi..." : "Lanjut ke Pembayaran"}
                </span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </>
            )}
            {step === 3 && (
              <>
                <span>
                  {loading
                    ? "Menyimpan Tim..."
                    : "Selesaikan & Masuk Dashboard"}
                </span>
                {!loading && <Check className="w-4 h-4" />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
