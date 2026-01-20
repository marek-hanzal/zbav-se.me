import { ui as coolUi } from "@use-pico/cls";
import type { Ui as CoolUi } from "../Ui";

export namespace uiFloat {
	export interface Ui {
		position?: CoolUi.Position;
		zIndex?: CoolUi.zIndex;
		opacity?: CoolUi.Opacity;
		background?: CoolUi.Background;
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiFloat = ({ ui, className }: uiFloat.Props) => {
	return coolUi<uiFloat.Ui>({
		name: "Float",
		ui: {
			...ui,
		},
		className,
	});
};
