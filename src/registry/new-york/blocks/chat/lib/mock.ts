export const mockSleep = (ms: number, signal?: AbortSignal): Promise<void> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      resolve();
    }, ms);

    // Listen for abort signal
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timeout);
        reject(new DOMException("Request was aborted", "AbortError"));
      });
    }
  });
};

// Mock data scenarios
const mockResponses = {
  markdown: `# Markdown Demo Response

This is a **comprehensive markdown** response to demonstrate various formatting capabilities:

## Code Examples

Here's some \`inline code\` and a code block:

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const createUser = (data: Partial<User>): User => {
  return {
    id: Date.now(),
    ...data,
  } as User;
};
\`\`\`

## Lists and Tables

### Unordered List
- **Bold item**
- *Italic item*
- Regular item with [link](https://example.com)

### Ordered List
1. First step
2. Second step
3. Third step

### Table
| Feature | Status | Notes |
|---------|--------|-------|
| Markdown | ✅ Working | Full support |
| Code highlighting | ✅ Working | TypeScript ready |
| Tables | ✅ Working | Responsive |

## Blockquotes

> This is a blockquote example.
> It can span multiple lines and demonstrates
> how quoted text appears in the chat.

## Additional Elements

- Checkboxes: ✅ ❌ ⏳
- Emojis: 🚀 💻 🎉
- **Emphasis**: *italic*, **bold**, ***both***`,

  tool: {
    name: "code_generator",
    args: {
      language: "python",
      description: "Generate a simple calculator function",
      requirements: ["addition", "subtraction", "multiplication", "division"],
    },
    result: {
      code: `def calculator(a, b, operation):
    """
    Simple calculator function
    
    Args:
        a (float): First number
        b (float): Second number  
        operation (str): Operation type (+, -, *, /)
    
    Returns:
        float: Result of the calculation
    """
    if operation == '+':
        return a + b
    elif operation == '-':
        return a - b
    elif operation == '*':
        return a * b
    elif operation == '/':
        if b != 0:
            return a / b
        else:
            raise ValueError("Cannot divide by zero")
    else:
        raise ValueError("Invalid operation")

# Example usage
result = calculator(10, 5, '+')
print(f"10 + 5 = {result}")`,
      explanation:
        "Created a calculator function with error handling for division by zero and invalid operations.",
    },
  },

  error:
    "I encountered an error while processing your request. This demonstrates how errors are handled in the chat system.",

  long: `# Long Response Demonstration

This is a deliberately long response to test scrolling, message handling, and UI performance with extensive content.

## Introduction

When dealing with AI responses, it's important to handle various content lengths effectively. This response demonstrates how the chat system manages longer content while maintaining readability and performance.

## Detailed Technical Analysis

### Frontend Architecture

The chat system uses several key technologies:

1. **React with TypeScript** for type-safe component development
2. **State management** through custom hooks
3. **Markdown rendering** via react-markdown
4. **Responsive design** with Tailwind CSS

### Component Structure

\`\`\`
Chat System/
├── Chat (Main container)
├── Message (Individual message display)
├── ChatInput (Input with auto-resize)
├── StreamMessage (Streaming content)
└── MessageList (Message collection)
\`\`\`

### Key Features

#### Real-time Communication
- WebSocket or HTTP streaming support
- Graceful fallback mechanisms
- Connection state management
- Retry logic for failed requests

#### Message Processing
- Markdown parsing and rendering
- Code syntax highlighting
- Tool invocation display
- Error state handling

#### User Experience
- Auto-scrolling to new messages
- Input auto-resize based on content
- Keyboard shortcuts for common actions
- Accessibility features (ARIA labels, keyboard navigation)

## Performance Considerations

### Optimization Strategies

1. **Virtualization** for long message lists
2. **Lazy loading** for message history
3. **Debounced input** to reduce API calls
4. **Memoization** of expensive computations

### Memory Management

- Cleanup of event listeners
- Abort controllers for cancelled requests
- Efficient state updates
- Component unmounting handling

## Security Aspects

### Input Sanitization
- XSS prevention through proper escaping
- Content Security Policy headers
- Input validation and filtering
- Rate limiting on API endpoints

### Data Privacy
- Secure message transmission
- Local storage encryption
- Session management
- Audit logging capabilities

## Conclusion

This extensive response demonstrates the chat system's ability to handle various content types and lengths while maintaining performance and user experience. The implementation showcases modern React patterns, TypeScript best practices, and thoughtful UX design.

The system is designed to be extensible, allowing for easy integration of additional features such as file uploads, voice messages, or custom tool integrations.`,
};

// Pattern matching for different demo scenarios
const getResponseType = (message: string): keyof typeof mockResponses => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("markdown") || lowerMessage.includes("format")) {
    return "markdown";
  }
  if (
    lowerMessage.includes("tool") ||
    lowerMessage.includes("function") ||
    lowerMessage.includes("code")
  ) {
    return "tool";
  }
  if (lowerMessage.includes("error") || lowerMessage.includes("fail")) {
    return "error";
  }
  if (
    lowerMessage.includes("long") ||
    lowerMessage.includes("detailed") ||
    lowerMessage.includes("extensive")
  ) {
    return "long";
  }

  // Default to markdown for other cases
  return "markdown";
};

export const mockApiCall = async (
  message: string,
  signal?: AbortSignal,
  streamMode = false,
  onStreamUpdate?: (chunk: string) => void,
): Promise<string> => {
  try {
    const responseType = getResponseType(message);
    let response = mockResponses[responseType];

    // Special handling for tool responses
    if (responseType === "tool") {
      response = `I'll help you with that tool request. Let me process this step by step.`;
    }

    // Ensure response is always a string
    const responseText =
      typeof response === "string" ? response : JSON.stringify(response);

    if (streamMode && onStreamUpdate) {
      // Simulate streaming by sending chunks of the response
      const words = responseText.split(" ");
      let currentText = "";

      for (let i = 0; i < words.length; i++) {
        if (signal?.aborted) {
          throw new DOMException("Request was aborted", "AbortError");
        }

        currentText += (i > 0 ? " " : "") + words[i];
        onStreamUpdate(currentText);

        // Random delay between words to simulate realistic streaming
        const wordDelay = Math.random() * 50 + 20; // 20-70ms per word
        await mockSleep(wordDelay, signal);
      }

      return currentText;
    } else {
      // Non-streaming mode - return after delay
      const delay =
        responseType === "long" ? 3000 : responseType === "tool" ? 2000 : 1500;
      await mockSleep(delay, signal);
      return responseText;
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request was cancelled by user");
    }
    throw error;
  }
};

// Tool invocation mock
export const mockToolCall = (message: string) => {
  const responseType = getResponseType(message);

  if (responseType === "tool") {
    return {
      toolName: mockResponses.tool.name,
      args: mockResponses.tool.args,
      result: mockResponses.tool.result,
    };
  }

  return null;
};

// Demo scenarios helper
export const getDemoScenarios = () => [
  {
    trigger: "markdown",
    description:
      "Demonstrates comprehensive Markdown formatting including code blocks, tables, lists, and links",
    example: "Show me markdown formatting examples",
  },
  {
    trigger: "tool",
    description:
      "Shows tool/function calling capabilities with input/output visualization",
    example: "Generate some code for me",
  },
  {
    trigger: "error",
    description: "Demonstrates error handling and display",
    example: "Trigger an error",
  },
  {
    trigger: "long",
    description:
      "Tests UI with extensive content to verify scrolling and performance",
    example: "Give me a detailed explanation",
  },
];
