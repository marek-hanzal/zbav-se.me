import { uiButtonFn } from "~/ui/fn/uiButtonFn";
import type { uiFn as coolUi } from "~/ui/fn/uiFn";

export namespace uiCtaLinkButtonFn {
	export interface Ui extends uiButtonFn.Ui {
		//
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiCtaLinkButtonFn = ({ name, className, ...ui }: uiCtaLinkButtonFn.Props) => {
	return uiButtonFn({
		name,
		"data-ui-tone": "link",
		"data-ui-theme": "light",
		"data-ui-text": "lg",
		"data-ui-color": "text",
		"data-ui-inner": "default",
		...ui,
		className,
	});
};
