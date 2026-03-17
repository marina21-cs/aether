export type AdvisorRole = "user" | "assistant";

export interface AdvisorMessage {
  id: string;
  role: AdvisorRole;
  content: string;
  createdAt: string;
}

export interface AdvisorRateLimit {
  limit: number;
  remaining: number;
  resetAt: number;
}

export interface AdvisorErrorResponse {
  error: {
    code: string;
    message: string;
    status: number;
    detail?: string;
  };
}

export interface AdvisorAskRequest {
  userId: string;
  message: string;
  conversationHistory: Array<Pick<AdvisorMessage, "role" | "content">>;
}

export interface AdvisorQuickPrompt {
  id: string;
  label: string;
  prompt: string;
}
