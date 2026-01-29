import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import posthog from "posthog-js";
import { Analytics } from "@vercel/analytics/react";
import App from "./app/App.tsx";
import "./styles/index.css";

// Initialize Sentry for error monitoring
if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN || "",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.MODE,
  });
}

// Initialize PostHog for product analytics
if (import.meta.env.PROD && import.meta.env.VITE_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || "https://eu.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
  });
}

// Render app with analytics
createRoot(document.getElementById("root")!).render(
  <>
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <App />
    </Sentry.ErrorBoundary>
    <Analytics />
  </>
);

// Error fallback component
function ErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
        <p className="text-gray-600 mb-4">Une erreur est survenue.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          Recharger
        </button>
      </div>
    </div>
  );
}
  