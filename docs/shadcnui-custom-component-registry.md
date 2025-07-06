# Next.js で作る shadcn/ui カスタムコンポーネントレジストリ

このドキュメントでは、Next.jsプロジェクトでshadcn/ui ベースのカスタムコンポーネントを開発し、`npx shadcn@latest add [component]` コマンドで他のプロジェクトから追加できるようにする方法を説明します。

## 概要

shadcn/uiのコンポーネントレジストリシステムは、CLIツールを使用してカスタムコンポーネントをプロジェクトに簡単に追加できるように設計されています。このシステムは以下の要素で構成されています：

- `registry.json`: レジストリのメタデータとコンポーネント定義
- コンポーネントファイル: 実際のコンポーネントコード（registryディレクトリ内）
- ビルドされたJSONファイル: CLIが読み込む配布用ファイル（public/r/内）
- 開発環境: Next.js devサーバーとオプションでStorybook

## 必要なディレクトリ構造

カスタムコンポーネントレジストリを作成するための推奨ディレクトリ構造：

### src pattern を使用する場合（推奨）

> 参考: [Next.js src ディレクトリ](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder)

```
your-nextjs-project/
├── registry.json              # レジストリ定義ファイル
├── src/
│   ├── registry/             # コンポーネントファイル
│   │   └── [style]/          # スタイル名（例: new-york, default）
│   │       └── [component-name]/ # コンポーネント名
│   │           ├── [component-name].tsx
│   │           └── [component-name].stories.tsx (オプション)
│   ├── app/                  # Next.js App Router
│   │   └── registry/         # レジストリプレビューページ（オプション）
│   │       └── [component]/
│   │           └── page.tsx
│   ├── components/           # 通常のNext.jsコンポーネント
│   │   └── ui/               # shadcn/uiコンポーネント
│   └── lib/                  # ユーティリティ関数
│       └── utils.ts
├── public/
│   └── r/                    # ビルド後のJSONファイル出力先
│       └── [component-name].json
├── .storybook/               # Storybook設定（オプション）
├── tailwind.config.ts        # Tailwind CSS設定（v3の場合）
└── components.json           # shadcn/ui設定
```

### src pattern を使用しない場合

```
your-nextjs-project/
├── registry.json              # レジストリ定義ファイル
├── registry/                  # コンポーネントファイル
│   └── [style]/              # スタイル名（例: new-york, default）
│       └── [component-name]/ # コンポーネント名
│           ├── [component-name].tsx
│           └── [component-name].stories.tsx (オプション)
├── public/
│   └── r/                    # ビルド後のJSONファイル出力先
│       └── [component-name].json
├── app/                      # Next.js App Router
│   └── registry/             # レジストリプレビューページ（オプション）
│       └── [component]/
│           └── page.tsx
├── components/               # 通常のNext.jsコンポーネント
│   └── ui/                   # shadcn/uiコンポーネント
├── lib/                      # ユーティリティ関数
│   └── utils.ts
├── .storybook/               # Storybook設定（オプション）
├── tailwind.config.ts        # Tailwind CSS設定（v3の場合）
└── components.json           # shadcn/ui設定
```

## Next.js プロジェクトのセットアップ

### 1. 初期設定

まず、Next.jsプロジェクトでshadcn/uiを初期化します：

```bash
npx create-next-app@latest my-component-registry
cd my-component-registry
npx shadcn@latest init
```

### 2. Tailwind CSS の設定更新

#### Tailwind CSS v4 を使用している場合

> 参考: [Tailwind CSS v4 CSS-first configuration](https://tailwindcss.com/blog/tailwindcss-v4#css-first-configuration)
> **注意**: Tailwind CSS v4 では `tailwind` プロパティは非推奨（deprecated）であり、将来的に削除される予定です。新規プロジェクトでは代わりに `cssVars.theme` を使用することを推奨します。

Tailwind CSS v4では、設定はCSSファイル内で直接行います。`src/app/globals.css` または Tailwind をインポートしているCSSファイルを更新して、registryディレクトリのコンポーネントを認識させます：

##### src pattern を使用する場合

```css
@import "tailwindcss";

/* registryディレクトリのコンポーネントを追加 */
/* NOTE: Tailwind v4 では glob パターンの互換性が保証されていません。動作しない場合はディレクトリ単位で指定してください。*/
@source "./src/pages/**/*.{js,ts,jsx,tsx,mdx}";
@source "./src/components/**/*.{js,ts,jsx,tsx,mdx}";
@source "./src/app/**/*.{js,ts,jsx,tsx,mdx}";
@source "./src/registry/**/*.{js,ts,jsx,tsx,mdx}";

/* その他のカスタム設定 */
@theme {
  /* カスタムテーマ設定 */
}
```

##### src pattern を使用しない場合

```css
@import "tailwindcss";

/* registryディレクトリのコンポーネントを追加 */
@source "./pages/**/*.{js,ts,jsx,tsx,mdx}";
@source "./components/**/*.{js,ts,jsx,tsx,mdx}";
@source "./app/**/*.{js,ts,jsx,tsx,mdx}";
@source "./registry/**/*.{js,ts,jsx,tsx,mdx}";

/* その他のカスタム設定 */
@theme {
  /* カスタムテーマ設定 */
}
```

#### Tailwind CSS v3 を使用している場合

`tailwind.config.ts` を更新します：

##### src pattern を使用する場合

```ts
/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/registry/**/*.{js,ts,jsx,tsx,mdx}", // 追加
  ],
  // ... 他の設定
};
```

##### src pattern を使用しない場合

```ts
/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./registry/**/*.{js,ts,jsx,tsx,mdx}", // 追加
  ],
  // ... 他の設定
};
```

### 3. レジストリプレビューページの作成（オプション）

> 参考: [Next.js src ディレクトリ](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder)

開発中のコンポーネントをプレビューするためのページを作成：

#### src pattern を使用する場合

```tsx
// src/app/registry/[component]/page.tsx
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

export default function ComponentPreview({
  params,
}: {
  params: { component: string };
}) {
  try {
    // 動的にコンポーネントをインポート
    const Component = dynamic(
      () =>
        import(`@/registry/new-york/${params.component}/${params.component}`),
      { ssr: false },
    );

    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">{params.component}</h1>
        <div className="border rounded-lg p-8">
          <Component />
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
```

#### src pattern を使用しない場合

```tsx
// app/registry/[component]/page.tsx
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

export default function ComponentPreview({
  params,
}: {
  params: { component: string };
}) {
  try {
    // 動的にコンポーネントをインポート
    const Component = dynamic(
      () =>
        import(`@/registry/new-york/${params.component}/${params.component}`),
      { ssr: false },
    );

    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">{params.component}</h1>
        <div className="border rounded-lg p-8">
          <Component />
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
```

## registry.json の設定

プロジェクトのルートに `registry.json` ファイルを作成します：

### src pattern を使用する場合

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "your-registry-name",
  "homepage": "https://your-domain.com",
  "items": [
    {
      "name": "my-component",
      "type": "registry:block",
      "title": "My Component",
      "description": "カスタムコンポーネントの説明",
      "files": [
        {
          "path": "src/registry/new-york/my-component/my-component.tsx",
          "type": "registry:component"
        }
      ],
      "dependencies": [
        "@radix-ui/react-slot",
        "class-variance-authority",
        "clsx"
      ],
      "registryDependencies": ["button", "input"],
      "cssVars": {
        "light": {
          "--my-component-bg": "hsl(0 0% 100%)",
          "--my-component-text": "hsl(222.2 84% 4.9%)"
        },
        "dark": {
          "--my-component-bg": "hsl(222.2 84% 4.9%)",
          "--my-component-text": "hsl(0 0% 100%)"
        }
      }
    }
  ]
}
```

### src pattern を使用しない場合

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "your-registry-name",
  "homepage": "https://your-domain.com",
  "items": [
    {
      "name": "my-component",
      "type": "registry:block",
      "title": "My Component",
      "description": "カスタムコンポーネントの説明",
      "files": [
        {
          "path": "registry/new-york/my-component/my-component.tsx",
          "type": "registry:component"
        }
      ],
      "dependencies": [
        "@radix-ui/react-slot",
        "class-variance-authority",
        "clsx"
      ],
      "registryDependencies": ["button", "input"],
      "cssVars": {
        "light": {
          "--my-component-bg": "hsl(0 0% 100%)",
          "--my-component-text": "hsl(222.2 84% 4.9%)"
        },
        "dark": {
          "--my-component-bg": "hsl(222.2 84% 4.9%)",
          "--my-component-text": "hsl(0 0% 100%)"
        }
      }
    }
  ]
}
```

## コンポーネントファイルの作成

### src pattern を使用する場合

> 参考: [Next.js src ディレクトリ](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder)

コンポーネントは `src/registry/[style]/[component-name]/` ディレクトリに配置します：

```tsx
// src/registry/new-york/my-component/my-component.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary";
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border p-4",
          variant === "secondary" && "bg-secondary",
          className,
        )}
        {...props}
      />
    );
  },
);
MyComponent.displayName = "MyComponent";

export { MyComponent };
```

### src pattern を使用しない場合

コンポーネントは `registry/[style]/[component-name]/` ディレクトリに配置します：

```tsx
// registry/new-york/my-component/my-component.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary";
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border p-4",
          variant === "secondary" && "bg-secondary",
          className,
        )}
        {...props}
      />
    );
  },
);
MyComponent.displayName = "MyComponent";

export { MyComponent };
```

## 依存関係の指定

### NPMパッケージの依存関係

`dependencies` プロパティでNPMパッケージを指定：

```json
"dependencies": [
  "@radix-ui/react-accordion",
  "lucide-react",
  "zod@3.22.4"  // バージョン指定も可能
]
```

### レジストリコンポーネントの依存関係

`registryDependencies` で他のコンポーネントへの依存を指定：

```json
"registryDependencies": [
  "button",          // shadcn/uiの標準コンポーネント
  "input",
  "https://example.com/r/custom.json"  // 他のレジストリのコンポーネント
]
```

## ファイルタイプ

利用可能なファイルタイプ：

- `registry:block`: 完全なブロック/セクション
- `registry:component`: 再利用可能なコンポーネント
- `registry:ui`: UIコンポーネント（components/ui配下）
- `registry:lib`: ユーティリティ関数
- `registry:hook`: カスタムReactフック
- `registry:page`: ページコンポーネント
- `registry:file`: その他のファイル
- `registry:style`: スタイルファイル
- `registry:theme`: テーマ設定

## レジストリのビルドと配布

### 1. shadcn CLI のインストール（v2 以降 stable で build 利用可）

レジストリのビルドには、shadcn CLI (v2 以降、stable) が必要です：

```bash
npm install -D shadcn@latest
```

### 2. レジストリのビルド

```bash
npx shadcn@latest build
```

このコマンドは：

- `registry.json` を読み込む
- 各コンポーネントのインポートパスを変換
- `public/r/` ディレクトリにJSONファイルを生成

ビルドオプション：

```bash
# 出力ディレクトリを指定
npx shadcn@latest build –output dist/registry

# 特定のregistryファイルを指定
npx shadcn@latest build ./custom-registry.json
```

### 3. ローカルでのテスト

開発サーバーを起動してレジストリをホスト：

```bash
npm run dev
```

生成されたファイルの確認：

- コンポーネントJSON: `http://localhost:3000/r/my-component.json`
- プレビューページ: `http://localhost:3000/registry/my-component`

### 4. 別プロジェクトでのコンポーネント追加

```bash
# ローカルレジストリから（開発時）
npx shadcn@latest add http://localhost:3000/r/my-component.json

# デプロイ済みレジストリから（本番環境）
npx shadcn@latest add https://your-domain.com/r/my-component.json

# 複数コンポーネントの一括追加
npx shadcn@latest add http://localhost:3000/r/component1.json http://localhost:3000/r/component2.json
```

### 5. 本番環境へのデプロイ

#### Vercelの場合

```json
// vercel.json
{
  "headers": [
    {
      "source": "/r/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

#### Next.js の設定

```js
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/r/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
};
```

## スタイルシステム

### CSS変数の定義

> 参考: [Tailwind CSS v4 CSS-first configuration](https://tailwindcss.com/blog/tailwindcss-v4#css-first-configuration)

`cssVars` プロパティでコンポーネント用のCSS変数を定義：

```json
"cssVars": {
  "theme": {
    "--radius": "0.5rem"
  },
  "light": {
    "--my-component-bg": "hsl(0 0% 100%)",
    "--my-component-border": "hsl(214.3 31.8% 91.4%)"
  },
  "dark": {
    "--my-component-bg": "hsl(222.2 84% 4.9%)",
    "--my-component-border": "hsl(217.2 32.6% 17.5%)"
  }
}
```

### Tailwind CSS設定

> 参考: [Tailwind CSS v4 CSS-first configuration](https://tailwindcss.com/blog/tailwindcss-v4#css-first-configuration)

`tailwind` プロパティでTailwind設定を拡張：

```json
"tailwind": {
  "content": ["./src/components/**/*.{ts,tsx}"],
  "theme": {
    "extend": {
      "colors": {
        "my-custom": "hsl(var(--my-component-bg))"
      }
    }
  },
  "plugins": []
}
```

## 開発ワークフロー

### ローカル開発環境での作業

#### 1. 開発サーバーの起動

Next.js開発サーバーとレジストリビルドを並行して実行：

```bash
# ターミナル1: Next.js開発サーバー
npm run dev

# ターミナル2: レジストリの監視ビルド（package.jsonに追加）
npm run registry:watch
```

`package.json` にスクリプトを追加：

#### src pattern を使用する場合

> 参考: [Next.js src ディレクトリ](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder)

```json
{
  "scripts": {
    "dev": "next dev",
    "registry:build": "npx shadcn@latest build",
    "registry:watch": "nodemon --watch src/registry --watch registry.json --exec 'npm run registry:build'"
  }
}
```

#### src pattern を使用しない場合

```json
{
  "scripts": {
    "dev": "next dev",
    "registry:build": "npx shadcn@latest build",
    "registry:watch": "nodemon --watch registry --watch registry.json --exec 'npm run registry:build'"
  }
}
```

#### 2. コンポーネントの開発とプレビュー

開発中のコンポーネントは以下の方法で確認できます：

- **プレビューページ**: `http://localhost:3000/registry/[component-name]`
- **JSON確認**: `http://localhost:3000/r/[component-name].json`

#### 3. 別プロジェクトでのテスト

ローカルレジストリから別のNext.jsプロジェクトにコンポーネントを追加：

```bash
# 別のNext.jsプロジェクトで実行
npx shadcn@latest add http://localhost:3000/r/my-component.json
```

### Storybook の統合（オプション）

Storybookを使用してコンポーネントを開発・ドキュメント化：

#### 1. Storybookのセットアップ

```bash
npx storybook@latest init
```

#### 2. レジストリコンポーネント用のストーリー作成

##### src pattern を使用する場合

> 参考: [Next.js src ディレクトリ](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder)

```tsx
// src/registry/new-york/my-component/my-component.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "./my-component";

const meta = {
  title: "Registry/MyComponent",
  component: MyComponent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary"],
    },
  },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Hello World",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Variant",
  },
};
```

##### src pattern を使用しない場合

```tsx
// registry/new-york/my-component/my-component.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "./my-component";

const meta = {
  title: "Registry/MyComponent",
  component: MyComponent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary"],
    },
  },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Hello World",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Variant",
  },
};
```

#### 3. Storybookの起動

```bash
npm run storybook
```

### registryディレクトリと通常のコンポーネントの違い

#### registryディレクトリのコンポーネント

- **目的**: 他のプロジェクトへの配布
- **パス**: `@/registry/[style]/[component]`
- **ビルド**: `shadcn build` でJSONファイル化
- **インポート**: 常に `@/registry` パスを使用

#### 通常のNext.jsコンポーネント

- **目的**: プロジェクト内での使用
- **パス**: `@/components/ui/[component]`
- **ビルド**: Next.jsの通常のビルドプロセス
- **インポート**: プロジェクトのエイリアス設定に従う

### 開発のベストプラクティス

1. **コンポーネントの分離**: レジストリコンポーネントは独立して動作するように設計
2. **依存関係の管理**: 最小限の外部依存を維持
3. **スタイルの一貫性**: shadcn/uiのデザインシステムに準拠
4. **ドキュメント**: 各コンポーネントにStorybookストーリーを作成
5. **テスト**: プレビューページとStorybookで動作確認

## 高度な設定

### 複数ファイルのコンポーネント

複数のファイルで構成されるコンポーネントの例：

#### src pattern を使用する場合

> 参考: [Next.js src ディレクトリ](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder)

```json
{
  "name": "data-table",
  "type": "registry:block",
  "files": [
    {
      "path": "src/registry/new-york/data-table/data-table.tsx",
      "type": "registry:component"
    },
    {
      "path": "src/registry/new-york/data-table/columns.tsx",
      "type": "registry:component"
    },
    {
      "path": "src/registry/new-york/data-table/toolbar.tsx",
      "type": "registry:component"
    }
  ]
}
```

#### src pattern を使用しない場合

```json
{
  "name": "data-table",
  "type": "registry:block",
  "files": [
    {
      "path": "registry/new-york/data-table/data-table.tsx",
      "type": "registry:component"
    },
    {
      "path": "registry/new-york/data-table/columns.tsx",
      "type": "registry:component"
    },
    {
      "path": "registry/new-york/data-table/toolbar.tsx",
      "type": "registry:component"
    }
  ]
}
```

### ターゲットパスの指定

特定のディレクトリにファイルを配置する場合：

#### src pattern を使用する場合

> 参考: [Next.js src ディレクトリ](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder)

```json
"files": [
  {
    "path": "src/registry/new-york/config/site.ts",
    "type": "registry:file",
    "target": "src/config/site.ts"
  }
]
```

#### src pattern を使用しない場合

```json
"files": [
  {
    "path": "registry/new-york/config/site.ts",
    "type": "registry:file",
    "target": "config/site.ts"
  }
]
```

## ベストプラクティス

1. **命名規則**: コンポーネント名はケバブケース（kebab-case）を使用
2. **スタイル**: 少なくとも `new-york` と `default` スタイルをサポート
3. **依存関係**: 最小限の依存関係に抑える
4. **ドキュメント**: 各コンポーネントに明確な説明を提供
5. **型定義**: TypeScriptの型定義を含める
6. **テスト**: 可能であればStorybookストーリーを含める

## トラブルシューティング

### ビルドエラーが発生する場合

1. `registry.json` のJSON構文を確認
2. ファイルパスが正しいことを確認
3. 依存関係が利用可能であることを確認

### コンポーネントが追加されない場合

1. JSONファイルのURLが正しいことを確認
2. CORSヘッダーが適切に設定されていることを確認
3. `npx shadcn@latest add --help` で利用可能なオプションを確認

## まとめ

このガイドでは、Next.jsプロジェクトでshadcn/uiカスタムコンポーネントレジストリを作成する方法を説明しました。

### 主要なポイント

1. **開発環境の統合**: Next.js開発サーバーとレジストリビルドを組み合わせることで、ローカルでコンポーネントを開発・テストできる
2. **柔軟な確認方法**: プレビューページ、Storybook、JSONエンドポイントなど、複数の方法でコンポーネントを確認
3. **標準化された配布**: `npx shadcn@latest add` コマンドで簡単にコンポーネントを共有
4. **shadcn/uiの哲学**: コンポーネントをコピー＆ペーストして使用するアプローチにより、完全な制御が可能

### 次のステップ

1. このテンプレートを基に独自のコンポーネントライブラリを構築
2. 社内やコミュニティでコンポーネントを共有
3. shadcn/uiのエコシステムに貢献

詳細な仕様やアップデートについては、[shadcn/ui公式ドキュメント](https://ui.shadcn.com/docs)を参照してください。

## 参考資料

- [Next.js src ディレクトリ](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder)
- [Tailwind CSS v4 CSS-first configuration](https://tailwindcss.com/blog/tailwindcss-v4#css-first-configuration)
- [shadcn/ui公式ドキュメント](https://ui.shadcn.com/docs)
