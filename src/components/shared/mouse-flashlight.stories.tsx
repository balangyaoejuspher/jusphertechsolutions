import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { MouseFlashlight } from "./mouse-flashlight"

const meta: Meta<typeof MouseFlashlight> = {
  title:     "Shared/MouseFlashlight",
  component: MouseFlashlight,
  tags:      ["autodocs"],
  parameters: { layout: "fullscreen", backgrounds: { default: "dark" } },
}
export default meta
type Story = StoryObj<typeof MouseFlashlight>

export const DarkMode: Story = {}