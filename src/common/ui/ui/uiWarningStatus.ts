import type { ui as coolUi } from "@/lib/client/cls";
import { uiStatus } from "@/lib/client/status";

export namespace uiWarningStatus {
	export interface Ui extends uiStatus.Ui {
		//
	}

	export type Component<TRest extends object> = coolUi.Component<Ui, TRest>;

	export interface Props extends coolUi.PropsEx<Ui> {
		//
	}
}

export const uiWarningStatus = ({ className, ...ui }: uiWarningStatus.Props) => {
	return uiStatus({
		ui: {
			tone: "brand",
			theme: "light",
			color: "lead",
			text: "4xl",
			inner: "4xl",
			...ui,
		},
		className: [
			"text-center",
			className,
		],
	});
};
