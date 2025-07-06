"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import React from "react";
import "../styles/scrollbar.css";
import { ChatProps } from "../types/chat-types";
import { ChatInput } from "./chat-input";
import { Message } from "./message";

export const Chat: React.FC<ChatProps> = ({
  messages,
  onSendMessage,
  onReset,
  onCancel,
  isLoading = false,
  isCancelling = false,
  placeholder = "Enter a message...",
  value,
  onChange,
  streamMode = false,
  onStreamModeChange,
  useLLM = false,
  onUseLLMChange,
  onThumbsUp,
  onThumbsDown,
}) => {
  const [localInput, setLocalInput] = React.useState("");
  const input = value !== undefined ? value : localInput;
  const setInput = onChange || setLocalInput;
  const scrollEndRef = React.useRef<HTMLDivElement>(null);
  const [scrollbarWidth, setScrollbarWidth] = React.useState(0);

  React.useEffect(() => {
    // Measure scrollbar width
    const scrollDiv = document.createElement("div");
    scrollDiv.style.width = "100px";
    scrollDiv.style.height = "100px";
    scrollDiv.style.overflow = "scroll";
    scrollDiv.style.position = "absolute";
    scrollDiv.style.top = "-9999px";
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    setScrollbarWidth(scrollbarWidth);
  }, []);

  React.useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="stream-mode" className="text-sm font-medium">
              Stream Mode
            </label>
            <Switch
              id="stream-mode"
              checked={streamMode}
              onCheckedChange={onStreamModeChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="use-llm" className="text-sm font-medium">
              Use Real LLM
            </label>
            <Switch
              id="use-llm"
              checked={useLLM}
              onCheckedChange={onUseLLMChange}
            />
          </div>
        </div>
        <Button onClick={onReset} variant="outline" size="sm">
          Reset
        </Button>
      </div>
      <div
        className="flex-1 min-h-0 overflow-y-auto scrollbar-gutter-stable"
        style={{ paddingLeft: `${scrollbarWidth}px` }}
      >
        <div className="px-4 py-4">
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              onThumbsUp={onThumbsUp}
              onThumbsDown={onThumbsDown}
            />
          ))}
          <div ref={scrollEndRef} />
        </div>
      </div>
      <div
        className="flex-shrink-0 bg-background border-t py-4"
        style={{
          paddingLeft: `${scrollbarWidth + 16}px`,
          paddingRight: `${scrollbarWidth + 16}px`,
        }}
      >
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          disabled={isLoading}
          isLoading={isLoading}
          isCancelling={isCancelling}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};
