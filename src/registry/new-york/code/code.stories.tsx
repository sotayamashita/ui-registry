import { TooltipProvider } from "@/components/ui/tooltip";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Code } from "./code";

const meta = {
  title: "Registry/Code",
  component: Code,
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
  argTypes: {
    language: {
      control: "select",
      options: [
        "js",
        "jsx",
        "ts",
        "tsx",
        "javascript",
        "typescript",
        "bash",
        "json",
      ],
    },
    showCopyButton: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const JavaScript: Story = {
  args: {
    code: jsCode,
    language: "js",
    title: "greet.js",
  },
};

export const TypeScript: Story = {
  args: {
    code: tsCode,
    language: "ts",
    title: "user.ts",
  },
};

export const JSX: Story = {
  args: {
    code: jsxCode,
    language: "jsx",
    title: "Welcome.jsx",
  },
};

export const TSX: Story = {
  args: {
    code: tsxCode,
    language: "tsx",
    title: "Button.tsx",
  },
};

export const WithoutTitle: Story = {
  args: {
    code: "console.log('Hello, World!');",
    language: "js",
  },
};

export const WithoutCopyButton: Story = {
  args: {
    code: "npm install @tabler/icons-react",
    language: "bash",
    title: "install-command.sh",
    showCopyButton: false,
  },
};

export const LongCode: Story = {
  args: {
    code: `import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export function TodoApp() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const addTodo = useCallback(() => {
    if (inputValue.trim() !== "") {
      const newTodo: TodoItem = {
        id: Math.random().toString(36).substr(2, 9),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTodos(prev => [...prev, newTodo]);
      setInputValue("");
    }
  }, [inputValue]);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.target === document.activeElement) {
        addTodo();
      }
    };
    
    document.addEventListener("keypress", handleKeyPress);
    return () => document.removeEventListener("keypress", handleKeyPress);
  }, [addTodo]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Todo App</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new todo..."
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
          />
          <Button onClick={addTodo}>Add</Button>
        </div>
        
        <div className="flex gap-2">
          {(["all", "active", "completed"] as const).map(filterType => (
            <Button
              key={filterType}
              variant={filter === filterType ? "default" : "outline"}
              onClick={() => setFilter(filterType)}
              className="capitalize"
            >
              {filterType}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              className="flex items-center gap-2 p-2 border rounded"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span
                className={
                  todo.completed ? "line-through text-muted-foreground" : ""
                }
              >
                {todo.text}
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteTodo(todo.id)}
                className="ml-auto"
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
        
        {filteredTodos.length === 0 && (
          <p className="text-center text-muted-foreground">
            No todos {filter !== "all" ? \`(\${filter})\` : ""} found.
          </p>
        )}
      </CardContent>
    </Card>
  );
}`,
    language: "tsx",
    title: "TodoApp.tsx",
  },
};
