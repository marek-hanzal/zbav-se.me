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
		round: "full",
		background: "default",
		text: "sm",
		border: true,
		shadow: false,
		width: "full",
		size: "sm",
	},
};
