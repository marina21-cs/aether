import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/src/lib/utils";

export type GuidedTourPlacement = "top" | "right" | "bottom" | "left" | "center";

export interface GuidedTourStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  placement?: GuidedTourPlacement;
}

interface GuidedTourProps {
  open: boolean;
  steps: GuidedTourStep[];
  onClose: () => void;
  onFinish: () => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function GuidedTour({ open, steps, onClose, onFinish }: GuidedTourProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipSize, setTooltipSize] = useState({ width: 320, height: 220 });
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const activeStep = steps[activeIndex] ?? null;
  const isLastStep = activeIndex === steps.length - 1;

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const resolveTargetRect = useCallback(() => {
    if (!open || !activeStep) {
      setTargetRect(null);
      return;
    }

    if (!activeStep.target) {
      setTargetRect(null);
      return;
    }

    const node = document.querySelector(activeStep.target) as HTMLElement | null;
    if (!node) {
      setTargetRect(null);
      return;
    }

    node.scrollIntoView({
      block: "center",
      inline: "center",
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    const rect = node.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      setTargetRect(null);
      return;
    }

    setTargetRect(rect);
  }, [activeStep, open, prefersReducedMotion]);

  useEffect(() => {
    if (!open) return;

    const raf = window.requestAnimationFrame(() => {
      resolveTargetRect();
    });

    const onViewportChange = () => resolveTargetRect();
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, { passive: true });

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange);
    };
  }, [open, activeStep?.id, resolveTargetRect]);

  useEffect(() => {
    if (!open || !tooltipRef.current) return;
    const rect = tooltipRef.current.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      setTooltipSize({ width: rect.width, height: rect.height });
    }
  }, [open, activeStep?.id, targetRect]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const tooltipPosition = useMemo(() => {
    if (typeof window === "undefined") {
      return { top: 24, left: 24 };
    }

    const margin = 16;
    const gap = 12;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const tooltipWidth = clamp(tooltipSize.width, 280, Math.max(280, viewportWidth - margin * 2));
    const tooltipHeight = tooltipSize.height;

    const placement = activeStep?.placement ?? "bottom";

    if (!targetRect || placement === "center") {
      return {
        top: clamp((viewportHeight - tooltipHeight) / 2, margin, viewportHeight - tooltipHeight - margin),
        left: clamp((viewportWidth - tooltipWidth) / 2, margin, viewportWidth - tooltipWidth - margin),
      };
    }

    const centerX = targetRect.left + targetRect.width / 2;
    const centerY = targetRect.top + targetRect.height / 2;

    let top = targetRect.bottom + gap;
    let left = centerX - tooltipWidth / 2;

    if (placement === "top") {
      top = targetRect.top - tooltipHeight - gap;
      left = centerX - tooltipWidth / 2;
    }

    if (placement === "left") {
      top = centerY - tooltipHeight / 2;
      left = targetRect.left - tooltipWidth - gap;
    }

    if (placement === "right") {
      top = centerY - tooltipHeight / 2;
      left = targetRect.right + gap;
    }

    return {
      top: clamp(top, margin, viewportHeight - tooltipHeight - margin),
      left: clamp(left, margin, viewportWidth - tooltipWidth - margin),
    };
  }, [activeStep?.placement, targetRect, tooltipSize.height, tooltipSize.width]);

  if (!open || !activeStep) {
    return null;
  }

  const placement = activeStep.placement ?? "bottom";
  const showArrow = placement !== "center" && targetRect;

  return (
    <div className="fixed inset-0 z-[120]">
      {targetRect ? (
        <div
          className="pointer-events-none fixed z-[122] rounded-2xl border border-accent-primary/80 transition-all duration-200"
          style={{
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
          }}
        />
      ) : null}

      <button
        type="button"
        onClick={onClose}
        aria-label="Close tutorial"
        className="fixed inset-0 z-[121] cursor-default bg-transparent"
      />

      <button
        type="button"
        onClick={onClose}
        className="motion-tap fixed right-4 top-4 z-[124] inline-flex h-10 items-center rounded-lg border border-glass-border bg-bg-surface px-3 text-xs font-semibold text-text-primary"
        aria-label="Skip tutorial"
      >
        Skip Tour
      </button>

      <div
        ref={tooltipRef}
        className="fixed z-[123] w-[min(360px,calc(100vw-32px))] rounded-2xl border border-glass-border bg-bg-surface/95 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
        role="dialog"
        aria-modal="true"
        aria-label={`Tutorial step ${activeIndex + 1}`}
      >
        {showArrow && (
          <div
            className={cn(
              "absolute h-3 w-3 rotate-45 border border-glass-border bg-bg-surface",
              placement === "bottom" && "-top-1.5 left-1/2 -translate-x-1/2 border-r-0 border-b-0",
              placement === "top" && "-bottom-1.5 left-1/2 -translate-x-1/2 border-l-0 border-t-0",
              placement === "left" && "-right-1.5 top-1/2 -translate-y-1/2 border-l-0 border-b-0",
              placement === "right" && "-left-1.5 top-1/2 -translate-y-1/2 border-r-0 border-t-0"
            )}
          />
        )}

        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-accent-primary">
              Product Tour {activeIndex + 1}/{steps.length}
            </p>
            <h3 className="mt-1 font-display text-lg font-semibold text-text-primary">{activeStep.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="motion-tap inline-flex h-8 w-8 items-center justify-center rounded-md border border-glass-border bg-bg-dark text-text-secondary hover:text-text-primary"
            aria-label="Skip tutorial"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>

        <p className="text-sm leading-relaxed text-text-secondary">{activeStep.description}</p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
            disabled={activeIndex === 0}
            className="motion-tap inline-flex h-10 items-center rounded-lg border border-glass-border bg-bg-dark px-3 text-xs text-text-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>

          <button
            type="button"
            onClick={() => {
              if (isLastStep) {
                onFinish();
                return;
              }
              setActiveIndex((prev) => prev + 1);
            }}
            className="motion-tap inline-flex h-10 items-center rounded-lg bg-accent-primary px-4 text-xs font-semibold text-[#09090B]"
          >
            {isLastStep ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
