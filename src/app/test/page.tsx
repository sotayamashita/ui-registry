"use client";

import { TooltipProvider } from "@/components/ui/tooltip";

export default function TestPage() {
  return (
    <TooltipProvider>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Test Page</h1>
        <p className="text-muted-foreground">
          This page will be used to test the component installed via shadcn CLI.
        </p>
        <div className="mt-8 p-4 border rounded-lg">
          <code className="text-sm font-mono">
            npx shadcn@latest add http://localhost:3000/r/copy-button.json
          </code>
        </div>
      </div>
    </TooltipProvider>
  );
}
