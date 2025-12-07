import type { Cls } from "@use-pico/cls";
import type { ComponentProps, FC } from "react";
import type { BadgeCls } from "./BadgeCls";

/**
 * Simple badge icon; just rounded background with children.
 *
 * @group ui
 */
export namespace Badge {
	export interface Props extends ComponentProps<"div"> {
		/**
		 * Whether the badge is disabled (reduces opacity and prevents interaction).
		 */
		disabled?: boolean;
		/**
		 * Size of the badge (affects padding and font size).
		 */
		size?: Cls.VariantOf<BadgeCls, "size">;
		/**
		 * Border radius of the badge.
		 */
		round?: Cls.VariantOf<BadgeCls, "round">;
		/**
		 * Color tone of the badge (affects background, text, border, and shadow colors).
		 */
		tone?: Cls.VariantOf<BadgeCls, "tone">;
		/**
		 * Theme variant (light or dark).
		 */
		theme?: Cls.VariantOf<BadgeCls, "theme">;
		/**
		 * Absolute positioning for snapping the badge to corners of a parent container.
		 * Requires the parent element to have relative positioning.
		 */
		snapTo?: Cls.VariantOf<BadgeCls, "snap-to">;
		/**
		 * Stretch badge to full width.
		 */
		full?: boolean;
	}
}

export const Badge: FC<Badge.Props> = ({
	disabled,
	size,
	round,
	tone,
	theme,
	snapTo,
	full,
	className,
	children,
	//
	...props
}) => {
	return (
		<div
			data-root={"Badge-root"}
			{...props}
		>
			{children}
		</div>
	);
};
