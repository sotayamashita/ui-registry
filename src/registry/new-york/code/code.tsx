import { cn } from "@/lib/utils";
import {
  IconFile,
  IconFileTypeJs,
  IconFileTypeJsx,
  IconFileTypeTs,
  IconFileTypeTsx,
} from "@tabler/icons-react";
import * as React from "react";
import { CopyButton } from "../copy-button/copy-button";

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  code: string;
  highlightedCode?: string;
  language?: string;
  title?: string;
  showCopyButton?: boolean;
}

function getLanguageIcon(language?: string): React.ReactNode {
  switch (language?.toLowerCase()) {
    case "js":
    case "javascript":
      return <IconFileTypeJs />;
    case "jsx":
      return <IconFileTypeJsx />;
    case "ts":
    case "typescript":
      return <IconFileTypeTs />;
    case "tsx":
      return <IconFileTypeTsx />;
    default:
      return <IconFile />;
  }
}

export function Code({
  code,
  highlightedCode,
  language,
  title,
  showCopyButton = true,
  className,
  ...props
}: CodeProps) {
  return (
    <figure
      data-rehype-pretty-code-figure=""
      className={cn("relative", className)}
      {...props}
    >
      {(title || showCopyButton) && (
        <div className="mb-2 flex items-center justify-between">
          {title ? (
            <figcaption
              className="flex items-center gap-2 text-sm text-muted-foreground [&_svg]:size-4 [&_svg]:opacity-70"
              data-language={language}
            >
              {getLanguageIcon(language)}
              <span className="font-medium">{title}</span>
            </figcaption>
          ) : (
            // Empty div to maintain flex layout
            <div />
          )}

          {showCopyButton && (
            <CopyButton
              value={code}
              className="relative top-0 right-0 z-10 size-7"
            />
          )}
        </div>
      )}

      <div className="relative">
        <pre
          className={cn(
            "max-h-96 overflow-auto rounded-lg bg-muted p-4 text-sm",
          )}
        >
          {highlightedCode ? (
            <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          ) : (
            <code className="font-mono">{code}</code>
          )}
        </pre>
      </div>
    </figure>
  );
}
