import type { Ui as CoolUi } from "@use-pico/client/ui";
import { ui as coolUi } from "@use-pico/cls";

export namespace uiTypoIcon {
	export type Justify = "start" | "center";
	export type Items = "start" | "center";

	export interface Ui {
		theme?: CoolUi.Theme;
		tone?: CoolUi.Tone;
		//
		justify?: Justify;
		items?: Items;
		//
		flow?: CoolUi.Flow;
		gap?: CoolUi.Gap;
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiTypoIcon = ({ ui, className }: uiTypoIcon.Props) => {
	return coolUi<uiTypoIcon.Ui>({
		name: "TypoIcon",
		ui: {
			tone: "primary",
			theme: "light",
			justify: "center",
			items: "center",
			flow: "horizontal",
			gap: "sm",
			...ui,
		},
		className,
	});
};
