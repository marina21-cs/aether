import { useState } from "react";
import { Send, Square } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface AdvisorInputProps {
  onSubmit: (input: string) => void;
  onStop?: () => void;
  disabled?: boolean;
  isStreaming?: boolean;
}

export function AdvisorInput({
  onSubmit,
  onStop,
  disabled = false,
  isStreaming = false,
}: AdvisorInputProps) {
  const [input, setInput] = useState("");

  const submit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled || isStreaming) return;
    if (trimmed.length > 5000) return;
    onSubmit(trimmed);
    setInput("");
  };

  return (
    <div className="border-t border-glass-border p-3">
      <div className="flex items-end gap-2">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          rows={2}
          maxLength={5000}
          placeholder="Ask your advisor about allocation, risk, inflation, fees, or projections..."
          disabled={disabled}
          className="min-h-[64px] flex-1 resize-none rounded-[10px] border border-glass-border bg-bg-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary/50 focus:outline-none"
        />

        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-accent-warning/40 bg-accent-warning/10 text-accent-warning transition-colors hover:bg-accent-warning/20"
            aria-label="Stop response"
          >
            <Square size={15} />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={disabled || input.trim().length === 0}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-[10px] transition-colors",
              input.trim().length > 0 && !disabled
                ? "bg-accent-primary text-[#09090B] hover:bg-accent-primary/90"
                : "bg-bg-elevated text-text-muted"
            )}
            aria-label="Send message"
          >
            <Send size={15} />
          </button>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-text-muted">
        <span>Enter to send, Shift+Enter for newline</span>
        <span>{input.length}/5000</span>
      </div>
    </div>
  );
}
