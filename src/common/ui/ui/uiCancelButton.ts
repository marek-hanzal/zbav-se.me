import { uiButton } from "@/lib/client/button";
import type { ui as coolUi } from "@/lib/client/cls";

export namespace uiCancelButton {
	export interface Ui extends uiButton.Ui {
		//
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiCancelButton = ({ className, ...ui }: uiCancelButton.Props) => {
	return uiButton({
		ui: {
			tone: "neutral",
			theme: "light",
			inner: "md",
			text: "lg",
			justify: "center",
			items: "center",
			width: "full",
			...ui,
		},
		className,
	});
};
