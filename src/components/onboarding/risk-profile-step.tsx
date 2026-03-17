import { Shield, Scale, TrendingUp, Check } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { RISK_PROFILES } from "@/src/lib/constants";
import type { RiskTolerance } from "@/src/types/database";

const iconMap = {
  Shield,
  Scale,
  TrendingUp,
};

interface RiskProfileStepProps {
  selected: RiskTolerance | null;
  onSelect: (value: RiskTolerance) => void;
  onContinue: () => void;
  onSkip: () => void;
}

export function RiskProfileStep({
  selected,
  onSelect,
  onContinue,
  onSkip,
}: RiskProfileStepProps) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-[28px] font-bold text-text-primary">
          How do you handle risk?
        </h2>
        <p className="mt-2 font-body text-sm text-text-muted">
          Calibrates your AI advisor recommendations. Changeable anytime.
        </p>
      </div>

      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Risk tolerance">
        {RISK_PROFILES.map((profile) => {
          const Icon = iconMap[profile.icon as keyof typeof iconMap];
          const isSelected = selected === profile.id;

          return (
            <button
              key={profile.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(profile.id as RiskTolerance)}
              className={cn(
                "relative flex items-start gap-3 rounded-[16px] border p-4 text-left backdrop-blur-[12px] transition-[border-color,box-shadow,transform] duration-200",
                "bg-glass-bg hover:-translate-y-0.5",
                isSelected
                  ? "border-accent-primary bg-accent-subtle shadow-[0_0_20px_rgba(124,58,237,0.2)]"
                  : "border-glass-border hover:border-border-accent hover:shadow-[0_12px_48px_rgba(124,58,237,0.15)]"
              )}
            >
              <Icon
                size={20}
                className={cn("mt-0.5 flex-shrink-0", profile.iconColor)}
                aria-hidden="true"
              />
              <div>
                <span className="font-display text-base font-semibold text-text-primary">
                  {profile.label}
                </span>
                <p className="mt-0.5 font-body text-[13px] text-text-secondary">
                  {profile.description}
                </p>
              </div>
              {isSelected && (
                <Check
                  size={18}
                  className="absolute right-4 top-4 text-accent-primary"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onContinue}
          disabled={!selected}
          className={cn(
            "h-[44px] w-full rounded-[8px] font-body text-sm font-medium transition-[background,box-shadow,transform] duration-160 active:scale-[0.97]",
            selected
              ? "bg-accent-primary text-white shadow-glow hover:bg-accent-bright hover:shadow-glow-hover"
              : "cursor-not-allowed bg-bg-elevated text-text-muted"
          )}
        >
          Continue
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
