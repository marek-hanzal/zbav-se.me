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
		"data-ui-tone": "neutral",
		"data-ui-theme": "light",
		"data-ui-justify": "center",
		"data-ui-round": "full",
		"data-ui-square": "md",
		"data-ui-text": "xl",
		"data-ui-opacity": "6",
		"data-ui-color": "lead",
		...ui,
		className,
	});
};
