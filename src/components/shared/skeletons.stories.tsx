
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { CardSkeleton, PageSkeleton } from "./page-skeleton"


const cardMeta: Meta<typeof CardSkeleton> = {
  title:     "Shared/Skeletons/CardSkeleton",
  component: CardSkeleton,
  tags:      ["autodocs"],
  parameters: { layout: "centered" },
}
export default cardMeta
type CardStory = StoryObj<typeof CardSkeleton>

export const Default: CardStory = {}

export const DarkMode: CardStory = {
  parameters: { backgrounds: { default: "dark" } },
}


export const FullPage: StoryObj<typeof PageSkeleton> = {
  render: () => <PageSkeleton />,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "light" },
  },
}

export const FullPageDark: StoryObj<typeof PageSkeleton> = {
  render: () => <PageSkeleton />,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
}