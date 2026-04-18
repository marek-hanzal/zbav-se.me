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

export const uiMenuButton = ({ name, className, ...ui }: uiMenuButton.Props) => {
	return uiButton({
		name,
		"data-ui-flow": "horizontal",
		"data-ui-tone": "neutral",
		"data-ui-theme": "light",
		"data-ui-width": "full",
		"data-ui-items": "center",
		"data-ui-justify": "start",
		"data-ui-background": "default",
		"data-ui-border": false,
		"data-ui-color": "lead",
		"data-ui-text": "lg",
		"data-ui-size": "md",
		"data-ui-shadow": false,
		"data-ui-round": undefined,
		...ui,
		className: [
			"tone-neutral-light-bg",
			className,
		],
	});
};
