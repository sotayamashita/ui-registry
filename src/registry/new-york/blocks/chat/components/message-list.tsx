import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useRef } from "react";
import { Message as MessageType } from "../types/chat-types";
import { Message } from "./message";

interface MessageListProps {
  messages: MessageType[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="pr-4">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div ref={scrollEndRef} />
    </ScrollArea>
  );
};
