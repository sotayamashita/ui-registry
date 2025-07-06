import { Button } from "@/components/ui/button";
import { AutoResizeTextarea } from "@/registry/new-york/auto-resize-textarea/auto-resize-textarea";
import { IconArrowUp, IconLoader2, IconX } from "@tabler/icons-react";
import React from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  disabled?: boolean;
  placeholder?: string;
  isLoading?: boolean;
  isCancelling?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  onCancel,
  disabled = false,
  placeholder,
  isLoading = false,
  isCancelling = false,
}) => {
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (value.trim() && !disabled && !isLoading) {
      onSubmit();
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    console.log("[ChatInput] handleCancel called");
    e.preventDefault();
    e.stopPropagation();
    console.log("[ChatInput] onCancel:", onCancel);
    console.log("[ChatInput] isCancelling:", isCancelling);
    if (onCancel && !isCancelling) {
      console.log("[ChatInput] Calling onCancel function");
      onCancel();
    } else {
      console.log(
        "[ChatInput] onCancel not called - onCancel is",
        onCancel,
        "or isCancelling is",
        isCancelling,
      );
    }
  };

  const getButtonIcon = () => {
    if (isCancelling) {
      return <IconLoader2 className="animate-spin" />;
    }
    if (isLoading) {
      return <IconX />;
    }
    return <IconArrowUp />;
  };

  const getButtonClassName = () => {
    let baseClass = "ml-auto size-7 rounded-full transition-colors";
    if (isCancelling) {
      baseClass += " bg-destructive hover:bg-destructive/90";
    }
    return baseClass;
  };

  return (
    <form onSubmit={handleSubmit} className="py-4 border rounded-lg shadow-md">
      <AutoResizeTextarea
        value={value}
        onChange={onChange}
        onSubmit={handleSubmit}
        disabled={disabled || isLoading || isCancelling}
        placeholder={placeholder}
      />
      <div className="flex items-center px-4">
        <Button
          type={isLoading ? "button" : "submit"}
          size="icon"
          className={getButtonClassName()}
          disabled={(!isLoading && !value.trim()) || isCancelling}
          onClick={(e) => {
            if (isLoading) {
              handleCancel(e);
            }
          }}
        >
          {getButtonIcon()}
        </Button>
      </div>
    </form>
  );
};
