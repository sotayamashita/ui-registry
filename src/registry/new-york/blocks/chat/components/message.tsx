import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CopyButton } from "@/registry/new-york/copy-button/copy-button";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  IconHammer,
  IconLoader2,
  IconRobotFace,
  IconThumbDown,
  IconThumbUp,
  IconUser,
} from "@tabler/icons-react";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message as MessageType } from "../types/chat-types";
import { StreamMessage } from "./stream-message";

interface MessageProps {
  message: MessageType;
  onThumbsUp?: (messageId: string) => void;
  onThumbsDown?: (messageId: string) => void;
}

export const Message: React.FC<MessageProps> = ({
  message,
  onThumbsUp,
  onThumbsDown,
}) => {
  const getIcon = () => {
    const size = "size-4";
    switch (message.role) {
      case "user":
        return <IconUser className={size} />;
      case "assistant":
        return <IconRobotFace className={size} />;
      case "tool":
        return <IconHammer className={size} />;
    }
  };

  const baseClasses = "py-2 px-4 flex items-center my-4";
  const roleClasses =
    message.role === "user"
      ? "rounded bg-gray-100 dark:bg-gray-800"
      : message.role === "tool"
        ? "border rounded"
        : "";

  return (
    <div
      className={`${baseClasses} ${roleClasses} ${message.isCancelled ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-3 w-full">
        <div className="rounded-full bg-gray-200 size-7 flex shrink-0 items-center justify-center">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0 translate-y-0.5">
          {message.isCancelled && (
            <div className="flex items-center gap-2 mb-2 text-destructive">
              <IconAlertCircle className="size-4" />
              <span className="text-sm font-medium">Request cancelled</span>
            </div>
          )}
          {message.role === "tool" && message.toolInvocations ? (
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger className="p-0 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {message.toolInvocations[0]?.toolName || "Tool Call"}
                    </span>
                    {message.toolInvocations[0]?.state === "call" &&
                      !message.toolInvocations[0]?.result && (
                        <Badge variant="secondary" className="text-xs">
                          <IconLoader2 className="size-3 mr-1 animate-spin" />
                          Running
                        </Badge>
                      )}
                    {message.toolInvocations[0]?.result && (
                      <Badge variant="default" className="text-xs">
                        Complete
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-0">
                  <div className="space-y-3">
                    {/* Input Section */}
                    <Card className="border-blue-200 dark:border-blue-800 shadow-none">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className="text-blue-600 dark:text-blue-400"
                          >
                            <IconArrowRight className="size-3 mr-1" />
                            INPUT
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Arguments sent to{" "}
                            {message.toolInvocations[0]?.toolName}
                          </span>
                        </div>
                        <pre className="p-2 rounded bg-gray-50 dark:bg-gray-900 text-xs overflow-x-auto">
                          {JSON.stringify(
                            message.toolInvocations[0]?.args || {},
                            null,
                            2,
                          )}
                        </pre>
                      </CardContent>
                    </Card>

                    {/* Output Section */}
                    {message.toolInvocations[0]?.result && (
                      <>
                        <div className="flex items-center justify-center">
                          <Separator className="flex-1" />
                          <span className="px-2 text-xs text-muted-foreground">
                            then
                          </span>
                          <Separator className="flex-1" />
                        </div>

                        <Card className="border-green-200 dark:border-green-800 shadow-none">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="outline"
                                className="text-green-600 dark:text-green-400"
                              >
                                <IconArrowLeft className="size-3 mr-1" />
                                OUTPUT
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Result from{" "}
                                {message.toolInvocations[0]?.toolName}
                              </span>
                            </div>
                            <pre className="p-2 rounded bg-gray-50 dark:bg-gray-900 text-xs overflow-x-auto">
                              {JSON.stringify(
                                message.toolInvocations[0]?.result,
                                null,
                                2,
                              )}
                            </pre>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : message.role === "assistant" ? (
            <div className="w-full">
              <StreamMessage
                content={message.content}
                isStreaming={message.isStreaming}
              />
              {!message.isStreaming && message.content && (
                <div className="flex items-center gap-2 mt-2">
                  <TooltipProvider delayDuration={0}>
                    <CopyButton
                      value={message.content}
                      variant="ghost"
                      className="p-1.5 size-auto hover:bg-gray-100 dark:hover:bg-gray-800 relative bg-transparent"
                    />
                  </TooltipProvider>
                  {(onThumbsUp || onThumbsDown) && (
                    <>
                      {onThumbsUp && (
                        <button
                          onClick={() => onThumbsUp(message.id)}
                          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          title="Thumbs up"
                        >
                          <IconThumbUp className="size-4 text-gray-500 hover:text-gray-700" />
                        </button>
                      )}
                      {onThumbsDown && (
                        <button
                          onClick={() => onThumbsDown(message.id)}
                          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          title="Thumbs down"
                        >
                          <IconThumbDown className="size-4 text-gray-500 hover:text-gray-700" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="mb-0">{children}</p>,
                  code: ({ children, ...props }) => {
                    const isInline = !(
                      "children" in props &&
                      props.children &&
                      typeof props.children === "object" &&
                      "props" in props.children
                    );
                    if (isInline) {
                      return (
                        <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded my-2 overflow-x-auto text-sm">
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded my-2 overflow-x-auto">
                      {children}
                    </pre>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
