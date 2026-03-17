import { Sparkles } from "lucide-react";

interface WelcomeStepProps {
  onConnect: () => void;
  onManual: () => void;
  onSkip: () => void;
}

export function WelcomeStep({ onConnect, onManual, onSkip }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center gap-8 rounded-[20px] border border-glass-border bg-glass-bg p-8 backdrop-blur-[12px] shadow-glass">
      <Sparkles size={24} className="text-accent-primary" aria-hidden="true" />

      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="font-display text-2xl font-bold text-text-primary">
          Welcome to AETHER.
        </h2>
        <p className="max-w-[360px] font-body text-[15px] leading-[1.7] text-text-secondary">
          Connect your first account or add assets manually. Your financial
          co-pilot is ready.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <button
          onClick={onConnect}
          className="h-[44px] w-full rounded-[8px] bg-accent-primary font-body text-sm font-medium text-white shadow-glow transition-[background,box-shadow,transform] duration-160 hover:bg-accent-bright hover:shadow-glow-hover active:scale-[0.97] focus-ring"
        >
          Connect an account
        </button>
        <button
          onClick={onManual}
          className="h-[44px] w-full rounded-[8px] border border-accent-primary font-body text-sm font-medium text-accent-primary transition-[background,border-color] duration-160 hover:border-accent-bright hover:bg-accent-subtle focus-ring"
        >
          Add manually
        </button>
        <button
          onClick={onSkip}
          className="font-body text-sm font-medium text-text-muted hover:text-text-secondary focus-ring"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
