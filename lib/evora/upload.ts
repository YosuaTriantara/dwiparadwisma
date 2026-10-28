import { evoraRequest } from "./client";
import type { UploadResponse } from "@/types/evora";

export async function uploadFileBase64(
  fileBase64: string,
  fileName: string,
  folder: string = "/evora/events/members"
): Promise<UploadResponse> {
  return await evoraRequest<UploadResponse>("/events/upload", {
    method: "POST",
    body: JSON.stringify({
      file: fileBase64,
      fileName,
      folder,
    }),
  });
}

/**
 * Helper mengubah File objek browser menjadi string Base64 Data URL
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

