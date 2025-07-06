# Chat System Block 実装計画

## 概要

`components/chat` 以下の既存のchat componentsを、shadcn/ui blocks構造 (`src/registry/new-york/blocks/chat/`) に移植します。

## 現在の構造分析

### 既存ファイル構成

```
/components/chat/
├── README.md                  # 包括的なドキュメント
├── auto-resize-textarea.tsx   # 【既に切り出し済み】
├── chat-input.tsx             # 入力エリア + アクションボタン
├── chat.tsx                   # メインコンテナコンポーネント
├── example-usage.tsx          # 使用例デモ
├── index.ts                   # エクスポートファイル
├── message-list.tsx           # シンプルなメッセージリスト
├── message.tsx                # 個別メッセージ表示
├── scrollbar.css              # カスタムスクロールバー
├── stream-message.tsx         # ストリーミングメッセージ表示
├── types.ts                   # TypeScript型定義
├── use-chat.ts                # カスタムフック
└── utils/
    └── mock.ts                # モックAPI
```

### 主要機能

- リアルタイムストリーミング対応
- Markdown レンダリング
- ツール/関数呼び出し可視化
- IME（国際入力方式）サポート
- 自動リサイズテキストエリア
- メッセージアクション（コピー、フィードバック）
- キャンセル可能なリクエスト
- アクセシビリティ対応

## 移植計画

### 1. 新しいディレクトリ構造

```
src/registry/new-york/blocks/chat/
├── page.tsx                  # example-usage.tsx をベースとした使用例
├── components/
│   ├── chat.tsx              # メインチャットコンポーネント
│   ├── message.tsx           # メッセージコンポーネント
│   ├── chat-input.tsx        # チャット入力コンポーネント
│   ├── stream-message.tsx    # ストリーミングメッセージ
│   └── message-list.tsx      # メッセージリスト
├── hooks/
│   └── use-chat.ts           # チャットカスタムフック
├── lib/
│   └── mock.ts               # モックAPI（utils/mock.ts から移動）
├── types/
│   └── chat-types.ts         # 型定義（types.ts から移動）
└── styles/
    └── scrollbar.css         # スクロールバースタイル
```

### 2. Registry定義更新

#### メインblock定義

```typescript
{
  name: "chat",
  type: "registry:block",
  title: "AI Chat System",
  description: "AIアシスタントとのチャットインターフェース。ストリーミング、ツール呼び出し、Markdown対応",
  files: [
    {
      path: "src/registry/new-york/blocks/chat/page.tsx",
      type: "registry:page",
      target: "app/chat/page.tsx"
    },
    {
      path: "src/registry/new-york/blocks/chat/components/chat.tsx",
      type: "registry:component"
    },
    {
      path: "src/registry/new-york/blocks/chat/components/message.tsx",
      type: "registry:component"
    },
    {
      path: "src/registry/new-york/blocks/chat/components/chat-input.tsx",
      type: "registry:component"
    },
    {
      path: "src/registry/new-york/blocks/chat/components/stream-message.tsx",
      type: "registry:component"
    },
    {
      path: "src/registry/new-york/blocks/chat/components/message-list.tsx",
      type: "registry:component"
    },
    {
      path: "src/registry/new-york/blocks/chat/hooks/use-chat.ts",
      type: "registry:hook"
    },
    {
      path: "src/registry/new-york/blocks/chat/lib/mock.ts",
      type: "registry:lib"
    },
    {
      path: "src/registry/new-york/blocks/chat/types/chat-types.ts",
      type: "registry:file"
    },
    {
      path: "src/registry/new-york/blocks/chat/styles/scrollbar.css",
      type: "registry:file"
    }
  ],
  dependencies: [
    "lucide-react",
    "react-markdown",
    "remark-gfm"
  ],
  registryDependencies: [
    "button",
    "switch",
    "scroll-area",
    "accordion",
    "badge",
    "card",
    "separator",
    "tooltip",
    "auto-resize-textarea"  // 既に切り出し済みのコンポーネント
  ],
  categories: ["chat", "ai", "messaging", "blocks"]
}
```

### 3. 実装手順

#### Step 1: ディレクトリ構造作成

- [ ] `src/registry/new-york/blocks/chat/` 作成
- [ ] サブディレクトリ作成（components, hooks, lib, types, styles）

#### Step 2: ファイル移植

- [ ] `chat.tsx` をコピー・調整
- [ ] `message.tsx` をコピー・調整
- [ ] `chat-input.tsx` をコピー・調整
- [ ] `stream-message.tsx` をコピー・調整
- [ ] `message-list.tsx` をコピー・調整
- [ ] `use-chat.ts` をコピー・調整
- [ ] `utils/mock.ts` → `lib/mock.ts` に移動
- [ ] `types.ts` → `types/chat-types.ts` に移動
- [ ] `scrollbar.css` → `styles/scrollbar.css` に移動

#### Step 3: インポート調整

- [ ] `auto-resize-textarea` のインポートを registry dependency に変更
- [ ] 内部コンポーネント間のインポートパス調整
- [ ] 型定義のインポートパス調整

#### Step 4: 使用例ページ作成

- [ ] `example-usage.tsx` をベースに `page.tsx` 作成
- [ ] shadcn/ui blocks の標準的な構造に調整

#### Step 5: Registry設定更新

- [ ] `scripts/build-registry.ts` に chat block定義追加
- [ ] `auto-resize-textarea` との依存関係設定

#### Step 6: テスト・検証

- [ ] `npm run build:registry` 実行
- [ ] `npx shadcn@latest add "http://localhost:3000/r/chat.json"` でテスト
- [ ] 動作確認

### 4. 注意点

#### 依存関係の処理

- `auto-resize-textarea` は既に個別コンポーネントとして存在するため、`registryDependencies` として参照
- 既存のshadcn/ui components との整合性確保

#### インポートパスの調整

```typescript
// 変更前
import { AutoResizeTextarea } from "./auto-resize-textarea";

// 変更後
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";
```

#### CSS の取り扱い

- `scrollbar.css` は blocks 内の styles ディレクトリに配置
- 必要に応じて CSS variables の活用検討

### 5. 完成後の使用方法

#### 完全なchat systemのインストール

```bash
npx shadcn@latest add "http://localhost:3000/r/chat.json"
```

#### 個別コンポーネントのインストール（既存）

```bash
npx shadcn@latest add "http://localhost:3000/r/auto-resize-textarea.json"
```

### 6. 期待効果

- 高機能なAIチャットシステムをワンコマンドで導入可能
- モジュール化された構造により、個別の機能も再利用可能
- shadcn/ui エコシステムとの完全な統合
- TypeScript による型安全性の維持

この計画により、既存の高品質なchat componentをshadcn/ui blocks構造に効率的に移植できます。
