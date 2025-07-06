"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import * as React from "react";

interface CodeCollapsibleProps
  extends React.ComponentProps<typeof Collapsible> {
  defaultOpen?: boolean;
}

const BUTTON_CLASSES = "text-muted-foreground h-7 rounded-md px-2";
const CONTENT_CLASSES =
  "relative mt-6 overflow-hidden data-[state=closed]:max-h-64 [&>figure]:mt-0 [&>figure]:md:!mx-0";
const BOTTOM_TRIGGER_CLASSES =
  "from-code/70 to-code text-muted-foreground absolute inset-x-0 -bottom-2 flex h-20 items-center justify-center rounded-b-lg bg-gradient-to-b text-sm group-data-[state=open]/collapsible:hidden";

export function CodeCollapsible({
  className,
  children,
  defaultOpen = false,
  ...props
}: CodeCollapsibleProps) {
  const [isOpened, setIsOpened] = React.useState(defaultOpen);

  const buttonText = React.useMemo(
    () => (isOpened ? "Collapse" : "Expand"),
    [isOpened],
  );

  const combinedClassName = React.useMemo(
    () => cn("group/collapsible relative md:-mx-4", className),
    [className],
  );

  const handleOpenChange = React.useCallback((open: boolean) => {
    setIsOpened(open);
  }, []);

  return (
    <Collapsible
      open={isOpened}
      onOpenChange={handleOpenChange}
      className={combinedClassName}
      {...props}
    >
      <CollapsibleTrigger asChild>
        <div className="absolute top-0.4 right-9 z-10 flex items-center">
          <Button variant="ghost" size="sm" className={BUTTON_CLASSES}>
            {buttonText}
          </Button>
          <Separator orientation="vertical" className="mx-1.5 !h-4" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent forceMount className={CONTENT_CLASSES}>
        {children}
      </CollapsibleContent>
      <CollapsibleTrigger className={BOTTOM_TRIGGER_CLASSES}>
        {buttonText}
      </CollapsibleTrigger>
    </Collapsible>
  );
}
