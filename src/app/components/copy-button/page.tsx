"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { CopyButton } from "@/registry/new-york/copy-button/copy-button";

export default function CopyButtonPreview() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Copy Button</h1>
      <div className="space-y-8">
        <div className="border rounded-lg p-8 relative">
          <h2 className="text-xl font-semibold mb-4">Basic Example</h2>
          <div className="bg-muted p-4 rounded relative">
            <code className="text-sm font-mono">
              npm install @tabler/icons-react
            </code>
            <TooltipProvider>
              <CopyButton value="npm install @tabler/icons-react" />
            </TooltipProvider>
          </div>
        </div>

        <div className="border rounded-lg p-8 relative">
          <h2 className="text-xl font-semibold mb-4">Code Block Example</h2>
          <div className="bg-muted p-4 rounded relative">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {`function greet(name: string) {
  return \`Hello, \${name}!\`;
}`}
            </pre>
            <TooltipProvider>
              <CopyButton
                value={`function greet(name: string) {
  return \`Hello, \${name}!\`;
}`}
              />
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
