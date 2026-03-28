import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import App from "./App.tsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Unable to mount app: #root element not found.");
}

const root = createRoot(rootElement);

if (!PUBLISHABLE_KEY) {
  root.render(
    <StrictMode>
      <div className="flex min-h-screen items-center justify-center bg-bg-primary px-6 text-center">
        <div className="max-w-lg rounded-2xl border border-accent-danger/40 bg-accent-danger/10 p-6">
          <h1 className="font-display text-2xl font-bold text-text-primary">AETHER Setup Required</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Missing environment variable: VITE_CLERK_PUBLISHABLE_KEY.
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Add the key in your deployment environment, then redeploy.
          </p>
        </div>
      </div>
    </StrictMode>
  );
} else {
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </StrictMode>
  );
}
