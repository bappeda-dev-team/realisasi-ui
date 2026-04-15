import Cookies from "js-cookie";

export const SESSION_ID_COOKIE = "sessionId";
export const SESSION_ID_STORAGE_KEY = "sessionId";
const LEGACY_SESSION_ID_STORAGE_KEY = "realisasi.sessionId";
const COOKIE_PATHS_TO_CLEAR = ["/", "/realisasi"] as const;

function isBrowser() {
  return typeof window !== "undefined";
}

function getStorage(): Storage | undefined {
  if (!isBrowser()) return undefined;
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function isHttps() {
  return isBrowser() && window.location.protocol === "https:";
}

function getCookieOptions() {
  return {
    path: "/",
    sameSite: "lax" as const,
    expires: 7,
    secure: isHttps(),
  };
}

function setCookieSessionId(sessionId: string) {
  Cookies.set(SESSION_ID_COOKIE, sessionId, getCookieOptions());
}

function removeCookieSessionId() {
  for (const path of COOKIE_PATHS_TO_CLEAR) {
    Cookies.remove(SESSION_ID_COOKIE, { path });
  }
}

function writeStorageSessionId(sessionId: string) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(SESSION_ID_STORAGE_KEY, sessionId);
  storage.removeItem(LEGACY_SESSION_ID_STORAGE_KEY);
}

function readStorageSessionId(): string | undefined {
  const storage = getStorage();
  if (!storage) return undefined;

  const sessionId =
    storage.getItem(SESSION_ID_STORAGE_KEY) ??
    storage.getItem(LEGACY_SESSION_ID_STORAGE_KEY);

  if (!sessionId) return undefined;

  // normalize to the current key and clean up legacy key
  storage.setItem(SESSION_ID_STORAGE_KEY, sessionId);
  storage.removeItem(LEGACY_SESSION_ID_STORAGE_KEY);
  return sessionId;
}

function clearStorageSessionId() {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(SESSION_ID_STORAGE_KEY);
  storage.removeItem(LEGACY_SESSION_ID_STORAGE_KEY);
}

export function setSessionId(sessionId: string) {
  if (!sessionId) return;

  setCookieSessionId(sessionId);
  writeStorageSessionId(sessionId);
}

export function getSessionId(): string | undefined {
  const fromCookie = Cookies.get(SESSION_ID_COOKIE);
  if (fromCookie) return fromCookie;

  const fromStorage = readStorageSessionId();
  if (fromStorage) {
    setCookieSessionId(fromStorage);
    return fromStorage;
  }

  return undefined;
}

export function clearSessionId() {
  removeCookieSessionId();
  clearStorageSessionId();
}
