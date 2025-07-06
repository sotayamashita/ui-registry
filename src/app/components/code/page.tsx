"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Code } from "@/registry/new-york/code/code";

export default function CodePreview() {
  const jsCode = `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`;

  const tsCode = `interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(data: Partial<User>): User {
  return {
    id: Math.random(),
    name: data.name || "Anonymous",
    email: data.email || "user@example.com",
  };
}`;

  const jsxCode = `import React from "react";

function Welcome({ name }) {
  return (
    <div className="welcome">
      <h1>Hello, {name}!</h1>
      <p>Welcome to our application.</p>
    </div>
  );
}

export default Welcome;`;

  const tsxCode = `import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export function Button({ 
  children, 
  onClick, 
  variant = "primary" 
}: ButtonProps) {
  return (
    <button
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}`;

  return (
    <TooltipProvider>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Code Component</h1>
        <div className="space-y-8">
          <div className="border rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-4">JavaScript Example</h2>
            <Code code={jsCode} language="js" title="greet.js" />
          </div>

          <div className="border rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-4">TypeScript Example</h2>
            <Code code={tsCode} language="ts" title="user.ts" />
          </div>

          <div className="border rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-4">JSX Example</h2>
            <Code code={jsxCode} language="jsx" title="Welcome.jsx" />
          </div>

          <div className="border rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-4">TSX Example</h2>
            <Code code={tsxCode} language="tsx" title="Button.tsx" />
          </div>

          <div className="border rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-4">Without Copy Button</h2>
            <Code
              code="npm install @tabler/icons-react"
              language="bash"
              title="install-command.sh"
              showCopyButton={false}
            />
          </div>

          <div className="border rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-4">Without Title</h2>
            <Code code="console.log('Hello, World!');" language="js" />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
