import type { ConfirmButton } from "@use-pico/client/ui/button";

export const TransactionButtonUi: ConfirmButton.Props = {
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
		width: "full",
		size: "sm",
	},
};
