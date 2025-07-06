import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IconFileDownload } from "@tabler/icons-react";
import mime from "mime";
import * as React from "react";

interface ExportButtonProps extends React.ComponentProps<typeof Button> {
  value: string;
  fileName: string;
}

const EXPORT_TIMEOUT_MS = 2000;

const exportAsFile = (code: string, filename: string): void => {
  const mimeType = mime.getType(filename) || "text/plain";
  const blob = new Blob([code], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export function ExportButton({
  value,
  fileName,
  className,
  variant = "ghost",
  ...props
}: ExportButtonProps) {
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const [hasExported, setHasExported] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleExport = React.useCallback((): void => {
    exportAsFile(value, fileName);
    setHasExported(true);
    setTooltipOpen(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setHasExported(false);
      setTooltipOpen(false);
    }, EXPORT_TIMEOUT_MS);
  }, [value, fileName]);

  const tooltipText = React.useMemo(
    () => (hasExported ? `Exported as ${fileName}` : `Export as ${fileName}`),
    [hasExported, fileName],
  );

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
      <TooltipTrigger asChild>
        <Button
          data-slot="export-button"
          size="icon"
          variant={variant}
          className={cn(
            "bg-code absolute top-3 right-2 z-10 size-7 hover:opacity-100 focus-visible:opacity-100",
            className,
          )}
          onClick={handleExport}
          aria-label={tooltipText}
          {...props}
        >
          <span className="sr-only">Export</span>
          <IconFileDownload stroke={1.5} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>{tooltipText}</span>
      </TooltipContent>
    </Tooltip>
  );
}
