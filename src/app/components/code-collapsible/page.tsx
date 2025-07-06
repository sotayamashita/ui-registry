"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { CodeCollapsible } from "@/registry/new-york/code-collapsible/code-collapsible";
import { Code } from "@/registry/new-york/code/code";

export default function CodeCollapsiblePreview() {
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

  const updateTodoPriority = useCallback((id: string, priority: TodoItem["priority"]) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, priority } : todo
      )
    );
  }, []);

  const bulkDelete = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.target === document.activeElement) {
        addTodo();
      }
    };
    
    document.addEventListener("keypress", handleKeyPress);
    return () => document.removeEventListener("keypress", handleKeyPress);
  }, [addTodo]);

  // Auto-save to localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem("advanced-todos");
    if (savedTodos) {
      try {
        const parsed = JSON.parse(savedTodos);
        setTodos(parsed.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
        })));
      } catch (error) {
        console.error("Failed to parse saved todos:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("advanced-todos", JSON.stringify(todos));
  }, [todos]);

  const getPriorityColor = (priority: TodoItem["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Advanced Todo App
            <div className="flex gap-2 text-sm font-normal">
              <Badge variant="outline">{stats.total} total</Badge>
              <Badge variant="outline">{stats.pending} pending</Badge>
              <Badge variant="outline">{stats.completed} completed</Badge>
              {stats.highPriority > 0 && (
                <Badge variant="destructive">{stats.highPriority} high priority</Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add new todo */}
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add a new todo..."
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
              className="flex-1"
            />
            <Button onClick={addTodo}>Add</Button>
          </div>

          {/* Search and filters */}
          <div className="flex flex-wrap gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search todos..."
              className="flex-1 min-w-[200px]"
            />
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="date">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="alphabetical">Sort Alphabetically</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>

          {/* Bulk actions */}
          {stats.completed > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {stats.completed} completed item{stats.completed !== 1 ? "s" : ""}
              </span>
              <Button variant="outline" size="sm" onClick={bulkDelete}>
                Delete Completed
              </Button>
            </div>
          )}

          <Separator />

          {/* Todo list */}
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {filteredAndSortedTodos.map(todo => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="h-4 w-4"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          "text-sm",
                          todo.completed ? "line-through text-muted-foreground" : ""
                        )}
                      >
                        {todo.text}
                      </span>
                      <Badge className={getPriorityColor(todo.priority)} variant="secondary">
                        {todo.priority}
                      </Badge>
                      {todo.category !== "general" && (
                        <Badge variant="outline">{todo.category}</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{todo.createdAt.toLocaleDateString()}</span>
                      {todo.tags.length > 0 && (
                        <div className="flex gap-1">
                          {todo.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <select
                      value={todo.priority}
                      onChange={(e) => updateTodoPriority(todo.id, e.target.value as TodoItem["priority"])}
                      className="text-xs border rounded px-1 py-0.5"
                      disabled={todo.completed}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredAndSortedTodos.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm || filter !== "all" || selectedCategory !== "all" ? (
                    <p>No todos match your current filters.</p>
                  ) : (
                    <p>No todos yet. Add one above!</p>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}`;

  const mediumCode = `function greet(name: string) {
  const greeting = \`Hello, \${name}!\`;
  console.log(greeting);
  return greeting;
}

export default greet;`;

  const shortCode = `console.log("Hello, World!");`;

  return (
    <TooltipProvider>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Code Collapsible Wrapper</h1>
        <div className="space-y-12">
          <div className="border rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-4">Long Code Example</h2>
            <p className="text-muted-foreground mb-4">
              This example shows a long code block that benefits from
              collapsible functionality.
            </p>
            <CodeCollapsible>
              <Code
                code={longCode}
                language="tsx"
                title="AdvancedTodoApp.tsx"
              />
            </CodeCollapsible>
          </div>

          <div className="border rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-4">Medium Code Example</h2>
            <p className="text-muted-foreground mb-4">
              This example shows a medium-length code block.
            </p>
            <CodeCollapsible>
              <Code code={mediumCode} language="ts" title="greet.ts" />
            </CodeCollapsible>
          </div>

          <div className="border rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-4">Short Code Example</h2>
            <p className="text-muted-foreground mb-4">
              This example shows how the wrapper works with short code blocks.
            </p>
            <CodeCollapsible>
              <Code code={shortCode} language="js" title="hello.js" />
            </CodeCollapsible>
          </div>

          <div className="border rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-4">Multiple Code Blocks</h2>
            <p className="text-muted-foreground mb-4">
              You can wrap multiple elements within the collapsible wrapper.
            </p>
            <CodeCollapsible>
              <div className="space-y-4">
                <Code
                  code="npm install react"
                  language="bash"
                  title="Install React"
                />
                <Code
                  code="npm start"
                  language="bash"
                  title="Start Development Server"
                />
                <Code code={mediumCode} language="ts" title="greet.ts" />
              </div>
            </CodeCollapsible>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
