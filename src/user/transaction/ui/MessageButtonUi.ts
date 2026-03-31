import type { ConfirmButton } from "@/lib/client/button";

export const MessageButtonUi: ConfirmButton.Props = {
	iconProps: {
		ui: {
			text: "2xl",
		},
	},
	ui: {
		tone: "link",
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
