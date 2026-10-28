import { evoraRequest } from "./client";
import type { EvoraTeamMember, RoleInTeam } from "@/types/evora";

export interface CreateMemberPayload {
  full_name: string;
  role_in_team: RoleInTeam;
  position_label?: string;
  nisn?: string;
  photo_url?: string;
  phone?: string;
  email?: string;
}

export async function addTeamMember(
  teamId: string,
  payload: CreateMemberPayload
): Promise<EvoraTeamMember> {
  return await evoraRequest<EvoraTeamMember>(`/teams/${teamId}/members`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTeamMember(
  teamId: string,
  memberId: string,
  payload: Partial<CreateMemberPayload>
): Promise<EvoraTeamMember> {
  return await evoraRequest<EvoraTeamMember>(`/teams/${teamId}/members/${memberId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteTeamMember(
  teamId: string,
  memberId: string
): Promise<{ ok: boolean }> {
  return await evoraRequest<{ ok: boolean }>(`/teams/${teamId}/members/${memberId}`, {
    method: "DELETE",
  });
}

