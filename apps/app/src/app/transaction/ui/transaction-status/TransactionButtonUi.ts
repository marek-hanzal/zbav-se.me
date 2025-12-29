import type { Button } from "@use-pico/client/ui/button";

export const TransactionButtonUi: Button.Props = {
	iconProps: {
		ui: {
			text: "xl",
		},
	},
	ui: {
		tone: "neutral",
		theme: "light",
		round: "default",
		background: "default",
		text: "sm",
		border: true,
		shadow: false,
		width: "content",
	},
	className: [
		"px-2",
		"py-1",
	],
};
