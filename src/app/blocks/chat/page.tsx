"use client";

import { Chat } from "@/registry/new-york/blocks/chat/components/chat";
import { useChat } from "@/registry/new-york/blocks/chat/hooks/use-chat";
import {
  getDemoScenarios,
  mockApiCall,
  mockToolCall,
} from "@/registry/new-york/blocks/chat/lib/mock";

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

      // Check if this should trigger a tool call
      const toolCall = mockToolCall(content);

      if (toolCall) {
        // Add tool message with running state
        const toolMessage = append({
          role: "tool",
          content: "",
          toolInvocations: [
            {
              toolName: toolCall.toolName,
              toolCallId: `tool-${Date.now()}-${Math.random()}`,
              args: toolCall.args,
              state: "call",
            },
          ],
        });

        try {
          // Simulate tool processing delay
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // Update tool message with result
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === toolMessage.id
                ? {
                    ...msg,
                    toolInvocations: [
                      {
                        ...msg.toolInvocations![0],
                        result: toolCall.result,
                        state: "result",
                      },
                    ],
                  }
                : msg,
            ),
          );

          // Add assistant response
          const assistantMessage = append({
            role: "assistant",
            content: "Processing your request...",
          });

          if (streamMode) {
            // Update message as streaming
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, isStreaming: true, content: "" }
                  : msg,
              ),
            );

            const response = await mockApiCall(
              content,
              abortControllerRef.current?.signal,
              streamMode,
              (chunk) => {
                // Update message with streaming content
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: chunk }
                      : msg,
                  ),
                );
              },
            );

            // Mark streaming as complete
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, isStreaming: false, content: response }
                  : msg,
              ),
            );
          } else {
            const response = await mockApiCall(
              content,
              abortControllerRef.current?.signal,
              streamMode,
            );

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: response }
                  : msg,
              ),
            );
          }
        } catch {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === toolMessage.id
                ? {
                    ...msg,
                    toolInvocations: [
                      {
                        ...msg.toolInvocations![0],
                        result: { error: "Tool execution failed" },
                        state: "result",
                      },
                    ],
                  }
                : msg,
            ),
          );
        }
      } else {
        // Regular assistant response
        const assistantMessage = append({
          role: "assistant",
          content: "Processing your request...",
        });

        try {
          if (streamMode) {
            // Update message as streaming
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, isStreaming: true, content: "" }
                  : msg,
              ),
            );

            const response = await mockApiCall(
              content,
              abortControllerRef.current?.signal,
              streamMode,
              (chunk) => {
                // Update message with streaming content
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: chunk }
                      : msg,
                  ),
                );
              },
            );

            // Mark streaming as complete
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, isStreaming: false, content: response }
                  : msg,
              ),
            );
          } else {
            const response = await mockApiCall(
              content,
              abortControllerRef.current?.signal,
              streamMode,
            );

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: response }
                  : msg,
              ),
            );
          }
        } catch (error) {
          if (
            error instanceof Error &&
            error.message === "Request was cancelled by user"
          ) {
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
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  const demoScenarios = getDemoScenarios();

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">AI Chat</h1>
        <p className="text-muted-foreground">
          Demo of the AI Chat with streaming, tool calling, and Markdown support
        </p>
      </div>

      <div className="mb-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">🎯 Try these demo scenarios:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {demoScenarios.map((scenario) => (
            <div
              key={scenario.trigger}
              className="p-2 bg-background rounded border"
            >
              <div className="font-medium text-primary">
                &quot;{scenario.example}&quot;
              </div>
              <div className="text-muted-foreground text-xs mt-1">
                {scenario.description}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Type messages containing keywords like &quot;markdown&quot;,
          &quot;tool&quot;, &quot;error&quot;, or &quot;long&quot; to trigger
          different demo responses. Toggle &quot;Stream Mode&quot; to see
          streaming responses.
        </p>
      </div>

      <div className="h-[600px] border rounded-lg overflow-hidden">
        <Chat
          messages={messages}
          onSendMessage={handleSubmit}
          onReset={reset}
          onCancel={stop}
          isLoading={isLoading}
          placeholder="Try: 'Show me markdown examples' or 'Generate some code'"
          value={input}
          onChange={handleInputChange}
          streamMode={streamMode}
          onStreamModeChange={toggleStreamMode}
        />
      </div>
    </div>
  );
}
