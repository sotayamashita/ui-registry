import React, { useCallback, useEffect, useRef, useState } from "react";

const MAX_TEXTAREA_HEIGHT = 100;
const MIN_TEXTAREA_HEIGHT = 32;

interface AutoResizeTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Enter a message...",
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const measurementsCacheRef = useRef<{
    width?: number;
    height?: number;
    scrollHeight?: number;
  }>({});

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  // Synchronize external value changes (ignore during IME input)
  useEffect(() => {
    if (!isComposing && value !== localValue) {
      setLocalValue(value);
    }
  }, [value, isComposing, localValue]);

  const adjustHeight = useCallback((element: HTMLTextAreaElement) => {
    // Performance optimization: reuse previous calculation if width is the same
    const currentWidth = element.offsetWidth;
    if (
      measurementsCacheRef.current.width === currentWidth &&
      measurementsCacheRef.current.scrollHeight === element.scrollHeight
    ) {
      return;
    }

    // Reset height to get accurate scrollHeight
    element.style.height = "auto";
    const newHeight = Math.min(element.scrollHeight, MAX_TEXTAREA_HEIGHT);
    element.style.height = `${newHeight}px`;

    // Update cache
    measurementsCacheRef.current = {
      width: currentWidth,
      height: newHeight,
      scrollHeight: element.scrollHeight,
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Notify parent immediately if not composing with IME
    if (!isComposing) {
      onChange(newValue);
    }

    adjustHeight(e.target);
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (
    e: React.CompositionEvent<HTMLTextAreaElement>,
  ) => {
    setIsComposing(false);
    // Notify parent immediately when IME composition is confirmed
    const finalValue = e.currentTarget.value;
    onChange(finalValue);
    setLocalValue(finalValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Skip Enter key processing during IME input
    if (isComposing) {
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue =
        localValue.substring(0, start) + "\n" + localValue.substring(end);

      setLocalValue(newValue);
      // Notify parent immediately for Enter key line breaks
      onChange(newValue);

      // Set cursor position
      requestAnimationFrame(() => {
        if (textAreaRef.current) {
          textAreaRef.current.selectionStart =
            textAreaRef.current.selectionEnd = start + 1;
          adjustHeight(textAreaRef.current);
        }
      });
    }
  };

  // Handle paste operations
  const handlePaste = () => {
    // Notify parent immediately on paste
    setTimeout(() => {
      if (textAreaRef.current && !isComposing) {
        const newValue = textAreaRef.current.value;
        setLocalValue(newValue);
        onChange(newValue);
        adjustHeight(textAreaRef.current);
      }
    }, 0);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (textAreaRef.current) {
        // Clear cache and force recalculation
        measurementsCacheRef.current = {};
        adjustHeight(textAreaRef.current);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  // Adjust height on initial load and value changes
  useEffect(() => {
    if (textAreaRef.current) {
      adjustHeight(textAreaRef.current);
    }
  }, [localValue, adjustHeight]);

  return (
    <textarea
      ref={textAreaRef}
      value={localValue}
      onChange={handleChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      rows={1}
      className="w-full bg-transparent text-foreground resize-none outline-none text-sm scrollbar-hide"
      style={{
        minHeight: `${MIN_TEXTAREA_HEIGHT}px`,
        maxHeight: `${MAX_TEXTAREA_HEIGHT}px`,
      }}
      placeholder={placeholder}
      readOnly={disabled}
    />
  );
};
