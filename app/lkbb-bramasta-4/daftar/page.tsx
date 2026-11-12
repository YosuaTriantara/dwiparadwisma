"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  LogOut,
  Plus,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Users,
  Copy,
  Check,
  ChevronRight,
  LogIn,
  Eye,
  EyeOff,
  User,
  Upload,
  Pencil,
} from "lucide-react";
import { StatusBadge } from "@/components/bramasta/ui/StatusBadge";
import { PhotoPreviewModal } from "@/components/bramasta/ui/PhotoPreviewModal";
import { RegistrationWizardModal } from "@/components/bramasta/registration/RegistrationWizardModal";
import {
  TeamMemberModal,
  type MemberModalMode,
} from "@/components/bramasta/registration/TeamMemberModal";
import {
  loginParticipant,
  loginWithGoogle,
  getCurrentUser,
  logoutParticipant,
} from "@/lib/evora/auth";
import { EvoraApiError } from "@/lib/evora/client";
import { getEventCategories, getEventDetail } from "@/lib/evora/events";
import {
  getMyTeams,
  getTeamDetail,
  submitTeamRoster,
  unsubmitTeamRoster,
  updateTeam,
} from "@/lib/evora/teams";
import { deleteTeamMember } from "@/lib/evora/members";
import { uploadFileBase64, fileToBase64 } from "@/lib/evora/upload";
import type {
  EvoraCategory,
  EvoraEvent,
  EvoraTeam,
  EvoraTeamMember,
  EvoraUser,
  RoleInTeam,
  TeamType,
} from "@/types/evora";

const INPUT_CLASS =
  "w-full min-h-[48px] px-3.5 py-2.5 bg-paper-light border border-bramasta-ink/50 rounded-sm font-jakarta text-base text-bramasta-ink placeholder:text-bramasta-ink-mute focus:outline-none focus:border-bramasta-accent focus:ring-2 focus:ring-bramasta-accent/25 transition-colors";

const LABEL_CLASS =
  "block font-jakarta font-semibold text-sm text-bramasta-ink mb-1.5";

const FOCUS_RING_CLASS =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-bramasta-accent focus-visible:outline-offset-2";

const ROLE_LABELS: Record<RoleInTeam, string> = {
  leader: "Danton",
  member: "Pasukan",
  coach: "Pelatih",
  official: "Official",
};

function formatQuotaLimit(count: number, max: number | null): string {
  if (max === 0) return `${count} (Maks. 0)`;
  if (max !== null && max !== undefined) return `${count} / ${max}`;
  return `${count} (Tanpa batas)`;
}

function formatSupportLimitPhrase(label: string, max: number | null): string {
  if (max === 0) return `${label} tidak diizinkan (0)`;
  if (max !== null && max !== undefined) return `maks. ${max} ${label}`;
  return `${label} tanpa batas`;
}

export default function BramastaRegistrationPage() {
  const [currentUser, setCurrentUser] = useState<EvoraUser | null>(null);
  const [event, setEvent] = useState<EvoraEvent | null>(null);
  const [categories, setCategories] = useState<EvoraCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Wizard Modal state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [initialCategoryParam, setInitialCategoryParam] = useState<string>("");

  // Standalone Login form state
  const [isLoginTab, setIsLoginTab] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [gsiRendered, setGsiRendered] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  useEffect(() => {
    if (typeof window === "undefined" || !isLoginTab || currentUser) {
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
              setCurrentUser(authRes.user);
              setSuccessMessage(
                `Selamat datang kembali, ${authRes.user.full_name}.`
              );
              setIsLoginTab(false);
              await loadUserData();
            } catch (err: any) {
              setErrorMessage(err.message || "Gagal masuk dengan Google.");
            } finally {
              setLoading(false);
            }
          },
        });

        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = "";
          const containerWidth = googleBtnRef.current.clientWidth || 320;
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
  }, [isLoginTab, currentUser, googleClientId]);

  // Dashboard Tim state
  const [myTeams, setMyTeams] = useState<EvoraTeam[]>([]);
  const [myTeam, setMyTeam] = useState<EvoraTeam | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);
  const [dashboardPaymentProof, setDashboardPaymentProof] =
    useState<File | null>(null);
  const [dashboardPaymentPreview, setDashboardPaymentPreview] = useState<
    string | null
  >(null);
  const [isEditingPaymentProof, setIsEditingPaymentProof] = useState(false);
  const paymentInputRef = useRef<HTMLInputElement>(null);

  // Revisi Identitas Tim state (saat status === "registration_rejected")
  const [revTeamName, setRevTeamName] = useState("");
  const [revTeamType, setRevTeamType] = useState<TeamType>("school");
  const [revInstitutionName, setRevInstitutionName] = useState("");

  // Modal terpadu anggota tim (lihat detail / edit / tambah)
  const [memberModal, setMemberModal] = useState<{
    mode: MemberModalMode;
    member?: EvoraTeamMember | null;
    number?: number;
  } | null>(null);

  // Modal pratinjau foto (Bukti transfer & pas foto kandidat)
  const [photoPreviewModal, setPhotoPreviewModal] = useState<{
    imageUrl: string;
    title: string;
    subtitle?: string;
  } | null>(null);

  useEffect(() => {
    let modeParam: string | null = null;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("category");
      if (catParam) {
        setInitialCategoryParam(catParam);
      }
      modeParam = params.get("mode");
    }

    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else if (modeParam === "login") {
      setIsLoginTab(true);
    } else {
      setIsWizardOpen(true);
    }

    async function initPage() {
      const ev = await loadData();
      if (user) {
        await loadUserData(ev);
      }
    }
    initPage();
  }, []);

  async function loadData(): Promise<EvoraEvent | null> {
    try {
      const [cats, ev] = await Promise.all([
        getEventCategories(),
        getEventDetail(),
      ]);
      setCategories(cats);
      setEvent(ev);
      return ev;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  function syncTeamDependentState(team: EvoraTeam) {
    setRevTeamName(team.team_name || "");
    setRevTeamType((team.team_type as TeamType) || "school");
    setRevInstitutionName(
      team.institution_name || team.school_name || team.school || ""
    );
    setIsEditingPaymentProof(false);
    setDashboardPaymentProof(null);
    setDashboardPaymentPreview(null);
  }

  async function selectActiveTeam(teamId: string) {
    setLoading(true);
    try {
      const fullTeam = await getTeamDetail(teamId);
      setMyTeam(fullTeam);
      syncTeamDependentState(fullTeam);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal memuat detail tim.");
    } finally {
      setLoading(false);
    }
  }

  async function loadUserData(
    activeEvent: EvoraEvent | null = event,
    preferredTeamId?: string
  ) {
    setIsLoadingDashboard(true);
    try {
      const teams = await getMyTeams();
      const filteredTeams = activeEvent?.id
        ? teams.filter((t) => !t.event?.id || t.event.id === activeEvent.id)
        : teams;

      setMyTeams(filteredTeams);

      if (filteredTeams.length > 0) {
        const targetId =
          preferredTeamId && filteredTeams.some((t) => t.id === preferredTeamId)
            ? preferredTeamId
            : filteredTeams[0].id;
        const fullTeam = await getTeamDetail(targetId);
        setMyTeam(fullTeam);
        syncTeamDependentState(fullTeam);
      } else {
        setMyTeam(null);
      }
    } catch (err: any) {
      if (err instanceof EvoraApiError && err.status === 401) {
        logoutParticipant();
        setCurrentUser(null);
        setMyTeams([]);
        setMyTeam(null);
        setIsLoginTab(true);
        setErrorMessage(
          "Sesi login Anda telah berakhir. Silakan masuk kembali untuk mengakses dashboard tim."
        );
      } else {
        console.error(err);
      }
    } finally {
      setIsLoadingDashboard(false);
    }
  }

  // Handle Standalone Login
  async function handleStandaloneLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await loginParticipant(loginEmail, loginPassword);
      setCurrentUser(res.user);
      setSuccessMessage(`Selamat datang kembali, ${res.user.full_name}.`);
      setIsLoginTab(false);
      await loadUserData();
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          "Email atau kata sandi tidak valid. Silakan coba kembali."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logoutParticipant();
    setCurrentUser(null);
    setMyTeams([]);
    setMyTeam(null);
    setSuccessMessage("Anda telah keluar dari akun.");
  }

  // Callback ketika pendaftaran via Wizard sukses
  function handleWizardSuccess(team: EvoraTeam, user: EvoraUser) {
    setCurrentUser(user);
    setMyTeam(team);
    syncTeamDependentState(team);
    setSuccessMessage(
      `Pendaftaran tim "${team.team_name}" berhasil! Selamat datang di Dashboard Tim.`
    );
    setIsWizardOpen(false);
    loadUserData(event, team.id);
  }

  // Handle Revisi Identitas Tim (Saat status registration_rejected)
  async function handleReviseTeamIdentity(e: React.FormEvent) {
    e.preventDefault();
    if (!myTeam) return;
    setErrorMessage(null);

    const instTrimmed = revInstitutionName.trim();
    const instLabel = revTeamType === "club" ? "Nama Club" : "Nama Sekolah";
    if (instTrimmed.length < 2) {
      setErrorMessage(`${instLabel} minimal 2 karakter.`);
      return;
    }
    if (!revTeamName.trim()) {
      setErrorMessage("Nama tim wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      await updateTeam(myTeam.id, {
        team_name: revTeamName.trim(),
        team_type: revTeamType,
        institution_name: instTrimmed,
      });
      const refreshed = await getTeamDetail(myTeam.id);
      setMyTeam(refreshed);
      syncTeamDependentState(refreshed);
      setSuccessMessage("Identitas tim berhasil diperbarui dan dikirim ulang.");
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal memperbarui identitas tim.");
    } finally {
      setLoading(false);
    }
  }

  const handleDashboardPaymentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    setDashboardPaymentProof(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        setDashboardPaymentPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setDashboardPaymentPreview(null);
    }
  };

  // Handle Upload / Update Bukti Pembayaran dari dalam Dashboard
  async function handleUploadPaymentProofDashboard(e: React.FormEvent) {
    e.preventDefault();
    if (!myTeam || !dashboardPaymentProof) return;
    setErrorMessage(null);
    setLoading(true);
    const wasUpdate = !!myTeam.payment_proof_url;

    try {
      const base64 = await fileToBase64(dashboardPaymentProof);
      const uploaded = await uploadFileBase64(
        base64,
        dashboardPaymentProof.name,
        "/evora/events/payment"
      );
      await updateTeam(myTeam.id, {
        payment_proof_url: uploaded.url,
      });

      const refreshed = await getTeamDetail(myTeam.id);
      setMyTeam(refreshed);
      setSuccessMessage(
        wasUpdate
          ? "Foto bukti transfer berhasil diperbarui!"
          : "Bukti pembayaran berhasil diunggah! Menunggu konfirmasi panitia."
      );
      setIsEditingPaymentProof(false);
      setDashboardPaymentProof(null);
      setDashboardPaymentPreview(null);
      if (paymentInputRef.current) paymentInputRef.current.value = "";
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal mengunggah bukti pembayaran.");
    } finally {
      setLoading(false);
    }
  }

  // Refresh daftar tim setelah anggota berhasil ditambahkan atau diperbarui via modal
  async function handleMemberSaved(
    savedMember: EvoraTeamMember,
    isEdit: boolean
  ) {
    if (!myTeam) return;
    setSuccessMessage(
      isEdit
        ? `Data anggota "${savedMember.full_name}" berhasil diperbarui.`
        : `Anggota "${savedMember.full_name}" berhasil ditambahkan.`
    );
    const refreshed = await getTeamDetail(myTeam.id);
    setMyTeam(refreshed);
  }

  // Handle Hapus Anggota
  async function handleDeleteMember(memberId: string, fullName: string) {
    if (!myTeam || !confirm(`Hapus "${fullName}" dari susunan anggota tim?`))
      return;
    setLoading(true);
    try {
      await deleteTeamMember(myTeam.id, memberId);
      const refreshed = await getTeamDetail(myTeam.id);
      setMyTeam(refreshed);
      setMemberModal((prev) =>
        prev?.member?.id === memberId ? null : prev
      );
      setSuccessMessage(`Anggota "${fullName}" dihapus dari tim.`);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal menghapus anggota tim.");
    } finally {
      setLoading(false);
    }
  }

  // Handle Kunci / Buka Roster
  async function handleSubmitRoster() {
    if (!myTeam) return;
    if (
      !confirm(
        "Kunci berkas anggota tim sekarang? Data akan diajukan ke panitia dan dewan juri untuk diverifikasi."
      )
    )
      return;
    setLoading(true);
    try {
      await submitTeamRoster(myTeam.id);
      const refreshed = await getTeamDetail(myTeam.id);
      setMyTeam(refreshed);
      setSuccessMessage("Berkas anggota tim berhasil dikunci dan diajukan!");
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal mengajukan anggota tim.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUnsubmitRoster() {
    if (!myTeam) return;
    setLoading(true);
    try {
      await unsubmitTeamRoster(myTeam.id);
      const refreshed = await getTeamDetail(myTeam.id);
      setMyTeam(refreshed);
      setSuccessMessage(
        "Kuncian anggota dibuka. Anda dapat memperbarui susunan anggota tim."
      );
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal membuka kuncian anggota tim.");
    } finally {
      setLoading(false);
    }
  }

  const isLocked =
    myTeam?.status === "roster_submitted" || myTeam?.status === "verified";
  const minMembers = myTeam?.category?.min_team_members || 13;
  const maxMembers = myTeam?.category?.max_team_members || 16;

  // Perhitungan terpisah: hanya leader + member yang masuk kuota kategori,
  // sedangkan coach (pelatih) dan official dihitung terpisah terhadap batas event.
  const allMembers = myTeam?.members || [];
  const coreMembers = allMembers.filter(
    (m) => m.role_in_team === "leader" || m.role_in_team === "member"
  );
  const coachMembers = allMembers.filter((m) => m.role_in_team === "coach");
  const officialMembers = allMembers.filter(
    (m) => m.role_in_team === "official"
  );
  const supportMembers = [...coachMembers, ...officialMembers];

  const coreMemberCount = coreMembers.length;
  const coachCount = coachMembers.length;
  const officialCount = officialMembers.length;

  const maxCoaches =
    myTeam?.event?.max_coaches_per_team !== undefined
      ? myTeam.event.max_coaches_per_team
      : event?.max_coaches_per_team ?? null;
  const maxOfficials =
    myTeam?.event?.max_officials_per_team !== undefined
      ? myTeam.event.max_officials_per_team
      : event?.max_officials_per_team ?? null;

  const isCoreUnderMin = coreMemberCount < minMembers;
  const isCoreOverMax = coreMemberCount > maxMembers;
  const isCoreQuotaFulfilled = !isCoreUnderMin && !isCoreOverMax;
  const isCoachOverLimit =
    maxCoaches !== null && maxCoaches !== undefined && coachCount > maxCoaches;
  const isOfficialOverLimit =
    maxOfficials !== null &&
    maxOfficials !== undefined &&
    officialCount > maxOfficials;
  const isRosterReady =
    isCoreQuotaFulfilled && !isCoachOverLimit && !isOfficialOverLimit;

  const memberProgressPct = Math.min(
    100,
    Math.round((coreMemberCount / Math.max(1, minMembers)) * 100)
  );

  const feeFormatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(event?.registration_fee || "300000"));

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

  const canAddMoreTeams =
    !!event?.max_teams_per_user && myTeams.length < event.max_teams_per_user;

  return (
    <div className="max-w-[960px] mx-auto pt-0.5 pb-6 sm:py-2 font-jakarta text-bramasta-ink">
      {/* ── HEADER PORTAL TUNGGAL (BAR NAVIGASI + JUDUL + IDENTITAS AKUN REPRESENTATIF) ── */}
      <header className="mb-4 sm:mb-5 pb-3.5 sm:pb-4 border-b-2 border-bramasta-ink space-y-3">
        {/* Baris 1: Selalu 1 baris rapi — Kembali di kiri, Keluar di kanan */}
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/lkbb-bramasta-4"
            className={`inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 border border-bramasta-ink/50 bg-paper-light hover:bg-bramasta-ink hover:text-bramasta-accent-on rounded-md transition-colors text-xs sm:text-sm font-semibold text-bramasta-ink ${FOCUS_RING_CLASS}`}
            title="Kembali ke Halaman Warta Bramasta"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Warta Bramasta</span>
          </Link>

          {currentUser && (
            <button
              type="button"
              onClick={handleLogout}
              className={`inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 border border-bramasta-ink/50 bg-paper-light text-bramasta-ink font-semibold text-xs sm:text-sm rounded-md hover:bg-[#9B2C2C] hover:border-[#9B2C2C] hover:text-bramasta-accent-on transition-colors cursor-pointer shrink-0 ${FOCUS_RING_CLASS}`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Keluar</span>
            </button>
          )}
        </div>

        {/* Baris 2: Judul Portal + Info Akun Pembina Terpadu */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5">
          <div className="min-w-0">
            <span className="font-jakarta font-bold text-[11px] sm:text-xs uppercase tracking-[0.14em] text-bramasta-accent block">
              Portal Kontingen · LKBB Bramasta 4.0
            </span>
            <h1 className="font-bodoni font-bold text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-bramasta-ink mt-0.5 leading-tight">
              {myTeam
                ? "Dashboard Kontingen Tim"
                : isLoginTab && !currentUser
                ? "Masuk ke Dashboard Tim"
                : "Pendaftaran & Akun Tim"}
            </h1>
          </div>

          {currentUser && (
            <div className="flex items-center gap-2 px-3 py-2 bg-paper-light border border-paper-deep rounded-md sm:max-w-[280px] shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#2F6B3F] shrink-0" />
              <div className="min-w-0 leading-tight">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-bramasta-ink-soft block">
                  Akun Pembina
                </span>
                <span className="text-xs sm:text-[13px] font-bold text-bramasta-ink block truncate">
                  {currentUser.full_name}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── ALERT NOTIFIKASI ── */}
      {errorMessage && (
        <div
          role="alert"
          className="bg-[#9B2C2C] text-bramasta-accent-on p-3.5 rounded-md border border-bramasta-ink mb-4 flex items-start justify-between gap-3 text-sm"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="leading-snug font-medium">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            aria-label="Tutup pemberitahuan"
            className="text-xs font-semibold underline shrink-0 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="bg-[#2F6B3F] text-bramasta-accent-on p-3.5 rounded-md border border-bramasta-ink mb-4 flex items-start justify-between gap-3 text-sm"
        >
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="leading-snug font-medium">{successMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            aria-label="Tutup pesan berhasil"
            className="text-xs font-semibold underline shrink-0 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* ── KONDISI 1: PENGGUNA BELUM LOGIN ATAU BELUM PUNYA TIM ── */}
      {!myTeam ? (
        <div className="space-y-4">
          {isLoadingDashboard ? (
            <div className="bg-paper-light border border-paper-deep rounded-md p-6 text-center max-w-xl mx-auto text-sm text-bramasta-ink-soft">
              Memuat data tim terdaftar Anda...
            </div>
          ) : isLoginTab && !currentUser ? (
            /* Form Login Utama untuk Peserta yang Sudah Terdaftar (?mode=login) */
            <div className="bg-paper-light border-2 border-bramasta-ink rounded-lg p-5 sm:p-7 shadow-[0_2px_0_#B5AD73,0_10px_24px_rgba(20,18,16,0.14)] max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 mb-1">
                <LogIn className="w-4 h-4 text-bramasta-accent" />
                <span className="font-jakarta font-bold text-xs uppercase tracking-[0.14em] text-bramasta-accent">
                  Akses Peserta Terdaftar
                </span>
              </div>
              <h2 className="font-bodoni font-bold text-xl sm:text-2xl uppercase text-bramasta-ink mb-1.5 text-center">
                Masuk ke Akun Tim
              </h2>
              <p className="text-sm text-bramasta-ink-soft mb-5 text-center leading-relaxed">
                Masuk dengan akun Google atau email terdaftar untuk mengelola
                anggota dan status verifikasi tim.
              </p>

              {/* Tombol Cepat Google Sign-In */}
              <div className="mb-4">
                {googleClientId && (
                  <div
                    ref={googleBtnRef}
                    className="w-full flex justify-center min-h-[44px]"
                  />
                )}
                {!gsiRendered && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.google?.accounts?.id && googleClientId) {
                        window.google.accounts.id.prompt();
                      } else {
                        setErrorMessage(
                          "Masuk dengan Google belum aktif pada konfigurasi ini. Silakan gunakan formulir email di bawah."
                        );
                      }
                    }}
                    className={`w-full min-h-[48px] flex items-center justify-center gap-2.5 py-2.5 px-4 border border-bramasta-ink/60 bg-paper hover:bg-paper-dark rounded-md transition-colors font-jakarta font-semibold text-sm text-bramasta-ink cursor-pointer ${FOCUS_RING_CLASS}`}
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
                    <span>Masuk dengan Google</span>
                  </button>
                )}

                <div className="relative flex py-3 items-center">
                  <div className="flex-grow border-t border-paper-deep" />
                  <span className="shrink-0 mx-3 text-xs font-medium text-bramasta-ink-soft">
                    atau masukkan email & kata sandi
                  </span>
                  <div className="flex-grow border-t border-paper-deep" />
                </div>
              </div>

              <form onSubmit={handleStandaloneLogin} className="space-y-3.5">
                <div>
                  <label htmlFor="login-email" className={LABEL_CLASS}>
                    Alamat Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="pembina@email.com"
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className={LABEL_CLASS}>
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      className={`${INPUT_CLASS} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((prev) => !prev)}
                      aria-label={
                        showLoginPassword
                          ? "Sembunyikan kata sandi"
                          : "Tampilkan kata sandi"
                      }
                      className={`absolute right-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-bramasta-ink-soft hover:text-bramasta-ink rounded-sm cursor-pointer ${FOCUS_RING_CLASS}`}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full min-h-[48px] py-3 bg-bramasta-accent text-bramasta-accent-on font-jakarta font-bold text-sm uppercase tracking-[0.06em] hover:bg-bramasta-accent-hover transition-colors rounded-md shadow-sm cursor-pointer disabled:opacity-50 ${FOCUS_RING_CLASS}`}
                >
                  {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
                </button>
              </form>

              <div className="mt-5 pt-3.5 border-t border-paper-deep flex flex-wrap items-center justify-center gap-2 text-sm">
                <span className="text-bramasta-ink-soft">
                  Belum mendaftarkan tim?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginTab(false);
                    setIsWizardOpen(true);
                  }}
                  className={`font-semibold text-bramasta-accent underline hover:text-bramasta-accent-hover cursor-pointer ${FOCUS_RING_CLASS}`}
                >
                  Daftar Tim Baru
                </button>
              </div>
            </div>
          ) : (
            /* Card Masuk ke Pendaftaran Cepat (Wizard) */
            <div className="bg-paper-light border-2 border-bramasta-ink rounded-lg p-5 sm:p-7 shadow-[0_2px_0_#B5AD73,0_10px_24px_rgba(20,18,16,0.14)] text-center max-w-xl mx-auto">
              <span className="font-jakarta font-bold text-xs uppercase tracking-[0.14em] text-bramasta-accent block mb-1">
                Pendaftaran Satu Pintu · 3 Langkah
              </span>
              <h2 className="font-bodoni font-bold text-xl sm:text-2xl uppercase text-bramasta-ink mb-2">
                {currentUser
                  ? "Belum Ada Tim Terdaftar di Event Ini"
                  : "Daftarkan Tim Anda"}
              </h2>
              {currentUser && (
                <p className="text-sm text-bramasta-ink-soft max-w-md mx-auto mb-4 leading-relaxed">
                  Akun Anda sudah masuk sebagai{" "}
                  <span className="font-semibold text-bramasta-ink">
                    {currentUser.full_name}
                  </span>
                  . Silakan lanjutkan mendaftarkan tim untuk LKBB Bramasta 4.0.
                </p>
              )}

              <button
                type="button"
                onClick={() => setIsWizardOpen(true)}
                className={`w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-8 py-3 bg-bramasta-accent text-bramasta-accent-on font-jakarta font-bold text-sm uppercase tracking-[0.06em] hover:bg-bramasta-accent-hover transition-all rounded-md shadow-sm cursor-pointer active:translate-y-px ${FOCUS_RING_CLASS}`}
              >
                <span>Mulai Pendaftaran Tim</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {!currentUser && (
                <div className="mt-5 pt-3.5 border-t border-paper-deep flex items-center justify-center gap-2 text-sm">
                  <span className="text-bramasta-ink-soft">
                    Sudah memiliki akun?
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsLoginTab(true)}
                    className={`font-semibold text-bramasta-accent underline hover:text-bramasta-accent-hover cursor-pointer ${FOCUS_RING_CLASS}`}
                  >
                    Masuk ke Dashboard
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ── KONDISI 2: DASHBOARD KONTINGEN TIM (RINGKAS & LENGKAP) ── */
        <div className="space-y-4 sm:space-y-5">
          {/* Strip Pemilih Tim (Hanya tampil jika pembina punya > 1 tim atau bisa daftar tim lagi) */}
          {(myTeams.length > 1 || canAddMoreTeams) && (
            <div className="bg-paper-light border border-paper-deep rounded-lg p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-bramasta-ink-soft mr-0.5">
                  Tim ({myTeams.length}):
                </span>
                {myTeams.map((teamItem) => {
                  const isActive = teamItem.id === myTeam.id;
                  return (
                    <button
                      key={teamItem.id}
                      type="button"
                      onClick={() => selectActiveTeam(teamItem.id)}
                      disabled={loading || isActive}
                      className={`min-h-[40px] px-3 py-1.5 rounded-md font-jakarta font-semibold text-xs sm:text-sm transition-colors cursor-pointer ${FOCUS_RING_CLASS} ${
                        isActive
                          ? "bg-bramasta-accent text-bramasta-accent-on"
                          : "bg-paper border border-paper-deep text-bramasta-ink hover:bg-paper-dark"
                      }`}
                    >
                      {teamItem.team_name}
                    </button>
                  );
                })}
              </div>

              {canAddMoreTeams && (
                <button
                  type="button"
                  onClick={() => setIsWizardOpen(true)}
                  className={`w-full sm:w-auto min-h-[42px] inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 border border-bramasta-accent text-bramasta-accent font-jakarta font-semibold text-xs sm:text-sm rounded-md hover:bg-bramasta-accent hover:text-bramasta-accent-on transition-colors cursor-pointer shrink-0 ${FOCUS_RING_CLASS}`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Daftarkan Tim Lain</span>
                </button>
              )}
            </div>
          )}

          {/* 1. KARTU RINGKASAN KONTINGEN & PEMBAYARAN */}
          <section
            aria-label="Ringkasan Kontingen Tim"
            className="bg-paper-light border-2 border-bramasta-ink rounded-lg p-3.5 sm:p-6 shadow-[0_2px_0_#B5AD73,0_8px_20px_rgba(20,18,16,0.12)] space-y-4"
          >
            {/* Header Kartu Tim: Logo + Jenis & Asal + Nama Tim + Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-paper-deep">
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                {myTeam.logo_url ? (
                  <img
                    src={myTeam.logo_url}
                    alt={myTeam.team_name}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain border border-paper-deep bg-paper p-1 rounded-md shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border border-paper-deep bg-paper rounded-md flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-bramasta-ink-soft" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-bramasta-accent-soft text-bramasta-accent font-jakarta font-bold text-[11px] uppercase tracking-wider rounded-full shrink-0">
                      {myTeam.team_type === "club" ? "Club" : "Sekolah"}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-bramasta-ink-soft break-words">
                      {myTeam.institution_name ||
                        myTeam.school_name ||
                        myTeam.school ||
                        "Kontingen Resmi"}
                    </span>
                  </div>
                  <h2 className="font-bodoni font-bold text-xl sm:text-2xl uppercase text-bramasta-ink mt-1 leading-tight break-words">
                    {myTeam.team_name}
                  </h2>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-paper-deep/60 w-full sm:w-auto shrink-0">
                <span className="text-xs font-semibold text-bramasta-ink-soft sm:hidden">
                  Status Berkas:
                </span>
                <StatusBadge status={myTeam.status} />
              </div>
            </div>

            {/* 3 Kolom Info Utama (Bersih tanpa box berlapis sempit di mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-paper-deep bg-paper border border-paper-deep rounded-md">
              {/* Kategori & Penanggung Jawab */}
              <div className="p-3.5 space-y-2 text-sm">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-bramasta-ink-soft block">
                    Divisi Kategori
                  </span>
                  <span className="font-bold text-bramasta-ink block mt-0.5">
                    {myTeam.category?.name || "Kategori Lomba"}
                  </span>
                </div>
                <div className="pt-2 border-t border-paper-deep/60">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-bramasta-ink-soft block">
                    Pembina / Kontak
                  </span>
                  <span className="font-semibold text-bramasta-ink block mt-0.5 text-[13px] tabular-nums">
                    {myTeam.coach_name || currentUser?.full_name || "-"}{" "}
                    {myTeam.coach_phone ? `· ${myTeam.coach_phone}` : ""}
                  </span>
                </div>
              </div>

              {/* Kelengkapan Anggota (Terpisah: Pasukan Inti vs Pelatih & Official) */}
              <div className="p-3.5 flex flex-col justify-between text-sm">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-bramasta-ink-soft block">
                    Pasukan Inti (Danton + Pasukan)
                  </span>
                  <div className="flex items-baseline justify-between gap-2 mt-1">
                    <span className="font-bold text-base text-bramasta-ink tabular-nums">
                      {coreMemberCount} / {maxMembers} orang
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isCoreQuotaFulfilled
                          ? "text-[#2F6B3F]"
                          : "text-[#9B2C2C]"
                      }`}
                    >
                      {isCoreUnderMin
                        ? `Kurang ${minMembers - coreMemberCount}`
                        : isCoreOverMax
                        ? `Lebih ${coreMemberCount - maxMembers}`
                        : "Memenuhi syarat"}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5">
                  <div className="w-full h-2 bg-paper-dark rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isCoreOverMax
                          ? "bg-[#9B2C2C]"
                          : isCoreQuotaFulfilled
                          ? "bg-[#2F6B3F]"
                          : "bg-bramasta-accent"
                      }`}
                      style={{ width: `${memberProgressPct}%` }}
                    />
                  </div>
                  <div className="mt-2 pt-2 border-t border-paper-deep/60 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs tabular-nums">
                    <span
                      className={
                        isCoachOverLimit
                          ? "font-bold text-[#9B2C2C]"
                          : "text-bramasta-ink-soft"
                      }
                    >
                      Pelatih:{" "}
                      <strong className="text-bramasta-ink">
                        {formatQuotaLimit(coachCount, maxCoaches)}
                      </strong>
                    </span>
                    <span
                      className={
                        isOfficialOverLimit
                          ? "font-bold text-[#9B2C2C]"
                          : "text-bramasta-ink-soft"
                      }
                    >
                      Official:{" "}
                      <strong className="text-bramasta-ink">
                        {formatQuotaLimit(officialCount, maxOfficials)}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Ringkasan Biaya & Bukti Bayar */}
              <div className="p-3.5 flex flex-col justify-between text-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-bramasta-ink-soft block">
                      Biaya Pendaftaran
                    </span>
                    <span className="font-bodoni font-bold text-lg text-bramasta-ink block mt-0.5 tabular-nums">
                      {feeFormatted}
                    </span>
                  </div>
                  {myTeam.payment_proof_url ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2F6B3F]/10 text-[#2F6B3F] text-[11px] font-bold shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Terunggah</span>
                    </span>
                  ) : (
                    <CreditCard className="w-4 h-4 text-bramasta-ink-soft shrink-0 mt-0.5" />
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-paper-deep/60 flex items-center justify-between gap-2.5">
                  {myTeam.payment_proof_url ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setPhotoPreviewModal({
                            imageUrl: myTeam.payment_proof_url!,
                            title: "Bukti Transfer Pembayaran",
                            subtitle: `${myTeam.team_name} · ${feeFormatted}`,
                          })
                        }
                        title="Lihat foto bukti transfer"
                        className={`w-10 h-10 rounded-sm overflow-hidden border border-paper-deep bg-paper-light shrink-0 block cursor-pointer hover:border-bramasta-accent transition-colors ${FOCUS_RING_CLASS}`}
                      >
                        <img
                          src={myTeam.payment_proof_url}
                          alt="Foto bukti transfer"
                          className="w-full h-full object-cover"
                        />
                      </button>

                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            setPhotoPreviewModal({
                              imageUrl: myTeam.payment_proof_url!,
                              title: "Bukti Transfer Pembayaran",
                              subtitle: `${myTeam.team_name} · ${feeFormatted}`,
                            })
                          }
                          className={`min-h-[40px] flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-paper-deep bg-paper-light hover:border-bramasta-accent rounded-md text-xs font-semibold text-bramasta-accent transition-colors whitespace-nowrap cursor-pointer ${FOCUS_RING_CLASS}`}
                        >
                          <Eye className="w-3.5 h-3.5 shrink-0" />
                          <span>Lihat Foto</span>
                        </button>

                        {myTeam.status !== "verified" && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingPaymentProof((prev) => !prev);
                              setDashboardPaymentProof(null);
                              setDashboardPaymentPreview(null);
                              if (paymentInputRef.current)
                                paymentInputRef.current.value = "";
                            }}
                            className={`min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-bramasta-ink/50 bg-paper-light hover:bg-bramasta-ink hover:text-bramasta-accent-on rounded-md text-xs font-semibold text-bramasta-ink transition-colors cursor-pointer shrink-0 ${FOCUS_RING_CLASS}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>{isEditingPaymentProof ? "Tutup" : "Edit"}</span>
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9B2C2C]">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Menunggu bukti transfer</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Callout Upload / Edit Bukti Bayar */}
            {(!myTeam.payment_proof_url ||
              (isEditingPaymentProof && myTeam.status !== "verified")) && (
              <div className="bg-paper-dark/60 border border-[#B7791F] rounded-md p-3.5 sm:p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="text-sm">
                    <span className="font-bold text-bramasta-ink block">
                      {myTeam.payment_proof_url
                        ? `Perbarui Foto Bukti Transfer (${feeFormatted})`
                        : `Selesaikan Pembayaran (${feeFormatted})`}
                    </span>
                    <span className="text-[13px] text-bramasta-ink-soft block mt-0.5 tabular-nums">
                      Transfer ke {bankName}{" "}
                      <strong className="text-bramasta-ink">
                        {accountNumber}
                      </strong>{" "}
                      a.n. {accountHolder}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 border border-bramasta-ink/60 bg-paper-light hover:bg-bramasta-ink hover:text-bramasta-accent-on rounded-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 ${FOCUS_RING_CLASS}`}
                  >
                    {copiedBank ? (
                      <Check className="w-4 h-4 text-[#2F6B3F]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copiedBank ? "Tersalin" : `Salin No ${bankName}`}</span>
                  </button>
                </div>

                <form
                  onSubmit={handleUploadPaymentProofDashboard}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2.5 border-t border-paper-deep"
                >
                  {(dashboardPaymentPreview || myTeam.payment_proof_url) && (
                    <img
                      src={
                        dashboardPaymentPreview ||
                        myTeam.payment_proof_url ||
                        undefined
                      }
                      alt="Pratinjau foto bukti transfer"
                      className="w-12 h-12 object-cover rounded-sm border border-paper-deep bg-paper-light shrink-0"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => paymentInputRef.current?.click()}
                    className={`min-h-[44px] flex-1 px-3.5 py-2 border border-dashed border-bramasta-ink/50 bg-paper-light hover:border-bramasta-accent rounded-md text-left text-sm flex items-center gap-2 cursor-pointer ${FOCUS_RING_CLASS}`}
                  >
                    <Upload className="w-4 h-4 text-bramasta-ink-soft shrink-0" />
                    <span className="truncate text-bramasta-ink">
                      {dashboardPaymentProof
                        ? dashboardPaymentProof.name
                        : myTeam.payment_proof_url
                        ? "Pilih foto bukti transfer baru (JPG/PNG)..."
                        : "Pilih foto bukti transfer (JPG/PNG)..."}
                    </span>
                  </button>
                  <input
                    ref={paymentInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleDashboardPaymentChange}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    {isEditingPaymentProof && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingPaymentProof(false);
                          setDashboardPaymentProof(null);
                          setDashboardPaymentPreview(null);
                          if (paymentInputRef.current)
                            paymentInputRef.current.value = "";
                        }}
                        disabled={loading}
                        className={`min-h-[44px] px-4 py-2 border border-bramasta-ink/60 bg-paper-light text-bramasta-ink font-semibold text-sm rounded-md hover:bg-paper-dark transition-colors cursor-pointer disabled:opacity-50 ${FOCUS_RING_CLASS}`}
                      >
                        Batal
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={loading || !dashboardPaymentProof}
                      className={`flex-1 sm:flex-none min-h-[44px] px-5 py-2 bg-bramasta-accent text-bramasta-accent-on font-semibold text-sm rounded-md hover:bg-bramasta-accent-hover transition-colors disabled:opacity-50 cursor-pointer shrink-0 ${FOCUS_RING_CLASS}`}
                    >
                      {loading
                        ? "Mengunggah..."
                        : myTeam.payment_proof_url
                        ? "Simpan Bukti Baru"
                        : "Unggah Bukti"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Panel Revisi Identitas Tim (Hanya muncul jika registration_rejected) */}
            {myTeam.status === "registration_rejected" && (
              <div className="bg-paper border border-[#9B2C2C] rounded-md p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-[#9B2C2C] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#9B2C2C]">
                      Revisi Identitas Tim Diperlukan
                    </h3>
                    <p className="text-[13px] text-bramasta-ink-soft mt-0.5">
                      Perbarui nama tim, jenis tim, atau asal{" "}
                      {revTeamType === "club" ? "club" : "sekolah"} di bawah ini.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleReviseTeamIdentity}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                >
                  <div>
                    <label htmlFor="rev-team-type" className={LABEL_CLASS}>
                      Jenis Tim
                    </label>
                    <select
                      id="rev-team-type"
                      value={revTeamType}
                      onChange={(e) =>
                        setRevTeamType(e.target.value as TeamType)
                      }
                      className={INPUT_CLASS}
                    >
                      {(
                        (myTeam.event?.allowed_team_types &&
                        myTeam.event.allowed_team_types.length > 0
                          ? myTeam.event.allowed_team_types
                          : event?.allowed_team_types &&
                            event.allowed_team_types.length > 0
                          ? event.allowed_team_types
                          : ["school", "club"]) as TeamType[]
                      ).map((t) => (
                        <option key={t} value={t}>
                          {t === "club" ? "Club" : "Sekolah"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="rev-inst-name" className={LABEL_CLASS}>
                      {revTeamType === "club" ? "Nama Club" : "Nama Sekolah"}
                    </label>
                    <input
                      id="rev-inst-name"
                      type="text"
                      required
                      minLength={2}
                      maxLength={150}
                      value={revInstitutionName}
                      onChange={(e) => setRevInstitutionName(e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div>
                    <label htmlFor="rev-team-name" className={LABEL_CLASS}>
                      Nama Tim
                    </label>
                    <input
                      id="rev-team-name"
                      type="text"
                      required
                      value={revTeamName}
                      onChange={(e) => setRevTeamName(e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`min-h-[44px] px-5 py-2 bg-bramasta-accent text-bramasta-accent-on font-semibold text-sm rounded-md hover:bg-bramasta-accent-hover transition-colors cursor-pointer disabled:opacity-50 ${FOCUS_RING_CLASS}`}
                    >
                      {loading
                        ? "Menyimpan..."
                        : "Simpan Revisi Identitas Tim"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>

          {/* 2. SECTION ANGGOTA TIM (KARTU KANDIDAT + POP-UP TAMBAH/EDIT + PENGAJUAN) */}
          <section
            aria-label="Susunan Anggota Tim"
            className="bg-paper-light border-2 border-bramasta-ink rounded-lg p-3.5 sm:p-6 shadow-[0_2px_0_#B5AD73,0_8px_20px_rgba(20,18,16,0.12)] space-y-4 sm:space-y-5"
          >
            {/* Header Daftar Anggota + Ringkasan Kuota Terpisah + Tombol Pop-up Tambah */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-paper-deep">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-bramasta-accent shrink-0" />
                  <h3 className="font-bodoni font-bold text-lg sm:text-xl uppercase text-bramasta-ink tabular-nums">
                    Personil Tim ({allMembers.length})
                  </h3>
                </div>
                <p className="text-[13px] text-bramasta-ink-soft mt-0.5 leading-relaxed">
                  {isLocked
                    ? "Daftar personil sedang dikunci untuk verifikasi panitia & juri."
                    : `Kuota pasukan inti ${minMembers}–${maxMembers} orang (Danton + Pasukan). Pendamping di luar kuota inti: ${formatSupportLimitPhrase(
                        "Pelatih",
                        maxCoaches
                      )} dan ${formatSupportLimitPhrase(
                        "Official",
                        maxOfficials
                      )}.`}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2 text-xs tabular-nums">
                  <span
                    className={`px-2 py-0.5 rounded-full font-semibold ${
                      isCoreQuotaFulfilled
                        ? "bg-[#2F6B3F]/10 text-[#2F6B3F]"
                        : "bg-paper text-bramasta-ink border border-paper-deep"
                    }`}
                  >
                    Inti: {coreMemberCount}/{maxMembers} (min {minMembers})
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-semibold ${
                      isCoachOverLimit
                        ? "bg-[#9B2C2C]/15 text-[#9B2C2C]"
                        : "bg-paper text-bramasta-ink-soft border border-paper-deep"
                    }`}
                  >
                    Pelatih: {formatQuotaLimit(coachCount, maxCoaches)}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-semibold ${
                      isOfficialOverLimit
                        ? "bg-[#9B2C2C]/15 text-[#9B2C2C]"
                        : "bg-paper text-bramasta-ink-soft border border-paper-deep"
                    }`}
                  >
                    Official: {formatQuotaLimit(officialCount, maxOfficials)}
                  </span>
                </div>
              </div>

              {!isLocked && (
                <button
                  type="button"
                  onClick={() => setMemberModal({ mode: "add" })}
                  className={`w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-sm transition-colors cursor-pointer shrink-0 bg-bramasta-accent text-bramasta-accent-on hover:bg-bramasta-accent-hover shadow-sm ${FOCUS_RING_CLASS}`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Personil</span>
                </button>
              )}
            </div>

            {/* Grid Card Anggota Tim — Dipisah antara Pasukan Inti & Pelatih/Official */}
            {allMembers.length === 0 ? (
              <p className="text-sm text-bramasta-ink-soft py-2">
                Belum ada personil terdaftar. Tekan{" "}
                <strong className="text-bramasta-ink font-semibold">
                  Tambah Personil
                </strong>{" "}
                untuk menambahkan {minMembers}–{maxMembers} pasukan inti (Danton
                &amp; Pasukan), serta pendamping terpisah (
                {formatSupportLimitPhrase("Pelatih", maxCoaches)},{" "}
                {formatSupportLimitPhrase("Official", maxOfficials)}).
              </p>
            ) : (
              <div className="space-y-5">
                {[
                  {
                    key: "core",
                    heading: `Pasukan Inti · Danton & Pasukan (${coreMemberCount} / ${maxMembers})`,
                    list: coreMembers,
                  },
                  ...(supportMembers.length > 0
                    ? [
                        {
                          key: "support",
                          heading: `Pelatih & Official Pendamping (${supportMembers.length})`,
                          list: supportMembers,
                        },
                      ]
                    : []),
                ].map((group) => (
                  <div key={group.key} className="space-y-2.5">
                    <h4 className="font-jakarta font-bold text-xs uppercase tracking-[0.12em] text-bramasta-ink-soft">
                      {group.heading}
                    </h4>

                    {group.list.length === 0 ? (
                      <p className="text-sm text-bramasta-ink-soft py-1">
                        Belum ada pasukan inti (Danton / Pasukan).
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
                        {group.list.map((m, idx) => {
                          const roleLabel =
                            ROLE_LABELS[m.role_in_team] || m.role_in_team;
                          const badgeClass =
                            m.role_in_team === "leader"
                              ? "bg-bramasta-accent text-bramasta-accent-on"
                              : m.role_in_team === "coach"
                              ? "bg-[#2F6B3F]/15 text-[#2F6B3F]"
                              : m.role_in_team === "official"
                              ? "bg-bramasta-accent-soft text-bramasta-accent"
                              : "bg-paper-dark text-bramasta-ink";
                          return (
                            <button
                              key={m.id || idx}
                              type="button"
                              onClick={() =>
                                setMemberModal({
                                  mode: "view",
                                  member: m,
                                  number: idx + 1,
                                })
                              }
                              aria-label={`Lihat detail ${roleLabel} ${m.full_name}`}
                              className={`text-left bg-paper border border-paper-deep rounded-md p-3 sm:p-3.5 flex flex-col justify-between hover:border-bramasta-accent transition-colors cursor-pointer group ${FOCUS_RING_CLASS}`}
                            >
                              <div className="flex items-start gap-3 w-full">
                                {/* Pas Foto Kandidat (Berwarna penuh sesuai design.md 5.1) */}
                                <div className="shrink-0">
                                  {m.photo_url ? (
                                    <div className="w-[72px] h-[90px] sm:w-20 sm:h-24 rounded-sm overflow-hidden border border-paper-deep bg-paper-light">
                                      <img
                                        src={m.photo_url}
                                        alt={`Pas foto ${m.full_name}`}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                      />
                                    </div>
                                  ) : (
                                    <div
                                      aria-label="Belum ada foto"
                                      className="w-[72px] h-[90px] sm:w-20 sm:h-24 rounded-sm border border-dashed border-paper-deep bg-paper-dark/60 flex flex-col items-center justify-center text-bramasta-ink-soft gap-1"
                                    >
                                      <User className="w-5 h-5" />
                                      <span className="text-[11px] font-medium">
                                        Tanpa foto
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Identitas Ringkas Kandidat */}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className="text-xs font-bold text-bramasta-ink-soft tabular-nums">
                                      #{idx + 1}
                                    </span>
                                    <span
                                      className={`px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full shrink-0 ${badgeClass}`}
                                    >
                                      {roleLabel}
                                    </span>
                                  </div>

                                  <h5 className="font-bold text-[15px] text-bramasta-ink group-hover:text-bramasta-accent leading-snug line-clamp-2 break-words transition-colors">
                                    {m.full_name}
                                  </h5>

                                  <div className="mt-1.5 space-y-0.5 text-xs text-bramasta-ink-soft">
                                    <p className="truncate tabular-nums">
                                      ID/NISN: {m.nisn || "-"}
                                    </p>
                                    {m.position_label && (
                                      <p className="truncate">
                                        Posisi: {m.position_label}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Satu Bar Aksi Jelas agar User Tahu Foto & Kartu Bisa Diklik */}
                              <div className="mt-3 pt-2 border-t border-paper-deep/70 w-full flex items-center justify-center gap-1.5 min-h-[36px] bg-paper-light border border-paper-deep group-hover:border-bramasta-accent rounded-md text-xs font-semibold text-bramasta-accent transition-colors">
                                <Eye className="w-3.5 h-3.5 shrink-0" />
                                <span>Lihat Detail</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Footer Aksi Pengajuan / Penguncian Roster */}
            <div className="bg-paper border border-paper-deep rounded-md p-3.5 sm:p-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <p className="text-[13px] text-bramasta-ink-soft max-w-lg leading-relaxed">
                {isLocked ? (
                  "Susunan personil sudah dikunci untuk verifikasi dewan juri. Jika perlu perubahan sebelum Technical Meeting, buka kuncian terlebih dahulu."
                ) : isCoreUnderMin ? (
                  <>
                    Tambahkan{" "}
                    <strong className="text-bramasta-ink">
                      {minMembers - coreMemberCount} pasukan inti lagi
                    </strong>{" "}
                    (Danton / Pasukan) agar mencapai batas minimum {minMembers}{" "}
                    orang. Pelatih dan Official dihitung terpisah.
                  </>
                ) : isCoreOverMax ? (
                  <>
                    Jumlah pasukan inti ({coreMemberCount} orang) melebihi batas
                    maksimal kategori ({maxMembers} orang). Kurangi sebelum
                    mengunci berkas.
                  </>
                ) : isCoachOverLimit ? (
                  <>
                    Jumlah Pelatih ({coachCount} orang) melebihi batas maksimal
                    event ({maxCoaches} orang).
                  </>
                ) : isOfficialOverLimit ? (
                  <>
                    Jumlah Official ({officialCount} orang) melebihi batas
                    maksimal event ({maxOfficials} orang).
                  </>
                ) : (
                  `Kuota pasukan inti (${coreMemberCount}/${maxMembers}) memenuhi syarat. Anda sudah dapat mengunci dan mengajukan berkas tim ke panitia.`
                )}
              </p>

              <div className="w-full sm:w-auto shrink-0">
                {isLocked ? (
                  <button
                    type="button"
                    onClick={handleUnsubmitRoster}
                    disabled={loading}
                    className={`w-full sm:w-auto min-h-[48px] px-5 py-2.5 border-2 border-bramasta-ink bg-paper-light text-bramasta-ink font-jakarta font-bold text-sm uppercase tracking-[0.06em] hover:bg-bramasta-ink hover:text-bramasta-accent-on rounded-md transition-colors cursor-pointer disabled:opacity-50 ${FOCUS_RING_CLASS}`}
                  >
                    Buka Kuncian (Revisi)
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitRoster}
                    disabled={loading || !isRosterReady}
                    className={`w-full sm:w-auto min-h-[48px] px-6 py-3 bg-bramasta-accent text-bramasta-accent-on font-jakarta font-bold text-sm uppercase tracking-[0.06em] hover:bg-bramasta-accent-hover transition-colors rounded-md shadow-sm disabled:bg-paper-dark disabled:text-bramasta-ink-mute disabled:shadow-none cursor-pointer disabled:cursor-not-allowed ${FOCUS_RING_CLASS}`}
                  >
                    Kunci & Ajukan Berkas Tim &rarr;
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ── MODAL WIZARD PENDAFTARAN CEPAT ── */}
      <RegistrationWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        categories={categories}
        event={event}
        initialCategoryId={initialCategoryParam}
        onSuccess={handleWizardSuccess}
      />

      {/* ── MODAL TERPADU ANGGOTA TIM (LIHAT DETAIL / EDIT / TAMBAH) ── */}
      {myTeam && (
        <TeamMemberModal
          isOpen={!!memberModal}
          initialMode={memberModal?.mode || "add"}
          member={memberModal?.member || null}
          memberNumber={memberModal?.number}
          teamId={myTeam.id}
          teamName={myTeam.team_name}
          isLocked={isLocked}
          quotaInfo={{
            coreCount: coreMemberCount,
            maxCoreMembers: maxMembers,
            coachCount,
            maxCoaches,
            officialCount,
            maxOfficials,
          }}
          externalLoading={loading}
          onClose={() => setMemberModal(null)}
          onSaved={handleMemberSaved}
          onDelete={(member) =>
            handleDeleteMember(member.id, member.full_name)
          }
        />
      )}

      {/* ── MODAL PRATINJAU FOTO ── */}
      <PhotoPreviewModal
        isOpen={!!photoPreviewModal}
        onClose={() => setPhotoPreviewModal(null)}
        imageUrl={photoPreviewModal?.imageUrl || null}
        title={photoPreviewModal?.title || ""}
        subtitle={photoPreviewModal?.subtitle}
      />
    </div>
  );
}
