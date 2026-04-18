import { ui as coolUi } from "@/lib/client/cls";
import type { uiContainer } from "@/lib/client/container";

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

export const uiToolbarContainer = ({ className, ...ui }: uiToolbarContainer.Props) => {
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
