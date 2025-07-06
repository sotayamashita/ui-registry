export interface ToolInvocation {
  toolName: string;
  toolCallId: string;
  args?: Record<string, unknown>;
  state: "partial-call" | "call" | "result";
  result?: Record<string, unknown>;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  toolInvocations?: ToolInvocation[];
  timestamp: Date;
  isStreaming?: boolean;
  isCancelled?: boolean;
}

export interface ChatProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  onReset: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isCancelling?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  streamMode?: boolean;
  onStreamModeChange?: (enabled: boolean) => void;
  useLLM?: boolean;
  onUseLLMChange?: (enabled: boolean) => void;
  onThumbsUp?: (messageId: string) => void;
  onThumbsDown?: (messageId: string) => void;
}
