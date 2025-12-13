import { uiButton } from "@use-pico/client/ui/button";
import type { ui as coolUi } from "@use-pico/cls";

export namespace uiSaveButton {
	export interface Ui extends uiButton.Ui {
		//
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiSaveButton = ({ ui, className }: uiSaveButton.Props) => {
	return uiButton({
		ui: {
			tone: "secondary",
			theme: "light",
			inner: "md",
			text: "lg",
			justify: "center",
			items: "center",
			width: "content",
			...ui,
		},
		className: [
			"mx-auto",
			className,
		],
	});
};
