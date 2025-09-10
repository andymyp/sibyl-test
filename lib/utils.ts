import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@/lib/supabase/client";
import { store } from "./store";
import { AppAction } from "./store/slices/app-slice";

const supabase = createClient();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function anonymizeText(text: string) {
  return text
    .replace(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      "[EMAIL REDACTED]"
    )
    .replace(
      /\+?\d{1,4}?[-.\s]?\(?\d{1,4}\)?([-.\s]?\d{2,4}){2,6}/g,
      "[PHONE REDACTED]"
    );
}

export async function getSignedUrl(storageKey: string) {
  const { data, error } = await supabase.storage
    .from("case-files")
    .createSignedUrl(storageKey, 60 * 5, { download: true });

  if (error) throw error;
  return data.signedUrl;
}

export async function downloadFile(storageKey: string, filename: string) {
  store.dispatch(AppAction.setLoading(true));

  try {
    const signedUrl = await getSignedUrl(storageKey);

    const a = document.createElement("a");
    a.href = signedUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    store.dispatch(AppAction.setLoading(false));
  }
}
