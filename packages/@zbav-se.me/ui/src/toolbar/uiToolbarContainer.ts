import type { uiContainer } from "@use-pico/client/ui/container";
import { ui as coolUi } from "@use-pico/cls";

export namespace uiToolbarContainer {
	export interface Ui extends uiContainer.Ui {
		horizontal?: boolean;
		flip?: boolean;
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiToolbarContainer = ({ ui, className }: uiToolbarContainer.Props) => {
	return coolUi<uiToolbarContainer.Ui>({
		name: "ToolbarContainer",
		ui: {
			...ui,
		},
		className: [
			"Container",
			className,
		],
	});
};
