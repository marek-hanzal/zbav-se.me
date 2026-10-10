import { uiButtonFn } from "~/ui/fn/uiButtonFn";
import type { uiFn as coolUi } from "~/ui/fn/uiFn";

export namespace uiMenuButtonFn {
	export interface Ui extends uiButtonFn.Ui {
		//
	}
	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiMenuButtonFn = ({ name, className, ...ui }: uiMenuButtonFn.Props) => {
	return uiButtonFn({
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
