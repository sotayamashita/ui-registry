"use client";

import { AutoResizeTextarea } from "@/registry/new-york/auto-resize-textarea/auto-resize-textarea";
import { useState } from "react";

export default function AutoResizeTextareaPage() {
  const [value, setValue] = useState("");

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Auto Resize TextArea</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Default</h2>
          <div className="border rounded-lg p-4">
            <AutoResizeTextarea
              value={value}
              onChange={setValue}
              placeholder="Type something and see the textarea grow..."
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">With Border</h2>
          <div className="border rounded-lg p-4 bg-muted/50">
            <AutoResizeTextarea
              value={value}
              onChange={setValue}
              placeholder="This textarea has a border background..."
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Disabled</h2>
          <div className="border rounded-lg p-4 bg-muted/20">
            <AutoResizeTextarea
              value="This textarea is disabled"
              onChange={() => {}}
              disabled
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Current Value</h2>
          <pre className="bg-muted p-4 rounded-lg text-sm">
            {value || "No content yet..."}
          </pre>
        </div>
      </div>
    </div>
  );
}
