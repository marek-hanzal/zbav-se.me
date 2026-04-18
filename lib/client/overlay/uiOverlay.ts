import { ui as coolUi } from "../cls";

export namespace uiOverlay {
	export type Type = "overlay" | "subtle";

	export interface Ui {
		type?: Type;
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiOverlay = ({ name = "Overlay", className, ...ui }: uiOverlay.Props) => {
	return coolUi<uiOverlay.Ui>({
		name,
		ui,
		className,
	});
};
