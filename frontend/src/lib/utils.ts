import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getApiErrorMsg(err: any, fallback: string): string {
  let errorMsg = err?.response?.data?.error;
  const detail = err?.response?.data?.detail;
  
  if (!errorMsg && Array.isArray(detail) && detail.length > 0) {
    errorMsg = detail[0].msg;
  } else if (!errorMsg && typeof detail === 'string') {
    errorMsg = detail;
  }
  
  return errorMsg || fallback;
}
