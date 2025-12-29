import type { Button } from "@use-pico/client/ui/button";

export const MessageButtonUi: Button.Props = {
	iconProps: {
		ui: {
			text: "xl",
		},
	},
	ui: {
		tone: "link",
		theme: "light",
		round: "full",
		background: "default",
		text: "sm",
		border: true,
		shadow: false,
		width: "full",
		size: "sm",
	},
};
