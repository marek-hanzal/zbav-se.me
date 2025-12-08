import { isString } from "@use-pico/common/is-string";
import type { ComponentProps, FC, ReactNode } from "react";
import { asIcon } from "./asIcon";

/**
 * Simple styled icon (span); uses Tailwind CSS classes.
 *
 * @group ui
 */
export namespace Icon {
	export type Type = string | ReactNode;

	/**
	 * Props for `Icon` component.
	 */
	export interface Props extends asIcon.PropsEx<ComponentProps<"span">> {
		icon: Icon.Type;
	}

	/**
	 * Useful for extending an icon.
	 */
	export type PropsEx = Partial<Props>;
}

export const Icon: FC<Icon.Props> = ({
	icon,
	//
	tone,
	theme,
	size,
	disabled,
	className,
	//
	...props
}) => {
	return isString(icon) ? (
		<span
			{...asIcon({
				tone,
				theme,
				size,
				disabled,
				//
				className: [
					icon,
					className,
				],
			})}
			{...props}
		/>
	) : (
		icon
	);
};
