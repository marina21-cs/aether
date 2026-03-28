import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@clerk/react";
import { Brain, Sparkles } from "lucide-react";
import { AdvisorInput } from "@/src/components/advisor/advisor-input";
import { AdvisorMessage } from "@/src/components/advisor/advisor-message";
import { AdvisorDisclaimer } from "@/src/components/advisor/advisor-disclaimer";
import { apiUrl } from "@/src/lib/api/client";
import type {
  AdvisorErrorResponse,
  AdvisorMessage as AdvisorMessageType,
  AdvisorQuickPrompt,
  AdvisorRateLimit,
} from "@/src/types/advisor";

interface AdvisorChatProps {
  compact?: boolean;
}

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const QUICK_PROMPTS: AdvisorQuickPrompt[] = [
  {
    id: "summary",
    label: "Portfolio summary",
    prompt: "Give me a summary of my dashboard and holdings, including top allocations and key risks.",
  },
  {
    id: "allocation",
    label: "Allocation check",
    prompt: "How is my current portfolio allocation split and where is concentration risk highest?",
  },
  {
    id: "fees",
    label: "Fee drag",
    prompt: "Estimate how much my fees could cost over the next 10 years.",
  },
  {
    id: "inflation",
    label: "Inflation impact",
    prompt: "Which holdings are most vulnerable to negative real returns based on PH CPI?",
  },
  {
    id: "risk",
    label: "Risk snapshot",
    prompt: "Give me a simple risk snapshot using volatility and downside scenarios.",
  },
];

const INITIAL_ASSISTANT_MESSAGE: AdvisorMessageType = {
  id: "welcome",
  role: "assistant",
  content:
    "Ready. Ask me about your allocation, fee drag, risk, inflation impact, or Glass Box assumptions. I will only provide analysis and never execute actions.",
  createdAt: new Date().toISOString(),
};

function extractErrorMessage(rawError: unknown): string {
  if (rawError && typeof rawError === "object" && "error" in rawError) {
    const casted = rawError as AdvisorErrorResponse;
    if (casted.error?.message) {
      return casted.error.message;
    }
  }

  if (rawError instanceof Error) {
    return rawError.message;
  }

  return "Advisor is temporarily unavailable. Please try again.";
}

export function AdvisorChat({ compact = false }: AdvisorChatProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<AdvisorMessageType[]>([INITIAL_ASSISTANT_MESSAGE]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<AdvisorRateLimit | null>(null);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const typingIntervalRef = useRef<number | null>(null);
  const typingQueueRef = useRef("");
  const renderedContentRef = useRef("");
  const typingMessageIdRef = useRef<string | null>(null);

  const canAsk = Boolean(user?.id) && !isStreaming;

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isStreaming]);

  const stopTypingLoop = useCallback(() => {
    if (typingIntervalRef.current !== null) {
      window.clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  }, []);

  const startTypingLoop = useCallback((messageId: string) => {
    typingMessageIdRef.current = messageId;
    setTypingMessageId(messageId);

    if (typingIntervalRef.current !== null) {
      return;
    }

    typingIntervalRef.current = window.setInterval(() => {
      const activeMessageId = typingMessageIdRef.current;
      if (!activeMessageId) return;

      const queued = typingQueueRef.current;
      if (!queued) return;

      const charsPerTick = Math.min(16, Math.max(2, Math.ceil(queued.length / 24)));
      const nextChunk = queued.slice(0, charsPerTick);
      typingQueueRef.current = queued.slice(charsPerTick);
      renderedContentRef.current += nextChunk;

      const rendered = renderedContentRef.current;
      setMessages((prev) =>
        prev.map((message) =>
          message.id === activeMessageId ? { ...message, content: rendered } : message
        )
      );
    }, 16);
  }, []);

  const flushTypingQueue = useCallback(async (timeoutMs = 2500) => {
    const deadline = Date.now() + timeoutMs;
    while (typingQueueRef.current.length > 0 && Date.now() < deadline) {
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 20);
      });
    }
  }, []);

  const finalizeTyping = useCallback(
    (finalContent: string | null = null) => {
      const activeMessageId = typingMessageIdRef.current;
      const contentToPersist = finalContent ?? renderedContentRef.current;

      if (activeMessageId) {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === activeMessageId
              ? {
                  ...message,
                  content: contentToPersist,
                }
              : message
          )
        );
      }

      typingQueueRef.current = "";
      renderedContentRef.current = contentToPersist;
      typingMessageIdRef.current = null;
      setTypingMessageId(null);
      stopTypingLoop();
    },
    [stopTypingLoop]
  );

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      stopTypingLoop();
    };
  }, [stopTypingLoop]);

  const suggestionSet = useMemo(() => QUICK_PROMPTS.slice(0, compact ? 2 : QUICK_PROMPTS.length), [compact]);

  const stopStreaming = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  };

  const sendMessage = async (input: string) => {
    if (!user?.id || !input.trim() || isStreaming) return;

    setError(null);

    const userMessage: AdvisorMessageType = {
      id: makeId(),
      role: "user",
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    const assistantPlaceholderId = makeId();
    let didFinalize = false;

    const historyForApi = messages
      .filter((message) => message.id !== "welcome")
      .slice(-10)
      .map((message) => ({ role: message.role, content: message.content }));

    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: assistantPlaceholderId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
      },
    ]);

    typingQueueRef.current = "";
    renderedContentRef.current = "";
    startTypingLoop(assistantPlaceholderId);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setIsStreaming(true);

      const response = await fetch(apiUrl("/api/v1/advisor/ask"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          userId: user.id,
          message: input.trim(),
          conversationHistory: historyForApi,
        }),
      });

      const limit = Number(response.headers.get("x-ratelimit-limit") || 0);
      const remaining = Number(response.headers.get("x-ratelimit-remaining") || 0);
      const resetAt = Number(response.headers.get("x-ratelimit-reset") || 0);

      if (limit > 0) {
        setRateLimit({ limit, remaining, resetAt });
      }

      if (!response.ok) {
        let details: unknown = null;
        try {
          details = await response.json();
        } catch {
          details = null;
        }
        throw details || new Error("Advisor request failed.");
      }

      if (!response.body) {
        throw new Error("Advisor stream unavailable.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;

        accumulated += chunk;
        typingQueueRef.current += chunk;
      }

      const trailingChunk = decoder.decode();
      if (trailingChunk) {
        accumulated += trailingChunk;
        typingQueueRef.current += trailingChunk;
      }

      await flushTypingQueue();

      if (!accumulated.trim()) {
        finalizeTyping("No response returned. Please retry your request.");
      } else {
        finalizeTyping(accumulated);
      }
      didFinalize = true;
    } catch (rawError) {
      if ((rawError as Error)?.name === "AbortError") {
        const partialContent = renderedContentRef.current.trim();
        finalizeTyping(
          partialContent.length === 0 ? "Response stopped." : renderedContentRef.current
        );
        didFinalize = true;
      } else {
        setError(extractErrorMessage(rawError));
        finalizeTyping("Advisor temporarily unavailable. Please try again.");
        didFinalize = true;
      }
    } finally {
      if (!didFinalize) {
        finalizeTyping(renderedContentRef.current);
      }
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  return (
    <section className="flex h-full flex-col rounded-[16px] border border-glass-border bg-bg-surface backdrop-blur-[12px]">
      <header className="flex items-center gap-2 border-b border-glass-border px-4 py-3">
        <Brain size={18} className="text-accent-primary" />
        <span className="font-display text-sm font-semibold text-text-primary">AI Advisor</span>
        <span className="ml-auto rounded-full border border-accent-primary/20 bg-accent-subtle px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-accent-primary">
          {isStreaming ? "Thinking" : "Online"}
        </span>
      </header>

      {!compact && (
        <div className="border-b border-glass-border px-4 py-2">
          <div className="flex flex-wrap gap-2">
            {suggestionSet.map((prompt) => (
              <button
                key={prompt.id}
                type="button"
                onClick={() => sendMessage(prompt.prompt)}
                disabled={!canAsk}
                className="inline-flex items-center gap-1 rounded-full border border-glass-border bg-glass-bg px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-border-accent hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Sparkles size={12} />
                {prompt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        {messages.map((message) => (
          <AdvisorMessage
            key={message.id}
            message={message}
            isTyping={isStreaming && message.id === typingMessageId}
          />
        ))}
      </div>

      {error && (
        <div className="border-t border-accent-danger/30 bg-accent-danger/10 px-4 py-2 text-xs text-accent-danger">
          {error}
        </div>
      )}

      {rateLimit && (
        <div className="border-t border-glass-border px-4 py-2 text-xs text-text-muted">
          {rateLimit.remaining}/{rateLimit.limit} queries remaining today
        </div>
      )}

      <AdvisorInput
        onSubmit={sendMessage}
        onStop={stopStreaming}
        disabled={!user?.id}
        isStreaming={isStreaming}
      />

      <AdvisorDisclaimer />
    </section>
  );
}
