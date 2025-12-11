import { uiButton } from "@use-pico/client/ui/button";
import type { ui as coolUi } from "@use-pico/cls";

export namespace uiMenuButton {
	export interface Ui extends uiButton.Ui {
		//
	}
	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiMenuButton = ({ ui, className }: uiMenuButton.Props) => {
	return uiButton({
		ui: {
			flow: "vertical",
			items: "center",
			tone: "primary",
			theme: "light",
			width: "full",
			justify: "center",
			background: "default",
			border: false,
			color: "lead",
			text: "lg",
			size: "lg",
			...ui,
		},
		className: [
			"tone-neutral-light-bg",
			className,
		],
	});
};
