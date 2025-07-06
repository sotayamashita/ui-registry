"use client";

import { Chat } from "@/registry/new-york/blocks/chat/components/chat";
import { useChat } from "@/registry/new-york/blocks/chat/hooks/use-chat";
import { mockApiCall } from "@/registry/new-york/blocks/chat/lib/mock";

export default function ChatBlockPage() {
  const {
    messages,
    input,
    isLoading,
    streamMode,
    handleInputChange,
    handleSubmit,
    append,
    reset,
    toggleStreamMode,
    stop,
    abortControllerRef,
    setMessages,
  } = useChat({
    onSendMessage: async (content: string) => {
      // Add user message
      append({
        role: "user",
        content,
      });

      // Add assistant message placeholder
      const assistantMessage = append({
        role: "assistant",
        content: "Processing your request... (this will take 3 seconds)",
      });

      try {
        // Use the abortController's signal for the mock API call
        const response = await mockApiCall(
          content,
          abortControllerRef.current?.signal,
        );

        // Update assistant message with response
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, content: response }
              : msg,
          ),
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Request was cancelled by user"
        ) {
          // Message is already marked as cancelled by the stop() function
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, content: "Request was cancelled" }
                : msg,
            ),
          );
        } else {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? {
                    ...msg,
                    content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
                  }
                : msg,
            ),
          );
        }
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">AI Chat System Block</h1>
        <p className="text-muted-foreground">
          Demo of the AI Chat System block with streaming, tool calling, and
          Markdown support
        </p>
      </div>
      <div className="h-[600px] border rounded-lg overflow-hidden">
        <Chat
          messages={messages}
          onSendMessage={handleSubmit}
          onReset={reset}
          onCancel={stop}
          isLoading={isLoading}
          placeholder="Type a message... (Will take 3 seconds to respond)"
          value={input}
          onChange={handleInputChange}
          streamMode={streamMode}
          onStreamModeChange={toggleStreamMode}
        />
      </div>
    </div>
  );
}
