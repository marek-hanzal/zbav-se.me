import { uiButton } from "@/lib/client/button";
import type { ui as coolUi } from "@/lib/client/cls";

export namespace uiCancelButton {
	export interface Ui extends uiButton.Ui {
		//
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiCancelButton = ({ name, className, ...ui }: uiCancelButton.Props) => {
	return uiButton({
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
