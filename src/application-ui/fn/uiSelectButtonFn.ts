import { uiButtonFn } from "~/ui/fn/uiButtonFn";
import type { uiFn as coolUi } from "~/ui/fn/uiFn";

export namespace uiSelectButtonFn {
	export interface Ui extends uiButtonFn.Ui {
		//
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		isSelected: boolean;
	}
}

export const uiSelectButtonFn = ({
	name,
	isSelected,
	className,
	...ui
}: uiSelectButtonFn.Props) => {
	return uiButtonFn({
		name,
		"data-ui-tone": isSelected ? "secondary" : "neutral",
		"data-ui-theme": "light",
		"data-ui-flow": "vertical",
		"data-ui-items": "start",
		"data-ui-justify": "center",
		"data-ui-size": "default",
		"data-ui-font": isSelected ? "bold" : "normal",
		"data-ui-width": "full",
		"data-ui-height": "content",
		...ui,
		className,
	});
};
