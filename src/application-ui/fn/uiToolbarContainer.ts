import { ui as coolUi } from "~/ui/fn/ui";
import type { uiContainer } from "~/ui/fn/uiContainer";

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

export const uiToolbarContainer = ({
	name = "ToolbarContainer",
	className,
	...ui
}: uiToolbarContainer.Props) => {
	return coolUi<uiToolbarContainer.Ui>({
		name,
		ui,
		className: [
			"Container",
			className,
		],
	});
};
