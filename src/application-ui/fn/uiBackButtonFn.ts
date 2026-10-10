import { uiButtonFn } from "~/ui/fn/uiButtonFn";
import type { uiFn as coolUi } from "~/ui/fn/uiFn";

export namespace uiBackButtonFn {
	export interface Ui extends uiButtonFn.Ui {
		//
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiBackButtonFn = ({ name, className, ...ui }: uiBackButtonFn.Props) => {
	return uiButtonFn({
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
