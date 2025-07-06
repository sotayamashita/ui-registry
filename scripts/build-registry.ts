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
  cssVars?: Record<string, any>;
}

interface Registry {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

// 環境変数からベースURLを取得（デフォルトは localhost:3000）
const BASE_URL = process.env.REGISTRY_BASE_URL || "http://localhost:3000";

// レジストリテンプレートを定義
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
  ],
};

// registry.jsonを生成
writeFileSync(
  join(__dirname, "../registry.json"),
  JSON.stringify(registryTemplate, null, 2),
);

console.log(`Registry generated with BASE_URL: ${BASE_URL}`);
