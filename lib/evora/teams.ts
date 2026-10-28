import { evoraRequest, EVORA_EVENT_SLUG } from "./client";
import type { EvoraTeam } from "@/types/evora";

export interface CreateTeamPayload {
  category_id: string;
  team_name: string;
  school_name?: string;
  school?: string;
  logo_url?: string;
  coach_name?: string;
  coach_phone?: string;
  payment_proof_url?: string;
}

export async function registerTeam(
  payload: CreateTeamPayload,
  eventSlug: string = EVORA_EVENT_SLUG
): Promise<{ ok: boolean; team_id: string; status: string }> {
  return await evoraRequest<{ ok: boolean; team_id: string; status: string }>(
    `/events/${eventSlug}/teams`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function getMyTeams(): Promise<EvoraTeam[]> {
  try {
    return await evoraRequest<EvoraTeam[]>("/teams/me");
  } catch (err) {
    return [];
  }
}

export async function getTeamDetail(teamId: string): Promise<EvoraTeam> {
  return await evoraRequest<EvoraTeam>(`/teams/${teamId}`);
}

export async function updateTeamName(
  teamId: string,
  teamName: string
): Promise<EvoraTeam> {
  return await evoraRequest<EvoraTeam>(`/teams/${teamId}`, {
    method: "PATCH",
    body: JSON.stringify({ team_name: teamName }),
  });
}

export async function updateTeam(
  teamId: string,
  payload: Partial<CreateTeamPayload>
): Promise<EvoraTeam> {
  return await evoraRequest<EvoraTeam>(`/teams/${teamId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function submitTeamRoster(
  teamId: string
): Promise<{ ok: boolean; status: string }> {
  return await evoraRequest<{ ok: boolean; status: string }>(
    `/teams/${teamId}/submit-roster`,
    {
      method: "POST",
      body: JSON.stringify({}),
    }
  );
}

export async function unsubmitTeamRoster(
  teamId: string
): Promise<{ ok: boolean; status: string }> {
  return await evoraRequest<{ ok: boolean; status: string }>(
    `/teams/${teamId}/unsubmit-roster`,
    {
      method: "POST",
      body: JSON.stringify({}),
    }
  );
}

