"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ExportButton } from "@/registry/new-york/export-button/export-button";

export default function ExportButtonPreview() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Export Button</h1>
      <div className="space-y-8">
        <div className="border rounded-lg p-8 relative">
          <h2 className="text-xl font-semibold mb-4">JavaScript Example</h2>
          <div className="bg-muted p-4 rounded relative">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {`function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`}
            </pre>
            <TooltipProvider>
              <ExportButton
                value={`function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`}
                fileName="greet.js"
              />
            </TooltipProvider>
          </div>
        </div>

        <div className="border rounded-lg p-8 relative">
          <h2 className="text-xl font-semibold mb-4">TypeScript Example</h2>
          <div className="bg-muted p-4 rounded relative">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {`interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(name: string, email: string): User {
  return {
    id: Date.now(),
    name,
    email,
  };
}`}
            </pre>
            <TooltipProvider>
              <ExportButton
                value={`interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(name: string, email: string): User {
  return {
    id: Date.now(),
    name,
    email,
  };
}`}
                fileName="user.ts"
              />
            </TooltipProvider>
          </div>
        </div>

        <div className="border rounded-lg p-8 relative">
          <h2 className="text-xl font-semibold mb-4">CSS Example</h2>
          <div className="bg-muted p-4 rounded relative">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {`.button {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}`}
            </pre>
            <TooltipProvider>
              <ExportButton
                value={`.button {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}`}
                fileName="button.css"
              />
            </TooltipProvider>
          </div>
        </div>

        <div className="border rounded-lg p-8 relative">
          <h2 className="text-xl font-semibold mb-4">JSON Example</h2>
          <div className="bg-muted p-4 rounded relative">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {`{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "react": "^18.0.0",
    "next": "^14.0.0"
  }
}`}
            </pre>
            <TooltipProvider>
              <ExportButton
                value={`{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "react": "^18.0.0",
    "next": "^14.0.0"
  }
}`}
                fileName="package.json"
              />
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
