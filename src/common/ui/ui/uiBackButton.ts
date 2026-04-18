import { uiButton } from "@/lib/client/button";
import type { ui as coolUi } from "@/lib/client/cls";

export namespace uiBackButton {
	export interface Ui extends uiButton.Ui {
		//
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiBackButton = ({ className, ...ui }: uiBackButton.Props) => {
	return uiButton({
		ui: {
			tone: "neutral",
			theme: "light",
			justify: "center",
			round: "full",
			square: "md",
			text: "xl",
			opacity: "6",
			color: "lead",
			...ui,
		},
		className,
	});
};
