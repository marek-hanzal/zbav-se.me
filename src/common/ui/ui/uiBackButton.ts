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

export const uiBackButton = ({ name, className, ...ui }: uiBackButton.Props) => {
	return uiButton({
		name,
		"data-ui-tone": "neutral",
		"data-ui-theme": "light",
		"data-ui-justify": "center",
		"data-ui-round": "full",
		"data-ui-square": "md",
		"data-ui-text": "xl",
		"data-ui-opacity": "8",
		"data-ui-color": "lead",
		"data-ui-shadow": false,
		...ui,
		className,
	});
};
