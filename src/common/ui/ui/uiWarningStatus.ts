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
		"data-ui-tone": "brand",
		"data-ui-theme": "light",
		"data-ui-color": "lead",
		"data-ui-text": "4xl",
		"data-ui-inner": "4xl",
		...ui,
		className: [
			"text-center",
			className,
		],
	});
};
