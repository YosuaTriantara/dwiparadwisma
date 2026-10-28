/**
 * Tipe Data Resmi untuk Integrasi API EVORA Engine
 * Berdasarkan Panduan Integrasi API Platform Luar
 */

export interface EvoraUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
}

export interface AuthResponse {
  access_token: string;
  user: EvoraUser;
}

export interface RegisterResponse {
  user_id: string;
  email: string;
  full_name: string;
}

export interface EvoraJudge {
  id: string;
  name: string;
  role?: string;
  bio?: string;
  avatar_url?: string;
  photo_url?: string;
  institution?: string;
}

export interface EvoraTimelineItem {
  id?: string;
  title: string;
  date?: string;
  description?: string;
}

export interface EvoraDocument {
  id?: string;
  title: string;
  url: string;
  type?: string;
  size?: string;
  description?: string;
  download_url?: string;
}

export interface EvoraEvent {
  id: string;
  name: string;
  slug: string;
  description: string;
  banner_url?: string;
  registration_status: "upcoming" | "registration_open" | "registration_closed" | "ongoing" | "completed" | "draft" | string;
  registration_start_date?: string | null;
  registration_end_date?: string | null;
  technical_meeting_date?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_paid: boolean;
  registration_fee: string;
  payment_method: string;
  is_listed: boolean;
  judges?: EvoraJudge[];
  timeline?: EvoraTimelineItem[];
  categories?: EvoraCategory[];
  payment_info?: {
    bank_name?: string;
    account_holder?: string;
    account_number?: string;
    qris_url?: string;
  };
  organizer_info?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    whatsapp?: string;
    website?: string;
    logo_url?: string;
    description?: string;
  };
  documents?: EvoraDocument[] | Record<string, any> | null;
}

export interface EvoraCategory {
  id: string;
  event_id: string;
  name: string;
  min_team_members: number;
  max_team_members: number;
  slot_count: number;
  slot_taken: number;
}

export type TeamStatus =
  | "submitted"
  | "registration_rejected"
  | "registration_verified"
  | "roster_submitted"
  | "roster_rejected"
  | "verified";

export type RoleInTeam = "leader" | "member" | "official";

export interface EvoraTeamMember {
  id: string;
  team_id: string;
  full_name: string;
  role_in_team: RoleInTeam;
  position_label?: string;
  nisn?: string;
  photo_url?: string;
  phone?: string;
  email?: string;
  created_at?: string;
}

export interface EvoraTeam {
  id: string;
  team_name: string;
  school_name?: string | null;
  school?: string | null;
  status: TeamStatus;
  category_id?: string;
  logo_url?: string | null;
  coach_name?: string | null;
  coach_phone?: string | null;
  payment_proof_url?: string | null;
  created_at?: string;
  category?: {
    id: string;
    name: string;
    min_team_members: number;
    max_team_members: number;
  };
  event?: {
    id: string;
    name: string;
    registration_status: string;
  };
  members?: EvoraTeamMember[];
}

export interface UploadResponse {
  url: string;
  fileId: string;
}

declare global {
  interface Window {
    google?: any;
  }
}

