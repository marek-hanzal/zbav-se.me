import { uiButton } from "@use-pico/client/ui/button";
import type { ui as coolUi } from "@use-pico/cls";

export namespace uiBackButton {
	export interface Ui extends uiButton.Ui {
		//
	}
	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiBackButton = ({ ui, className }: uiBackButton.Props) => {
	return uiButton({
		ui: {
			tone: "primary",
			theme: "light",
			justify: "center",
			round: "full",
			square: "md",
			text: "xl",
			opacity: "low",
			color: "lead",
			shadow: false,
			border: false,
			background: undefined,
			...ui,
		},
		className,
	});
};
