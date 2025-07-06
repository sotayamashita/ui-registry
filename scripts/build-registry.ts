#!/usr/bin/env tsx

import { writeFileSync } from "fs";
import { join } from "path";

interface RegistryFile {
  path: string;
  type: string;
  target?: string;
}

interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  files: RegistryFile[];
  dependencies?: string[];
  registryDependencies?: string[];
  cssVars?: Record<string, unknown>;
  categories?: string[];
}

interface Registry {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

// Get base URL from environment variable (default: localhost:3000)
const BASE_URL = process.env.REGISTRY_BASE_URL || "http://localhost:3000";

// Define registry template
const registryTemplate: Registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "ui-registry",
  homepage: BASE_URL,
  items: [
    {
      name: "index",
      type: "registry:style",
      dependencies: [
        "tw-animate-css",
        "class-variance-authority",
        "@tabler/icons-react",
      ],
      registryDependencies: ["utils"],
      files: [],
      cssVars: {},
    },
    {
      name: "copy-button",
      type: "registry:component",
      title: "Copy Button",
      description:
        "A button component with clipboard functionality and visual feedback",
      files: [
        {
          path: "src/registry/new-york/copy-button/copy-button.tsx",
          type: "registry:component",
          target: "components/ui/copy-button.tsx",
        },
      ],
      dependencies: ["@tabler/icons-react"],
      registryDependencies: ["button", "tooltip"],
    },
    {
      name: "code",
      type: "registry:component",
      title: "Code",
      description:
        "A component for displaying formatted code with syntax highlighting and language icons",
      files: [
        {
          path: "src/registry/new-york/code/code.tsx",
          type: "registry:component",
          target: "components/ui/code.tsx",
        },
      ],
      dependencies: ["@tabler/icons-react"],
      registryDependencies: [`${BASE_URL}/r/copy-button.json`],
    },
    {
      name: "code-collapsible",
      type: "registry:component",
      title: "Code Collapsible",
      description:
        "A collapsible component for code blocks with expand/collapse functionality",
      files: [
        {
          path: "src/registry/new-york/code-collapsible/code-collapsible.tsx",
          type: "registry:component",
          target: "components/ui/code-collapsible.tsx",
        },
      ],
      registryDependencies: ["button", "collapsible", "separator"],
    },
    {
      name: "auto-resize-textarea",
      type: "registry:component",
      title: "Auto Resize TextArea",
      description:
        "A textarea component that automatically adjusts its height based on content",
      files: [
        {
          path: "src/registry/new-york/auto-resize-textarea/auto-resize-textarea.tsx",
          type: "registry:component",
          target: "components/ui/auto-resize-textarea.tsx",
        },
      ],
    },
    {
      name: "chat",
      type: "registry:block",
      title: "AI Chat System",
      description:
        "AI assistant chat interface with streaming, tool calling, and Markdown support",
      files: [
        {
          path: "src/registry/new-york/blocks/chat/page.tsx",
          type: "registry:page",
          target: "app/chat/page.tsx",
        },
        {
          path: "src/registry/new-york/blocks/chat/components/chat.tsx",
          type: "registry:component",
        },
        {
          path: "src/registry/new-york/blocks/chat/components/message.tsx",
          type: "registry:component",
        },
        {
          path: "src/registry/new-york/blocks/chat/components/chat-input.tsx",
          type: "registry:component",
        },
        {
          path: "src/registry/new-york/blocks/chat/components/stream-message.tsx",
          type: "registry:component",
        },
        {
          path: "src/registry/new-york/blocks/chat/components/message-list.tsx",
          type: "registry:component",
        },
        {
          path: "src/registry/new-york/blocks/chat/hooks/use-chat.ts",
          type: "registry:hook",
        },
        {
          path: "src/registry/new-york/blocks/chat/lib/mock.ts",
          type: "registry:lib",
        },
        {
          path: "src/registry/new-york/blocks/chat/types/chat-types.ts",
          type: "registry:file",
          target: "types/chat.ts",
        },
        {
          path: "src/registry/new-york/blocks/chat/styles/scrollbar.css",
          type: "registry:file",
          target: "styles/chat-scrollbar.css",
        },
      ],
      dependencies: ["lucide-react", "react-markdown", "remark-gfm"],
      registryDependencies: [
        "button",
        "switch",
        "scroll-area",
        "accordion",
        "badge",
        "card",
        "separator",
        "tooltip",
        "auto-resize-textarea",
      ],
      categories: ["chat", "ai", "messaging", "blocks"],
    },
  ],
};

// Generate registry.json
writeFileSync(
  join(__dirname, "../registry.json"),
  JSON.stringify(registryTemplate, null, 2),
);

console.log(`Registry generated with BASE_URL: ${BASE_URL}`);
