import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { PageLoader } from "./page-loader"

const meta: Meta<typeof PageLoader> = {
  title:     "Shared/PageLoader",
  component: PageLoader,
  tags:      ["autodocs"],
  parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof PageLoader>

export const Default: Story = {}

export const CustomMessage: Story = {
  args: { message: "Verifying your access..." },
}