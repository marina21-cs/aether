import { useEffect, useRef, useState } from "react";
import { CircleHelp } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { getGlossaryEntry } from "../literacy-content";

interface GlossaryTermProps {
  term: string;
  label?: string;
  className?: string;
  align?: "left" | "right";
  side?: "top" | "bottom";
}

export function GlossaryTerm({
  term,
  label,
  className,
  align = "left",
  side = "bottom",
}: GlossaryTermProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const entry = getGlossaryEntry(term);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!target || !(target instanceof Node)) return;
      if (containerRef.current?.contains(target)) return;
      setOpen(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const text = label ?? term;

  if (!entry) {
    return <span className={className}>{text}</span>;
  }

  const hasChipStyle = Boolean(className);

  return (
    <span ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex items-center gap-1 rounded text-accent-primary transition-colors focus-ring",
          hasChipStyle
            ? "hover:bg-white/5 hover:text-accent-bright"
            : "px-0.5 underline decoration-dotted underline-offset-4 hover:text-accent-bright",
          className
        )}
        aria-expanded={open}
        aria-label={`Open definition for ${entry.term}`}
      >
        <span>{text}</span>
        <CircleHelp className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={`${entry.term} definition`}
          className={cn(
            "absolute z-[80] w-[280px] max-w-[calc(100vw-1rem)] rounded-[12px] border border-glass-border bg-bg-elevated p-3 shadow-[0_14px_32px_rgba(0,0,0,0.45)]",
            side === "top" ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          <p className="text-[11px] uppercase tracking-[0.08em] text-accent-primary">Glossary</p>
          <p className="mt-1 text-sm font-semibold text-text-primary">{entry.term}</p>
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">{entry.plainDefinition}</p>
          <p className="mt-2 rounded-[8px] border border-glass-border bg-bg-surface px-2.5 py-2 text-[11px] text-text-muted">
            Why it matters: {entry.whyItMatters}
          </p>
        </div>
      )}
    </span>
  );
}
