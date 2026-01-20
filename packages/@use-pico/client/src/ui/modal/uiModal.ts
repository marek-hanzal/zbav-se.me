import { ui as coolUi } from "@use-pico/cls";
import type { Ui as CoolUi } from "../Ui";

export namespace uiModal {
	export type Size = "sm" | "md" | "lg" | "full";

	export interface Ui {
		theme?: CoolUi.Theme;
		tone?: CoolUi.Tone;
		//
		size?: Size;
		disabled?: CoolUi.Disabled;
		loading?: boolean;
		//
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

export const uiModal = ({ ui, className }: uiModal.Props) => {
	return coolUi<uiModal.Ui>({
		name: "Modal",
		ui: {
			tone: "primary",
			theme: "light",
			size: "md",
			disabled: false,
			loading: false,
			...ui,
		},
		className,
	});
};
