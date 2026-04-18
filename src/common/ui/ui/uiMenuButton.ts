import { uiButton } from "@/lib/client/button";
import type { ui as coolUi } from "@/lib/client/cls";

export namespace uiMenuButton {
	export interface Ui extends uiButton.Ui {
		//
	}
	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiMenuButton = ({ className, ...ui }: uiMenuButton.Props) => {
	return uiButton({
		ui: {
			flow: "horizontal",
			tone: "neutral",
			theme: "light",
			width: "full",
			//
			items: "center",
			justify: "start",
			//
			background: "default",
			border: false,
			//
			color: "lead",
			text: "lg",
			size: "md",
			shadow: false,
			round: undefined,
			...ui,
		},
		className: [
			"tone-neutral-light-bg",
			className,
		],
	});
};
