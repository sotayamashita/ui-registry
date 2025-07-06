import { TooltipProvider } from "@/components/ui/tooltip";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Code } from "../code/code";
import { CodeCollapsible } from "./code-collapsible";

const meta = {
  title: "Registry/CodeCollapsible",
  component: CodeCollapsible,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="max-w-4xl">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof CodeCollapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

const longCode = `import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: "low" | "medium" | "high";
  category: string;
  tags: string[];
}

interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
}

export function AdvancedTodoApp() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "priority" | "alphabetical">("date");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Memoized calculations
  const stats: TodoStats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const highPriority = todos.filter(todo => todo.priority === "high" && !todo.completed).length;
    
    return { total, completed, pending, highPriority };
  }, [todos]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(todos.map(todo => todo.category)));
    return ["all", ...uniqueCategories];
  }, [todos]);

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = todos;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (filter === "active") {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filter === "completed") {
      filtered = filtered.filter(todo => todo.completed);
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(todo => todo.category === selectedCategory);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "alphabetical":
          return a.text.localeCompare(b.text);
        case "date":
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });
  }, [todos, searchTerm, filter, selectedCategory, sortBy]);

  const addTodo = useCallback(() => {
    if (inputValue.trim() !== "") {
      const newTodo: TodoItem = {
        id: Math.random().toString(36).substr(2, 9),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date(),
        priority: "medium",
        category: "general",
        tags: [],
      };
      setTodos(prev => [...prev, newTodo]);
      setInputValue("");
    }
  }, [inputValue]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Todo App</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Implementation details... */}
        </CardContent>
      </Card>
    </div>
  );
}`;

const mediumCode = `function createUser(data: Partial<User>): User {
  return {
    id: Math.random(),
    name: data.name || "Anonymous",
    email: data.email || "user@example.com",
    createdAt: new Date(),
    isActive: true,
  };
}

export default createUser;`;

const shortCode = `console.log("Hello, World!");`;

export const LongCodeBlock: Story = {
  args: {
    children: (
      <Code code={longCode} language="tsx" title="AdvancedTodoApp.tsx" />
    ),
  },
};

export const MediumCodeBlock: Story = {
  args: {
    children: <Code code={mediumCode} language="ts" title="createUser.ts" />,
  },
};

export const ShortCodeBlock: Story = {
  args: {
    children: <Code code={shortCode} language="js" title="hello.js" />,
  },
};

export const MultipleCodeBlocks: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <Code code="npm install react" language="bash" title="Install React" />
        <Code
          code="npm start"
          language="bash"
          title="Start Development Server"
        />
        <Code code={mediumCode} language="ts" title="createUser.ts" />
      </div>
    ),
  },
};

export const WithoutCopyButtons: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <Code
          code="git add ."
          language="bash"
          title="Stage Changes"
          showCopyButton={false}
        />
        <Code
          code="git commit -m 'Initial commit'"
          language="bash"
          title="Commit Changes"
          showCopyButton={false}
        />
      </div>
    ),
  },
};
