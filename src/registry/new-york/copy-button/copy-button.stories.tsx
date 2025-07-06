import { TooltipProvider } from "@/components/ui/tooltip";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CopyButton } from "./copy-button";

const meta = {
  title: "Registry/CopyButton",
  component: CopyButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="relative min-h-[200px] min-w-[400px] flex items-center justify-center">
          <div className="relative bg-muted p-4 rounded-lg">
            <pre className="text-sm font-mono pr-12">
              npm install @tabler/icons-react
            </pre>
            <Story />
          </div>
        </div>
      </TooltipProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "ghost",
        "destructive",
        "outline",
        "link",
      ],
    },
  },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "npm install @tabler/icons-react",
  },
};
