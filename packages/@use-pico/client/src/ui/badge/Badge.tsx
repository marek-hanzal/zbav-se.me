import type { ComponentProps, FC } from "react";
import { asBadge } from "./asBadge";

/**
 * Simple badge icon; just rounded background with children.
 *
 * @group ui
 */
export namespace Badge {
	export interface Props extends asBadge.PropsEx<ComponentProps<"div">> {
		//
	}
}

export const Badge: FC<Badge.Props> = ({
	tone,
	theme,
	size,
	round,
	snapTo,
	flow,
	disabled,
	//
	className,
	children,
	//
	...props
}) => {
	return (
		<div
			{...asBadge({
				tone,
				theme,
				size,
				round,
				snapTo,
				flow,
				disabled,
				className,
			})}
			{...props}
		>
			{children}
		</div>
	);
};
