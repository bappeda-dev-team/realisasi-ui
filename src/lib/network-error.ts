export function isNetworkError(err: Error): boolean {
    if (!navigator.onLine) return true;
    const msg = err.message.toLowerCase();
    return (
        msg.includes("failed to fetch") ||
        msg.includes("jaringan error") ||
        msg.includes("network request failed") ||
        msg.includes("Load failed") ||
        (!err.message.startsWith("HTTP") && !err.message.includes("Session"))
    );
}

let lastNotify = 0;
const DEBOUNCE_MS = 3000;

export function notifyNetworkError() {
    const now = Date.now();
    if (now - lastNotify < DEBOUNCE_MS) return;
    lastNotify = now;
    window.dispatchEvent(new CustomEvent("network:error"));
}
