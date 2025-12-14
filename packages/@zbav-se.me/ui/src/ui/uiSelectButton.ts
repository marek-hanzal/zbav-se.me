import { uiButton } from "@use-pico/client/ui/button";
import type { ui as coolUi } from "@use-pico/cls";

export namespace uiSelectButton {
	export interface Ui extends uiButton.Ui {
		//
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		isSelected: boolean;
	}
}

export const uiSelectButton = ({ isSelected, ui, className }: uiSelectButton.Props) => {
	return uiButton({
		ui: {
			tone: isSelected ? "secondary" : "neutral",
			theme: "light",
			flow: "vertical",
			items: "start",
			justify: "center",
			size: "lg",
			font: isSelected ? "bold" : "normal",
			width: "full",
			...ui,
		},
		className,
	});
};
