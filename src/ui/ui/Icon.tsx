import type { ComponentProps, FC, ReactNode } from "react";
import { isStringFn } from "~/string/fn/isStringFn";
import { uiIconFn } from "~/ui/fn/uiIconFn";

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
	export interface Props extends uiIconFn.Component<ComponentProps<"span">> {
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
	className,
	//
	...props
}) => {
	return isStringFn(icon) ? (
		<span
			{...uiIconFn({
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
