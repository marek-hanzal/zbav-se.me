import type { uiFn as coolUi } from "~/ui/fn/uiFn";
import { uiStatusFn } from "~/ui/fn/uiStatusFn";

export namespace uiWarningStatusFn {
	export interface Ui extends uiStatusFn.Ui {
		//
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiWarningStatusFn = ({ name, className, ...ui }: uiWarningStatusFn.Props) => {
	return uiStatusFn({
		name,
		"data-ui-tone": "brand",
		"data-ui-theme": "light",
		"data-ui-color": "lead",
		"data-ui-text": "4xl",
		"data-ui-inner": "4xl",
		...ui,
		className: [
			"text-center",
			className,
		],
	});
};
