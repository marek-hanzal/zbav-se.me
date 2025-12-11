import type { uiButton } from "@use-pico/client/ui/button";
import { ui as coolUi } from "@use-pico/cls";

export namespace uiNavButton {
	export interface Ui extends uiButton.Ui {
		//
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiNavButton = ({ ui, className }: uiNavButton.Props) => {
	return coolUi<uiNavButton.Ui>({
		name: "NavButton",
		ui: {
			tone: "brand",
			theme: "light",
			text: "2xl",
			square: "xl",
			color: "lead",
			round: "xl",
			flow: "horizontal",
			items: "center",
			justify: "center",
			backgroundActive: "default",
			shadow: true,
			shadowActive: true,
			...ui,
		},
		className,
	});
};
