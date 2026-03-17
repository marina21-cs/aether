import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/react";
import { GlowBlobs } from "@/src/components/layout/glow-blobs";
import { BrandPanel } from "@/src/components/auth/brand-panel";
import { RiskProfileStep } from "@/src/components/onboarding/risk-profile-step";
import { CurrencyStep } from "@/src/components/onboarding/currency-step";
import { WelcomeStep } from "@/src/components/onboarding/welcome-step";
import { apiUrl } from "@/src/lib/api/client";
import type { RiskTolerance, BaseCurrency } from "@/src/types/database";

type Step = "risk" | "currency" | "welcome";

const STEPS: Step[] = ["risk", "currency", "welcome"];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [step, setStep] = useState<Step>("risk");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance | null>(
    null
  );
  const [baseCurrency, setBaseCurrency] = useState<BaseCurrency>("PHP");

  const currentStepIndex = STEPS.indexOf(step);

  async function saveOnboarding() {
    if (!user) return;

    const response = await fetch(apiUrl("/api/v1/user/ensure-profile"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? null,
        fullName: user.fullName ?? null,
        risk_tolerance: riskTolerance || "moderate",
        base_currency: baseCurrency,
        onboarding_complete: true,
      }),
    });

    if (!response.ok) {
      const details = (await response.json().catch(() => null)) as
        | { error?: { message?: string } }
        | null;
      throw new Error(details?.error?.message || "Failed to save onboarding data.");
    }
  }

  async function handleFinishSetup() {
    try {
      setSaveError(null);
      await saveOnboarding();
      setStep("welcome");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save onboarding data.";
      setSaveError(message);
    }
  }

  async function handleComplete() {
    try {
      setSaveError(null);
      await saveOnboarding();
      navigate("/dashboard/data?start=import");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save onboarding data.";
      setSaveError(message);
    }
  }

  return (
    <div className="relative flex min-h-screen">
      <GlowBlobs />
      <BrandPanel />
      <div className="flex w-full flex-col items-center justify-center bg-bg-primary px-6 lg:w-1/2">
        <div className="w-full max-w-[400px]">
          {saveError && (
            <div className="mb-4 rounded-lg border border-accent-danger/40 bg-accent-danger/10 px-3 py-2 text-xs text-accent-danger">
              {saveError}
            </div>
          )}

          {/* Progress Dots */}
          {step !== "welcome" && (
            <div className="mb-8 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                {STEPS.slice(0, 3).map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`h-2.5 w-2.5 rounded-full transition-colors ${
                        i <= currentStepIndex
                          ? "bg-accent-primary shadow-[0_0_8px_rgba(124,58,237,0.4)]"
                          : "border border-text-muted"
                      }`}
                    />
                    {i < 2 && (
                      <div className="h-px w-8 bg-border" />
                    )}
                  </div>
                ))}
              </div>
              <p className="font-body text-xs text-text-muted">
                Step {currentStepIndex + 1} of 3
              </p>
            </div>
          )}

          {/* Step Content */}
          {step === "risk" && (
            <RiskProfileStep
              selected={riskTolerance}
              onSelect={setRiskTolerance}
              onContinue={() => setStep("currency")}
              onSkip={() => setStep("currency")}
            />
          )}
          {step === "currency" && (
            <CurrencyStep
              selected={baseCurrency}
              onSelect={setBaseCurrency}
              onFinish={handleFinishSetup}
            />
          )}
          {step === "welcome" && (
            <WelcomeStep
              onConnect={handleComplete}
              onManual={handleComplete}
              onSkip={handleComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
