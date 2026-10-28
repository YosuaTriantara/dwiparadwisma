"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Lock,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  FileCheck,
  CreditCard,
  Users,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { NewsRule } from "@/components/bramasta/ui/NewsRule";
import { StatusBadge } from "@/components/bramasta/ui/StatusBadge";
import { RegistrationWizardModal } from "@/components/bramasta/registration/RegistrationWizardModal";
import {
  loginParticipant,
  loginWithGoogle,
  getCurrentUser,
  logoutParticipant,
} from "@/lib/evora/auth";
import { getEventCategories, getEventDetail } from "@/lib/evora/events";
import {
  getMyTeams,
  getTeamDetail,
  submitTeamRoster,
  unsubmitTeamRoster,
  updateTeam,
} from "@/lib/evora/teams";
import { addTeamMember, deleteTeamMember } from "@/lib/evora/members";
import { uploadFileBase64, fileToBase64 } from "@/lib/evora/upload";
import type {
  EvoraCategory,
  EvoraEvent,
  EvoraTeam,
  EvoraUser,
  RoleInTeam,
} from "@/types/evora";

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

  // Standalone Login modal/form state jika pembina hanya ingin login ke akun lama
  const [isLoginTab, setIsLoginTab] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  useEffect(() => {
    if (typeof window === "undefined" || !isLoginTab) return;
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
              setSuccessMessage(`Selamat datang kembali, ${authRes.user.full_name}`);
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
  }, [isLoginTab, googleClientId]);

  // Dashboard Tim state
  const [myTeam, setMyTeam] = useState<EvoraTeam | null>(null);
  const [copiedBank, setCopiedBank] = useState(false);
  const [dashboardPaymentProof, setDashboardPaymentProof] = useState<File | null>(null);

  // Member form state
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState<RoleInTeam>("member");
  const [memberNisn, setMemberNisn] = useState("");
  const [memberPosition, setMemberPosition] = useState("");
  const [memberPhotoFile, setMemberPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    // 1. Baca query parameter URL (misal: ?category=87a... atau ?mode=login)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("category");
      if (catParam) {
        setInitialCategoryParam(catParam);
      }
      const modeParam = params.get("mode");
      if (modeParam === "login") {
        setIsLoginTab(true);
      } else if (!getCurrentUser()) {
        // Otomatis buka wizard pendaftaran jika belum login
        setIsWizardOpen(true);
      }
    }

    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      loadUserData();
    }
    loadData();
  }, []);

  async function loadData() {
    try {
      const [cats, ev] = await Promise.all([
        getEventCategories(),
        getEventDetail(),
      ]);
      setCategories(cats);
      setEvent(ev);
    } catch (e) {
      console.error(e);
    }
  }

  async function loadUserData() {
    try {
      const teams = await getMyTeams();
      if (teams.length > 0) {
        const fullTeam = await getTeamDetail(teams[0].id);
        setMyTeam(fullTeam);
      }
    } catch (e) {
      console.error(e);
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
      setSuccessMessage(`Selamat datang kembali, ${res.user.full_name}`);
      setIsLoginTab(false);
      await loadUserData();
    } catch (err: any) {
      setErrorMessage(err.message || "Email atau kata sandi tidak valid. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logoutParticipant();
    setCurrentUser(null);
    setMyTeam(null);
    setSuccessMessage("Anda telah keluar dari akun.");
  }

  // Callback ketika pendaftaran via Wizard sukses
  function handleWizardSuccess(team: EvoraTeam, user: EvoraUser) {
    setCurrentUser(user);
    setMyTeam(team);
    setSuccessMessage(`Pendaftaran tim "${team.team_name}" berhasil! Selamat datang di Dashboard Tim.`);
    setIsWizardOpen(false);
    loadUserData();
  }

  // Handle Update Bukti Pembayaran dari dalam Dashboard
  async function handleUploadPaymentProofDashboard(e: React.FormEvent) {
    e.preventDefault();
    if (!myTeam || !dashboardPaymentProof) return;
    setErrorMessage(null);
    setLoading(true);

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
      setSuccessMessage("Bukti pembayaran berhasil diunggah! Menunggu konfirmasi panitia.");
      setDashboardPaymentProof(null);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal mengunggah bukti pembayaran");
    } finally {
      setLoading(false);
    }
  }

  // Handle Tambah Anggota Roster
  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!myTeam) return;

    setErrorMessage(null);
    setLoading(true);

    try {
      let photoUrl = "";
      if (memberPhotoFile) {
        const base64 = await fileToBase64(memberPhotoFile);
        const uploaded = await uploadFileBase64(
          base64,
          memberPhotoFile.name,
          "/evora/events/members"
        );
        photoUrl = uploaded.url;
      }

      await addTeamMember(myTeam.id, {
        full_name: memberName.trim(),
        role_in_team: memberRole,
        nisn: memberNisn.trim(),
        position_label: memberPosition.trim(),
        photo_url: photoUrl,
      });

      setSuccessMessage(`Personil ${memberName} berhasil didaftarkan ke tim!`);
      setMemberName("");
      setMemberNisn("");
      setMemberPosition("");
      setMemberPhotoFile(null);

      const refreshed = await getTeamDetail(myTeam.id);
      setMyTeam(refreshed);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal menambahkan personil");
    } finally {
      setLoading(false);
    }
  }

  // Handle Hapus Anggota
  async function handleDeleteMember(memberId: string) {
    if (!myTeam || !confirm("Hapus anggota ini dari susunan tim?")) return;
    setLoading(true);
    try {
      await deleteTeamMember(myTeam.id, memberId);
      const refreshed = await getTeamDetail(myTeam.id);
      setMyTeam(refreshed);
      setSuccessMessage("Anggota berhasil dihapus dari tim.");
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal menghapus anggota tim");
    } finally {
      setLoading(false);
    }
  }

  // Handle Kunci / Buka Roster
  async function handleSubmitRoster() {
    if (!myTeam) return;
    if (!confirm("Kunci berkas anggota tim sekarang? Setelah dikunci, data akan diajukan ke panitia & dewan juri.")) return;
    setLoading(true);
    try {
      await submitTeamRoster(myTeam.id);
      const refreshed = await getTeamDetail(myTeam.id);
      setMyTeam(refreshed);
      setSuccessMessage("Anggota tim berhasil dikunci dan diajukan ke panitia!");
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal mengajukan anggota tim");
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
      setSuccessMessage("Kuncian anggota tim dibuka. Anda dapat mengedit kembali susunan anggota.");
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal membuka kuncian anggota tim");
    } finally {
      setLoading(false);
    }
  }

  const isLocked = myTeam?.status === "roster_submitted" || myTeam?.status === "verified";
  const minMembers = myTeam?.category?.min_team_members || 13;
  const maxMembers = myTeam?.category?.max_team_members || 16;
  const currentMemberCount = myTeam?.members?.length || 0;
  const isQuotaFulfilled = currentMemberCount >= minMembers;

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

  return (
    <div className="max-w-[960px] mx-auto py-3 sm:py-6">
      {/* ── HEADER PORTAL ── */}
      <div className="text-center mb-5 sm:mb-6">
        <div className="inline-block mb-2">
          <Link
            href="/lkbb-bramasta-4"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-bramasta-ink/40 bg-paper hover:bg-bramasta-ink hover:text-white transition-colors font-bodoni text-xs uppercase tracking-wider font-bold shadow-xs cursor-pointer"
            title="Kembali ke Halaman Berita Bramasta"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Warta Bramasta</span>
          </Link>
        </div>

        <span className="font-bodoni font-bold text-[11px] sm:text-xs uppercase tracking-widest text-bramasta-ink-mute block">
          REGISTRASI TIM LKBB BRAMASTA 4.0
        </span>

        <h1 className="font-bodoni font-bold text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-bramasta-ink mt-0.5">
          {myTeam ? "Dashboard Kontingen Tim" : "Pendaftaran & Akun Tim"}
        </h1>

        <div className="w-full max-w-sm mx-auto my-2" aria-hidden="true">
          <div className="w-full border-t-2 border-bramasta-ink" />
          <div className="w-full border-t border-bramasta-ink mt-0.5" />
        </div>
      </div>

      {/* ── ALERT NOTIFIKASI ── */}
      {errorMessage && (
        <div className="bg-[#8C1D18] text-white p-3.5 font-bodoni text-xs sm:text-sm border-2 border-bramasta-ink mb-4 shadow-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider block">Pemberitahuan:</span>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-[#1E562A] text-white p-3.5 font-bodoni text-xs sm:text-sm border-2 border-bramasta-ink mb-4 shadow-sm flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider block">Berhasil:</span>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {/* ── KONDISI 1: JIKA PENGGUNA BELUM PUNYA TIM ATAU BELUM LOGIN ── */}
      {!myTeam ? (
        <div className="space-y-4">
          {/* Card Masuk ke Pendaftaran Cepat (Wizard) */}
          <div className="bg-paper-light border-2 sm:border-3 border-bramasta-ink p-5 sm:p-7 shadow-[4px_4px_0px_#141210] text-center max-w-xl mx-auto">
            <span className="font-bodoni font-bold text-xs uppercase tracking-widest text-bramasta-ink-mute block mb-1">
              PENDAFTARAN SATU PINTU (3 LANGKAH CEPAT)
            </span>
            <h2 className="font-bodoni font-bold text-xl sm:text-2xl uppercase text-bramasta-ink mb-2">
              Daftarkan Satuan Tim Anda
            </h2>

            <button
              type="button"
              onClick={() => setIsWizardOpen(true)}
              className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-bramasta-accent text-bramasta-accent-on font-bodoni font-bold text-xs sm:text-sm uppercase tracking-[0.1em] hover:bg-bramasta-accent-hover transition-all rounded-md shadow-sm cursor-pointer active:translate-y-px"
            >
              <span>Mulai Pendaftaran Tim</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="mt-5 pt-3 border-t border-bramasta-ink/20 flex items-center justify-center gap-2">
              <span className="text-xs font-bodoni text-bramasta-ink-soft">
                Sudah pernah mendaftarkan akun?
              </span>
              <button
                type="button"
                onClick={() => setIsLoginTab(!isLoginTab)}
                className="text-xs font-bodoni font-bold uppercase text-bramasta-ink underline hover:text-bramasta-ink-soft cursor-pointer"
              >
                {isLoginTab ? "Tutup Form Masuk" : "Masuk ke Dashboard"}
              </button>
            </div>
          </div>

          {/* Form Login Cepat Jika Pembina Sudah Punya Akun */}
          {isLoginTab && (
            <div className="bg-paper border-2 border-bramasta-ink p-4 sm:p-6 shadow-sm max-w-md mx-auto">
              <h3 className="font-bodoni font-bold text-base uppercase text-bramasta-ink mb-1 text-center">
                Masuk ke Akun 
              </h3>
              <p className="text-xs font-bodoni text-bramasta-ink-soft mb-3.5 text-center">
                Gunakan akun Google atau email yang Anda daftarkan untuk mengakses dashboard tim.
              </p>

              {/* Tombol Cepat Google Sign-In */}
              <div className="mb-4">
                <div ref={googleBtnRef} className="flex justify-center min-h-[44px]">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.google?.accounts?.id && googleClientId) {
                        window.google.accounts.id.prompt();
                      } else {
                        setErrorMessage(
                          "Google Client ID belum terpasang (NEXT_PUBLIC_GOOGLE_CLIENT_ID). Silakan gunakan formulir email di bawah."
                        );
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 border-2 border-bramasta-ink bg-white hover:bg-paper-light transition-colors font-bodoni font-bold text-xs uppercase tracking-wider text-bramasta-ink shadow-xs cursor-pointer"
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
                    <span>Masuk dengan Google</span>
                  </button>
                </div>
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-bramasta-ink/20"></div>
                  <span className="shrink-0 mx-3 font-bodoni text-[10px] uppercase tracking-wider text-bramasta-ink-mute font-bold">
                    atau masukkan email & kata sandi
                  </span>
                  <div className="flex-grow border-t border-bramasta-ink/20"></div>
                </div>
              </div>

              <form onSubmit={handleStandaloneLogin} className="space-y-3">
                <div>
                  <label className="font-bodoni font-bold text-xs uppercase block text-bramasta-ink mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="pembina@sekolah.sch.id"
                    className="w-full p-2.5 bg-paper-light border border-bramasta-ink font-bodoni text-xs sm:text-sm text-bramasta-ink focus:outline-none focus:ring-1 focus:ring-bramasta-ink"
                  />
                </div>

                <div>
                  <label className="font-bodoni font-bold text-xs uppercase block text-bramasta-ink mb-1">
                    Kata Sandi
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-2.5 bg-paper-light border border-bramasta-ink font-bodoni text-xs sm:text-sm text-bramasta-ink focus:outline-none focus:ring-1 focus:ring-bramasta-ink"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-bramasta-ink text-white font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-bramasta-ink/90 transition-colors cursor-pointer"
                >
                  {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        /* ── KONDISI 2: DASHBOARD RESMI TIM (SETELAH PENDAFTARAN) ── */
        <div className="space-y-5">
          {/* 1. Baris Identitas Akun Pembina */}
          <div className="bg-paper-light border-2 border-bramasta-ink p-3.5 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 border border-bramasta-ink bg-paper text-bramasta-ink">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <div>
                <span className="font-bodoni text-[11px] text-bramasta-ink-mute uppercase tracking-wider block">
                  Pembina Terdaftar
                </span>
                <span className="font-bodoni font-bold text-xs sm:text-sm text-bramasta-ink">
                  {currentUser?.full_name} ({currentUser?.email})
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-bramasta-ink bg-paper text-bramasta-ink font-bodoni font-bold text-xs uppercase tracking-wider hover:bg-bramasta-ink hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Akun</span>
            </button>
          </div>

          {/* 2. Banner Utama Kartu Tim */}
          <div className="bg-paper-light border-2 sm:border-3 border-bramasta-ink p-4 sm:p-6 shadow-[3px_3px_0px_#141210]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-bramasta-ink/20">
              <div className="flex items-center gap-3">
                {myTeam.logo_url && (
                  <img
                    src={myTeam.logo_url}
                    alt={myTeam.team_name}
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain border-2 border-bramasta-ink bg-white p-1 shadow-xs shrink-0"
                  />
                )}
                <div>
                  <span className="font-bodoni font-bold text-[11px] sm:text-xs uppercase tracking-widest text-bramasta-ink-mute block">
                    {myTeam.school_name || myTeam.school ? (myTeam.school_name || myTeam.school) : "SATUAN KONTINGEN RESMI"}
                  </span>
                  <h2 className="font-bodoni font-bold text-xl sm:text-2xl uppercase text-bramasta-ink mt-0.5">
                    {myTeam.team_name}
                  </h2>
                </div>
              </div>
              <StatusBadge status={myTeam.status as any} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 font-bodoni text-xs sm:text-sm">
              <div>
                <span className="text-bramasta-ink-mute block text-[11px] uppercase">Pangkalan Sekolah:</span>
                <span className="font-bold text-bramasta-ink">{myTeam.school_name || myTeam.school || "-"}</span>
              </div>
              <div>
                <span className="text-bramasta-ink-mute block text-[11px] uppercase">Divisi Kategori:</span>
                <span className="font-bold text-bramasta-ink">{myTeam.category?.name || "Kategori Lomba"}</span>
              </div>
              <div>
                <span className="text-bramasta-ink-mute block text-[11px] uppercase">Penanggung Jawab:</span>
                <span className="font-bold text-bramasta-ink">{myTeam.coach_name} ({myTeam.coach_phone})</span>
              </div>
              <div>
                <span className="text-bramasta-ink-mute block text-[11px] uppercase">Kelengkapan Personil:</span>
                <span className={`font-bold ${isQuotaFulfilled ? "text-[#1E562A]" : "text-[#8C1D18]"}`}>
                  {currentMemberCount} / {maxMembers} Orang ({isQuotaFulfilled ? "Memenuhi Syarat" : `Kurang ${minMembers - currentMemberCount}`})
                </span>
              </div>
            </div>
          </div>

          {/* 3. Panel Status Pembayaran Biaya Pendaftaran */}
          <div className="bg-paper border-2 border-bramasta-ink p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-bramasta-ink" />
              <h3 className="font-bodoni font-bold text-sm sm:text-base uppercase tracking-wider text-bramasta-ink">
                Status Pembayaran Biaya Pendaftaran ({feeFormatted})
              </h3>
            </div>

            {myTeam.payment_proof_url ? (
              <div className="p-3 bg-paper-light border border-bramasta-ink flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1E562A] shrink-0" />
                  <div>
                    <span className="font-bodoni font-bold text-xs uppercase text-bramasta-ink block">
                      Bukti Pembayaran Telah Diunggah
                    </span>
                    <span className="text-[11px] font-bodoni text-bramasta-ink-soft">
                      Menunggu verifikasi admin panitia 
                    </span>
                  </div>
                </div>

                <a
                  href={myTeam.payment_proof_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 border border-bramasta-ink bg-paper text-xs font-bodoni font-bold uppercase hover:bg-bramasta-ink hover:text-white transition-colors"
                >
                  <span>Lihat Bukti</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <div className="p-3.5 bg-paper-light border border-bramasta-ink space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="font-bodoni font-bold text-xs uppercase text-[#8C1D18] block">
                      Menunggu Unggah Bukti Transfer
                    </span>
                    <span className="text-xs font-bodoni text-bramasta-ink">
                      Transfer ke {bankName}: <span className="font-mono font-bold">{accountNumber}</span> a.n. {accountHolder}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="inline-flex items-center gap-1 px-2.5 py-1 border border-bramasta-ink bg-paper text-xs font-bodoni font-bold uppercase hover:bg-bramasta-ink hover:text-white transition-colors"
                  >
                    {copiedBank ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedBank ? "Tersalin!" : "Salin No BCA"}</span>
                  </button>
                </div>

                <form onSubmit={handleUploadPaymentProofDashboard} className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-bramasta-ink/20">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setDashboardPaymentProof(e.target.files?.[0] || null)}
                    className="text-xs font-bodoni flex-1 p-1 bg-paper border border-bramasta-ink"
                  />
                  <button
                    type="submit"
                    disabled={loading || !dashboardPaymentProof}
                    className="px-4 py-1.5 bg-bramasta-ink text-white font-bodoni font-bold text-xs uppercase tracking-wider hover:bg-bramasta-ink/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Mengunggah..." : "Unggah Bukti"}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* 4. Panel Form Tambah Personil Roster (Hanya jika belum dikunci) */}
          {!isLocked && (
            <div className="bg-paper border-2 border-bramasta-ink p-4 sm:p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <Plus className="w-4 h-4 text-bramasta-ink" />
                <h3 className="font-bodoni font-bold text-sm sm:text-base uppercase tracking-wider text-bramasta-ink">
                  Tambah Personil Tim
                </h3>
              </div>
              <p className="font-bodoni text-xs text-bramasta-ink-soft mb-3.5">
                Masukkan identitas anggota tim
              </p>

              <form onSubmit={handleAddMember} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="font-bodoni font-bold text-xs uppercase block text-bramasta-ink mb-1">
                    Nama Lengkap Siswa
                  </label>
                  <input
                    type="text"
                    required
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="Contoh: I Kadek Dwi Anggara"
                    className="w-full p-2 bg-paper-light border border-bramasta-ink font-bodoni text-xs sm:text-sm text-bramasta-ink focus:outline-none focus:ring-1 focus:ring-bramasta-ink"
                  />
                </div>

                <div>
                  <label className="font-bodoni font-bold text-xs uppercase block text-bramasta-ink mb-1">
                    Peran di Tim
                  </label>
                  <select
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value as RoleInTeam)}
                    className="w-full p-2 bg-paper-light border border-bramasta-ink font-bodoni text-xs sm:text-sm text-bramasta-ink focus:outline-none focus:ring-1 focus:ring-bramasta-ink"
                  >
                    <option value="leader">Komandan Tim (Danton)</option>
                    <option value="member">Anggota Tim (Pasukan)</option>
                    <option value="official">Official / Cadangan</option>
                  </select>
                </div>

                <div>
                  <label className="font-bodoni font-bold text-xs uppercase block text-bramasta-ink mb-1">
                    Nomor NISN Siswa
                  </label>
                  <input
                    type="text"
                    value={memberNisn}
                    onChange={(e) => setMemberNisn(e.target.value)}
                    placeholder="Contoh: 0061234567"
                    className="w-full p-2 bg-paper-light border border-bramasta-ink font-bodoni text-xs sm:text-sm text-bramasta-ink focus:outline-none focus:ring-1 focus:ring-bramasta-ink"
                  />
                </div>

                <div>
                  <label className="font-bodoni font-bold text-xs uppercase block text-bramasta-ink mb-1">
                    Posisi Barisan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={memberPosition}
                    onChange={(e) => setMemberPosition(e.target.value)}
                    placeholder="Contoh: Banjar 1 Kanan"
                    className="w-full p-2 bg-paper-light border border-bramasta-ink font-bodoni text-xs sm:text-sm text-bramasta-ink focus:outline-none focus:ring-1 focus:ring-bramasta-ink"
                  />
                </div>

                <div>
                  <label className="font-bodoni font-bold text-xs uppercase block text-bramasta-ink mb-1">
                    Pas Foto 
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMemberPhotoFile(e.target.files?.[0] || null)}
                    className="w-full p-1.5 bg-paper-light border border-bramasta-ink font-bodoni text-xs"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-bramasta-ink text-white font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-bramasta-ink/90 transition-colors cursor-pointer"
                  >
                    {loading ? "Menyimpan..." : "+ Tambah Personil"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 5. Tabel Susunan Roster Peleton */}
          <div className="bg-paper-light border-2 border-bramasta-ink p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
              <h3 className="font-bodoni font-bold text-sm sm:text-base uppercase text-bramasta-ink flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Susunan Anggota Tim ({currentMemberCount} / {maxMembers})</span>
              </h3>
              {isLocked ? (
                <span className="text-xs font-bodoni uppercase font-bold text-white bg-[#8C1D18] px-2.5 py-0.5">
                  Terkunci (Sedang Diverifikasi)
                </span>
              ) : (
                <span className="text-xs font-bodoni text-bramasta-ink-soft">
                  Minimal {minMembers} anggota tim untuk penguncian
                </span>
              )}
            </div>

            <div className="border border-bramasta-ink bg-paper overflow-x-auto">
              <table className="w-full border-collapse font-bodoni text-xs sm:text-sm">
                <thead>
                  <tr className="bg-bramasta-ink text-white text-left uppercase text-xs">
                    <th className="p-2 sm:p-2.5 border-r border-paper/20">No</th>
                    <th className="p-2 sm:p-2.5 border-r border-paper/20">Nama Siswa</th>
                    <th className="p-2 sm:p-2.5 border-r border-paper/20">Peran</th>
                    <th className="p-2 sm:p-2.5 border-r border-paper/20">NISN</th>
                    <th className="p-2 sm:p-2.5 border-r border-paper/20">Posisi</th>
                    <th className="p-2 sm:p-2.5 border-r border-paper/20">Foto</th>
                    {!isLocked && <th className="p-2 sm:p-2.5 text-right">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-bramasta-ink/20">
                  {(!myTeam.members || myTeam.members.length === 0) ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-bramasta-ink-mute italic">
                        Belum ada anggota tim yang didaftarkan. Gunakan formulir di atas untuk mengisi susunan tim.
                      </td>
                    </tr>
                  ) : (
                    myTeam.members.map((m, idx) => (
                      <tr key={m.id || idx} className="hover:bg-paper-light">
                        <td className="p-2 sm:p-2.5 font-bold border-r border-bramasta-ink/20">{idx + 1}</td>
                        <td className="p-2 sm:p-2.5 font-bold uppercase border-r border-bramasta-ink/20">{m.full_name}</td>
                        <td className="p-2 sm:p-2.5 border-r border-bramasta-ink/20">
                          <span
                            className={`px-2 py-0.5 text-xs uppercase font-bold ${
                              m.role_in_team === "leader"
                                ? "bg-bramasta-ink text-white"
                                : "bg-paper-dark border border-bramasta-ink/40 text-bramasta-ink"
                            }`}
                          >
                            {m.role_in_team === "leader" ? "Danton" : m.role_in_team}
                          </span>
                        </td>
                        <td className="p-2 sm:p-2.5 border-r border-bramasta-ink/20">{m.nisn || "-"}</td>
                        <td className="p-2 sm:p-2.5 border-r border-bramasta-ink/20">{m.position_label || "-"}</td>
                        <td className="p-2 sm:p-2.5 border-r border-bramasta-ink/20">
                          {m.photo_url ? (
                            <a
                              href={m.photo_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-bramasta-ink underline font-bold"
                            >
                              Lihat Foto
                            </a>
                          ) : (
                            <span className="text-bramasta-ink-mute">-</span>
                          )}
                        </td>
                        {!isLocked && (
                          <td className="p-2 sm:p-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteMember(m.id)}
                              className="text-[#8C1D18] hover:underline uppercase font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <NewsRule variant="thin" className="my-4" />

            {/* Aksi Kunci Roster Final */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="text-xs font-bodoni text-bramasta-ink-soft max-w-md">
                {isLocked ? (
                  <p>
                    Anggota tim telah dikunci untuk verifikasi teknis dewan juri. Bila perlu perbaikan darurat sebelum Technical Meeting, klik buka kuncian.
                  </p>
                ) : (
                  <p>
                    Pastikan susunan danton dan pasukan telah lengkap. Kuota minimal tim adalah {minMembers} orang.
                  </p>
                )}
              </div>

              <div className="w-full sm:w-auto">
                {isLocked ? (
                  <button
                    type="button"
                    onClick={handleUnsubmitRoster}
                    disabled={loading}
                    className="w-full sm:w-auto px-5 py-2.5 border-2 border-bramasta-ink bg-paper text-bramasta-ink font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-bramasta-ink hover:text-white transition-colors cursor-pointer"
                  >
                    Buka Kuncian Anggota tim (Revisi)
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitRoster}
                    disabled={loading || !isQuotaFulfilled}
                    className="w-full sm:w-auto px-6 py-3 bg-[#1E562A] text-white font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#164220] transition-colors shadow-sm disabled:opacity-40 cursor-pointer"
                  >
                    Kunci & Ajukan Berkas Anggota tim &rarr;
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL WIZARD PENDAFTARAN CEPAT (STEP-BY-STEP & SESSION PERSISTENCE) ── */}
      <RegistrationWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        categories={categories}
        event={event}
        initialCategoryId={initialCategoryParam}
        onSuccess={handleWizardSuccess}
      />
    </div>
  );
}
