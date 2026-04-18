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

export const uiCtaLinkButton = ({ className, ...ui }: uiCtaLinkButton.Props) => {
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
