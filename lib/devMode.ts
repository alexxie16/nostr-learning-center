const STORAGE_KEY = "nostr-learn-dev-mode";

export function isDeveloperMode(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function setDeveloperMode(on: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, on ? "true" : "false");
}
