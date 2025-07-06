import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import * as React from "react";

interface CopyButtonProps extends React.ComponentProps<typeof Button> {
  value: string;
}

const COPY_TIMEOUT_MS = 2000;

function useCopyToClipboard() {
  const [hasCopied, setHasCopied] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const copyToClipboard = React.useCallback(async (text: string) => {
    if (!window.navigator?.clipboard) {
      console.warn("Clipboard API not available");
      return false;
    }

    try {
      await window.navigator.clipboard.writeText(text);
      setHasCopied(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setHasCopied(false);
      }, COPY_TIMEOUT_MS);

      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return false;
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { hasCopied, copyToClipboard };
}

export function CopyButton({
  value,
  className,
  variant = "ghost",
  ...props
}: CopyButtonProps) {
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const { hasCopied, copyToClipboard } = useCopyToClipboard();

  React.useEffect(() => {
    if (hasCopied) {
      setTooltipOpen(true);
      const timer = setTimeout(() => {
        setTooltipOpen(false);
      }, COPY_TIMEOUT_MS);
      return () => clearTimeout(timer);
    }
  }, [hasCopied]);

  const handleCopy = React.useCallback(async () => {
    await copyToClipboard(value);
  }, [copyToClipboard, value]);

  const Icon = hasCopied ? IconCheck : IconCopy;
  const tooltipText = hasCopied ? "Copied!" : "Copy to clipboard";

  return (
    <Tooltip open={tooltipOpen || undefined} onOpenChange={setTooltipOpen}>
      <TooltipTrigger asChild>
        <Button
          data-slot="copy-button"
          size="icon"
          variant={variant}
          className={cn(
            "bg-code absolute top-3 right-2 z-10 size-7 hover:opacity-100 focus-visible:opacity-100",
            className,
          )}
          onClick={handleCopy}
          aria-label={tooltipText}
          {...props}
        >
          <span className="sr-only">Copy</span>
          <Icon stroke={1.5} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>{tooltipText}</span>
      </TooltipContent>
    </Tooltip>
  );
}
