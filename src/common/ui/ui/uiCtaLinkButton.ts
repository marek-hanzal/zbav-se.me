import { uiButton } from "@/lib/client/button";
import type { ui as coolUi } from "@/lib/client/cls";

export namespace uiCtaLinkButton {
	export interface Ui extends uiButton.Ui {
		//
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiCtaLinkButton = ({ name, className, ...ui }: uiCtaLinkButton.Props) => {
	return uiButton({
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
