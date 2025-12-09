import { ui } from "@use-pico/cls";
import type { ComponentProps, FC } from "react";
import type { Ui as CoolUi } from "../Ui";

/**
 * Simple badge icon; just rounded background with children.
 *
 * @group ui
 */
export namespace Badge {
	export interface Ui {
		theme?: CoolUi.Theme;
	}

	export interface Props extends ui.Component<Ui, ComponentProps<"div">> {
		//
	}
}

export const Badge: FC<Badge.Props> = (props) => {
	return (
		<div
			{...ui<Badge.Ui>({
				ui: "Badge",
				attrs: [
					"theme",
				],
				...props,
			})}
		/>
	);
};
