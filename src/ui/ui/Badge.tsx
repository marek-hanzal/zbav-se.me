import type { ComponentProps, FC } from "react";
import { uiBadgeFn } from "~/ui/fn/uiBadgeFn";

/**
 * Simple badge icon; just rounded background with children.
 *
 * @group ui
 */
export namespace Badge {
	export interface Props extends uiBadgeFn.Component<ComponentProps<"div">> {
		//
	}
}

export const Badge: FC<Badge.Props> = ({ className, ...props }) => {
	return (
		<div
			{...uiBadgeFn({
				className,
			})}
			{...props}
		/>
	);
};
