import { uiButtonFn } from "~/ui/fn/uiButtonFn";
import type { uiFn as coolUi } from "~/ui/fn/uiFn";

export namespace uiSaveButtonFn {
	export interface Ui extends uiButtonFn.Ui {
		//
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiSaveButtonFn = ({ name, className, ...ui }: uiSaveButtonFn.Props) => {
	return uiButtonFn({
		name,
		"data-ui-tone": "secondary",
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
