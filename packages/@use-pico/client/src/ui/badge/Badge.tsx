import { asBadge } from "@use-pico/theme/badge";
import type { ComponentProps, FC } from "react";

/**
 * Simple badge icon; just rounded background with children.
 *
 * @group ui
 */
export namespace Badge {
	export interface Props extends asBadge.Props<ComponentProps<"div">> {
		//
	}
}

export const Badge: FC<Badge.Props> = (props) => {
	return (
		<div
			{...asBadge(props)}
		/>
	);
};
