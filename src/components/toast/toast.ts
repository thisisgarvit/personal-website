/**
 * Shared toast + polite-live-region primitive (PRD §13: ONE polite live
 * region announces deliberate state changes).
 *
 * API (importable from any client component, both build lanes):
 *
 *   import { toast, announce } from "@/components/toast/toast";
 *
 *   toast("event logged: banner_dismissed. noted.");
 *     → shows a visual toast AND announces it politely.
 *   toast(message, { announce: false })
 *     → visual toast only (e.g. decorative confirmations).
 *   announce("Phone number revealed");
 *     → polite announcement only, no visual toast.
 *
 * The <Toaster /> component (mounted once in the root layout) renders the
 * toast stack and the single polite live region. Do NOT render additional
 * aria-live regions elsewhere — route announcements through this module.
 */

export interface ToastEvent {
  id: number;
  message: string;
  /** Whether the polite live region should announce the message. */
  announce: boolean;
  /** Visual-only=false events render no toast (live region only). */
  visual: boolean;
}

type Listener = (event: ToastEvent) => void;

const listeners = new Set<Listener>();
let nextId = 1;

export function subscribeToasts(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit(event: ToastEvent): void {
  for (const listener of listeners) listener(event);
}

export function toast(
  message: string,
  options: { announce?: boolean } = {},
): void {
  emit({
    id: nextId++,
    message,
    announce: options.announce ?? true,
    visual: true,
  });
}

export function announce(message: string): void {
  emit({ id: nextId++, message, announce: true, visual: false });
}
