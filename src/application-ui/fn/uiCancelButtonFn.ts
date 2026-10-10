import { uiButtonFn } from "~/ui/fn/uiButtonFn";
import type { uiFn as coolUi } from "~/ui/fn/uiFn";

export namespace uiCancelButtonFn {
	export interface Ui extends uiButtonFn.Ui {
		//
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiCancelButtonFn = ({ name, className, ...ui }: uiCancelButtonFn.Props) => {
	return uiButtonFn({
		name,
		"data-ui-tone": "neutral",
		"data-ui-theme": "light",
		"data-ui-inner": "md",
		"data-ui-text": "lg",
		"data-ui-justify": "center",
		"data-ui-items": "center",
		"data-ui-width": "full",
		...ui,
		className,
	});
};
