import type { ConfirmButton } from "@use-pico/client/ui/button";

export const TransactionButtonUi: ConfirmButton.Props = {
	iconProps: {
		ui: {
			text: "2xl",
		},
	},
	ui: {
		tone: "neutral",
		theme: "light",
		round: undefined,
		background: "default",
		text: "lg",
		border: false,
		shadow: false,
		width: "full",
		size: "md",
	},
};
