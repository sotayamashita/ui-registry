"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Message } from "../types/chat-types";

type ChatStatus = "idle" | "loading" | "streaming" | "error";

interface UseChatOptions {
  initialMessages?: Message[];
  onSendMessage?: (content: string) => void;
  streamMode?: boolean;
  onError?: (error: Error) => void;
  keepLastMessageOnError?: boolean;
  experimental_throttle?: number;
}

interface UseChatHelpers {
  messages: Message[];
  input: string;
  isLoading: boolean;
  isCancelling: boolean;
  streamMode: boolean;
  status: ChatStatus;
  error: Error | undefined;
  handleInputChange: (value: string) => void;
  handleSubmit: () => Promise<void>;
  append: (message: Omit<Message, "id" | "timestamp">) => Message;
  reset: () => void;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => Message;
  addToolResult: (toolCallId: string, result: Record<string, unknown>) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  toggleStreamMode: () => void;
  appendStream: (messageId: string, chunk: string) => void;
  finalizeStream: (messageId: string) => void;
  stop: () => void;
  reload: () => Promise<void>;
  abortControllerRef: React.MutableRefObject<AbortController | null>;
}

export const useChat = (options: UseChatOptions = {}): UseChatHelpers => {
  const [messages, setMessages] = useState<Message[]>(
    options.initialMessages || [],
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [streamMode, setStreamMode] = useState(options.streamMode || false);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<Error | undefined>();

  // Abort controller for cancelling ongoing requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Track the last user message for reload functionality
  const lastUserMessageRef = useRef<string>("");

  // Throttling state
  const throttleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdatesRef = useRef<Array<() => void>>([]);

  // Throttle function for UI updates
  const throttleUpdate = useCallback(
    (updateFn: () => void) => {
      if (!options.experimental_throttle) {
        updateFn();
        return;
      }

      pendingUpdatesRef.current.push(updateFn);

      if (!throttleTimerRef.current) {
        throttleTimerRef.current = setTimeout(() => {
          const updates = pendingUpdatesRef.current;
          pendingUpdatesRef.current = [];
          throttleTimerRef.current = null;

          // Execute all pending updates
          updates.forEach((fn) => fn());
        }, options.experimental_throttle);
      }
    },
    [options.experimental_throttle],
  );

  const append = useCallback((message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage = input;
    lastUserMessageRef.current = userMessage;
    setInput("");
    setError(undefined);

    // If onSendMessage is provided, let it handle adding the message
    // Otherwise, add the message directly
    if (options.onSendMessage) {
      setIsLoading(true);
      setStatus("loading");

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      try {
        await options.onSendMessage(userMessage);
        setStatus("idle");
      } catch (err) {
        setStatus("error");
        const error =
          err instanceof Error ? err : new Error("Unknown error occurred");
        setError(error);

        if (options.onError) {
          options.onError(error);
        }

        // Remove last message if keepLastMessageOnError is false
        if (!options.keepLastMessageOnError && messages.length > 0) {
          setMessages((prev) => prev.slice(0, -1));
        }
      } finally {
        setIsLoading(false);
        setIsCancelling(false);
        abortControllerRef.current = null;
      }
    } else {
      // Only add user message if no onSendMessage callback
      append({
        role: "user",
        content: userMessage,
      });
    }
  }, [input, append, options, messages.length]);

  const reset = useCallback(() => {
    setMessages([]);
    setInput("");
    setIsLoading(false);
    setStatus("idle");
    setError(undefined);
    lastUserMessageRef.current = "";

    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const addMessage = useCallback(
    (message: Omit<Message, "id" | "timestamp">) => {
      return append(message);
    },
    [append],
  );

  const addToolResult = useCallback(
    (toolCallId: string, result: Record<string, unknown>) => {
      throttleUpdate(() => {
        setMessages((prev) =>
          prev.map((msg) => {
            if (
              msg.toolInvocations?.some((inv) => inv.toolCallId === toolCallId)
            ) {
              return {
                ...msg,
                toolInvocations: msg.toolInvocations.map((inv) =>
                  inv.toolCallId === toolCallId
                    ? { ...inv, state: "result" as const, result }
                    : inv,
                ),
              };
            }
            return msg;
          }),
        );
      });
    },
    [throttleUpdate],
  );

  const toggleStreamMode = useCallback(() => {
    setStreamMode((prev) => !prev);
  }, []);

  const appendStream = useCallback(
    (messageId: string, chunk: string) => {
      throttleUpdate(() => {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === messageId) {
              // Update status to streaming if not already
              if (status !== "streaming") {
                setStatus("streaming");
              }

              return {
                ...msg,
                content: chunk, // Replace content instead of appending
                isStreaming: true,
              };
            }
            return msg;
          }),
        );
      });
    },
    [throttleUpdate, status],
  );

  const finalizeStream = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            isStreaming: false,
          };
        }
        return msg;
      }),
    );
    setStatus("idle");
  }, []);

  // Stop function to abort ongoing requests
  const stop = useCallback(() => {
    console.log("[useChat] stop function called");
    console.log(
      "[useChat] abortControllerRef.current:",
      abortControllerRef.current,
    );
    setIsCancelling(true);

    if (abortControllerRef.current) {
      console.log("[useChat] Aborting request");
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Mark the last assistant message as cancelled and finalize any streaming
    setMessages((prev) => {
      const lastAssistantIndex = prev.findLastIndex(
        (msg) => msg.role === "assistant",
      );
      console.log(
        "[useChat] Last assistant message index:",
        lastAssistantIndex,
      );
      return prev.map((msg, index) => ({
        ...msg,
        isStreaming: false,
        ...(index === lastAssistantIndex && msg.role === "assistant"
          ? { isCancelled: true }
          : {}),
      }));
    });

    // Reset states after a short delay to show the cancelling state
    setTimeout(() => {
      setIsLoading(false);
      setIsCancelling(false);
      setStatus("idle");
    }, 100);
  }, []);

  // Reload function to retry the last AI response
  const reload = useCallback(async () => {
    if (!lastUserMessageRef.current || !options.onSendMessage) {
      return;
    }

    // Find and remove the last assistant message
    const lastAssistantIndex = messages.findLastIndex(
      (msg) => msg.role === "assistant",
    );
    if (lastAssistantIndex !== -1) {
      setMessages((prev) => prev.slice(0, lastAssistantIndex));
    }

    setError(undefined);
    setIsLoading(true);
    setStatus("loading");

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      await options.onSendMessage(lastUserMessageRef.current);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      const error =
        err instanceof Error ? err : new Error("Unknown error occurred");
      setError(error);

      if (options.onError) {
        options.onError(error);
      }
    } finally {
      setIsLoading(false);
      setIsCancelling(false);
      abortControllerRef.current = null;
    }
  }, [messages, options]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current);
      }
    };
  }, []);

  return {
    messages,
    input,
    isLoading,
    isCancelling,
    streamMode,
    status,
    error,
    handleInputChange,
    handleSubmit,
    append,
    reset,
    addMessage,
    addToolResult,
    setMessages,
    toggleStreamMode,
    appendStream,
    finalizeStream,
    stop,
    reload,
    abortControllerRef,
  };
};
