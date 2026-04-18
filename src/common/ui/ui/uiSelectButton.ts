import { uiButton } from "@/lib/client/button";
import type { ui as coolUi } from "@/lib/client/cls";

export namespace uiSelectButton {
	export interface Ui extends uiButton.Ui {
		//
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		isSelected: boolean;
	}
}

export const uiSelectButton = ({ name, isSelected, className, ...ui }: uiSelectButton.Props) => {
	return uiButton({
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
