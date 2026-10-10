import { uiFn as coolUiFn } from "~/ui/fn/uiFn";

export namespace uiOverlayFn {
	export type Type = "overlay" | "subtle";

	export interface Ui {
		type?: Type;
	}

	export type Component<TRest extends object> = coolUiFn.Component<Ui, TRest>;

	export interface Props extends coolUiFn.PropsEx<Ui> {
		//
	}
}

export const uiOverlayFn = ({ name = "Overlay", className, ...ui }: uiOverlayFn.Props) => {
	return coolUiFn<uiOverlayFn.Ui>({
		name,
		ui,
		className,
	});
};
