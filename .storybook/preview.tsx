import type { Preview } from "@storybook/nextjs-vite"
import { ThemeProvider } from "../src/components/shared/theme-provider"
import "../src/app/globals.css"

const preview: Preview = {
    decorators: [
        (Story) => (
            <ThemeProvider>
                <Story />
            </ThemeProvider>
        ),
    ],
    parameters: {
        backgrounds: {
            default: "dark",
            values: [
                { name: "light", value: "#ffffff" },
                { name: "dark", value: "#09090b" },
            ],
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /date$/i,
            },
        },
    },
}

export default preview