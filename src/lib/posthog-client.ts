interface PostHogClient {
  init(
    token: string,
    options: {
      api_host: string;
      defaults: "2026-01-30";
      capture_exceptions: true;
      debug: boolean;
    },
  ): void;
  capture(event: string, properties?: object): void;
}

let clientPromise: Promise<PostHogClient | null> | null = null;
let scheduled = false;

function readConfig() {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  return token && host ? { token, host } : null;
}

async function loadPostHog(): Promise<PostHogClient | null> {
  const config = readConfig();
  if (!config) return null;
  if (clientPromise === null) {
    clientPromise = import("posthog-js")
      .then(({ default: posthog }) => {
        posthog.init(config.token, {
          api_host: config.host,
          defaults: "2026-01-30",
          capture_exceptions: true,
          debug: process.env.NODE_ENV === "development",
        });
        return posthog;
      })
      .catch(() => {
        // A navigation can abort the in-flight lazy chunk fetch. Analytics
        // must never fail the page: swallow the rejection and drop the
        // cached promise so a later call retries the import.
        clientPromise = null;
        return null;
      });
  }
  return clientPromise;
}

export function initializePostHog(): void {
  const config = readConfig();
  if (!config) {
    if (process.env.NODE_ENV === "development") {
      const missing = !process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
        ? "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN"
        : "NEXT_PUBLIC_POSTHOG_HOST";
      throw new Error(
        `${missing} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missing} is configured`,
      );
    }
    return;
  }
  if (scheduled) return;
  scheduled = true;
  const start = () => void loadPostHog();
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(start, { timeout: 1800 });
  } else {
    window.setTimeout(start, 0);
  }
}

export function capturePostHog(event: string, properties?: object): void {
  void loadPostHog().then((posthog) => posthog?.capture(event, properties));
}
