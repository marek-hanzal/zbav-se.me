import { uiButton } from "@use-pico/client/ui/button";
import type { ui as coolUi } from "@/lib/cls";

export namespace uiCtaLinkButton {
	export interface Ui extends uiButton.Ui {
		//
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiCtaLinkButton = ({ ui, className }: uiCtaLinkButton.Props) => {
	return uiButton({
		ui: {
			tone: "link",
			theme: "light",
			text: "lg",
			color: "text",
			inner: "default",
			...ui,
		},
		className,
	});
};
