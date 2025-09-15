import { Scrollable as CoolScrollable } from "@use-pico/client";
import type { FC } from "react";

export namespace Scrollable {
	export interface Props extends CoolScrollable.Props {}
}

export const Scrollable: FC<Scrollable.Props> = (props) => {
	return (
		<CoolScrollable
			tweak={({ what }) => ({
				token: {
					"scrollable.fade.color": what.css([
						"[--fade-color:var(--color-pink-900)]",
					]),
				},
			})}
			{...props}
		/>
	);
};
