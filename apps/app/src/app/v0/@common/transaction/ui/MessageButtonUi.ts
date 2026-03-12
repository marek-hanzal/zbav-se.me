import type { ConfirmButton } from "@use-pico/client/ui/button";

export const MessageButtonUi: ConfirmButton.Props = {
	iconProps: {
		ui: {
			text: "xl",
		},
	},
	ui: {
		tone: "link",
		theme: "light",
		round: undefined,
		background: "default",
		text: "sm",
		border: false,
		shadow: false,
		width: "full",
		size: "sm",
	},
};
