import { ui as coolUi } from "@use-pico/cls";
import type { Ui as CoolUi } from "../Ui";

export namespace uiMarkdown {
	export interface Ui {
		theme?: CoolUi.Theme;
		tone?: CoolUi.Tone;
		//
		color?: CoolUi.Color;
		text?: CoolUi.Text;
		inner?: CoolUi.Inner;
		background?: CoolUi.Background;
		opacity?: CoolUi.Opacity;
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiMarkdown = ({ ui, className }: uiMarkdown.Props) => {
	return coolUi<uiMarkdown.Ui>({
		name: "Markdown",
		ui: {
			text: "default",
			...ui,
		},
		className,
	});
};
