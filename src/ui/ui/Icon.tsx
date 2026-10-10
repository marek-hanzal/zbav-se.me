import type { ComponentProps, FC, ReactNode } from "react";
import { isString } from "~/string/fn/isString";
import { uiIcon } from "~/ui/fn/uiIcon";

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
	export interface Props extends uiIcon.Component<ComponentProps<"span">> {
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
	return isString(icon) ? (
		<span
			{...uiIcon({
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
