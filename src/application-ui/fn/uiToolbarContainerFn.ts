import type { uiContainerFn } from "~/ui/fn/uiContainerFn";
import { uiFn as coolUiFn } from "~/ui/fn/uiFn";

export namespace uiToolbarContainerFn {
	export interface Ui extends uiContainerFn.Ui {
		horizontal?: boolean;
		flip?: boolean;
	}

	export type Component<TRest extends object> = coolUiFn.Component<Ui, TRest>;

	export interface Props extends coolUiFn.PropsEx<Ui> {
		//
	}
}

export const uiToolbarContainerFn = ({
	name = "ToolbarContainer",
	className,
	...ui
}: uiToolbarContainerFn.Props) => {
	return coolUiFn<uiToolbarContainerFn.Ui>({
		name,
		ui,
		className: [
			"Container",
			className,
		],
	});
};
