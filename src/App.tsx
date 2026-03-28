import { type ReactNode, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/react";
import { apiFetch } from "@/src/lib/api/client";

import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import HoldingsPage from "./pages/HoldingsPage";
import MarketUpdates from "./pages/MarketUpdates";
import { ImportData } from "./pages/ImportData";
import { AIAdvisor } from "./pages/AIAdvisor";
import { GlassBox } from "./pages/GlassBox";
import { FeeScanner } from "./pages/FeeScanner";
import { Performance } from "./pages/Performance";
import { Settings } from "./pages/Settings";
import { Simulator } from "./pages/Simulator";
import { Alerts } from "./pages/Alerts";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user?.id) {
      return;
    }

    const userId = user.id;
    const userEmail = user.primaryEmailAddress?.emailAddress ?? null;
    const userFullName = user.fullName ?? null;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, 8000);
    let active = true;

    async function ensureProfile() {
      try {
        const response = await apiFetch("/api/v1/user/ensure-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            userId,
            email: userEmail,
            fullName: userFullName,
          }),
        });

        if (!response.ok) {
          const details = (await response.json().catch(() => null)) as
            | { error?: { message?: string } }
            | null;
          throw new Error(
            details?.error?.message || `Profile bootstrap failed (${response.status}).`
          );
        }
      } catch (error) {
        if (!active || (error as Error).name === "AbortError") return;
        console.warn(
          "Proceeding without blocking route: profile bootstrap failed.",
          error
        );
      } finally {
        window.clearTimeout(timeoutId);
      }
    }

    ensureProfile();

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [
    isLoaded,
    isSignedIn,
    user?.id,
    user?.fullName,
    user?.primaryEmailAddress?.emailAddress,
  ]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-primary border-t-transparent" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-primary border-t-transparent" />
      </div>
    );
  }

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <PublicOnlyRoute>
              <LandingPage />
            </PublicOnlyRoute>
          }
        />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        {/* Protected routes */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="holdings" element={<HoldingsPage />} />
          <Route path="market" element={<MarketUpdates />} />
          <Route path="data" element={<ImportData />} />
          <Route path="advisor" element={<AIAdvisor />} />
          <Route path="glass-box" element={<GlassBox />} />
          <Route path="simulator" element={<Simulator />} />
          <Route path="fees" element={<FeeScanner />} />
          <Route path="performance" element={<Performance />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
