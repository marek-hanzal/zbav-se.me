import { tvc } from "@use-pico/cls";
import { isString } from "@use-pico/common/is-string";
import type { ComponentProps, FC, ReactNode } from "react";

/**
 * Simple styled icon (span); uses Tailwind CSS classes.
 *
 * @group ui
 */
export namespace Icon {
	export type Type = string | ReactNode;

	export type Tone =
		| "primary"
		| "secondary"
		| "danger"
		| "warning"
		| "neutral"
		| "subtle"
		| "link";
	export type Theme = "light" | "dark";
	export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

	/**
	 * Props for `Icon` component.
	 */
	export interface Props extends ComponentProps<"span"> {
		/**
		 * `Iconify` icon name.
		 *
		 * If non-string is provided (basically a JSX element), this component
		 * is replaced with the element.
		 */
		icon: Icon.Type;
		tone?: Tone;
		theme?: Theme;
		size?: Size;
		disabled?: boolean;
	}

	/**
	 * Useful for extending an icon.
	 */
	export type PropsEx = Partial<Props>;
}

export const Icon: FC<Icon.Props> = ({
	icon,
	size,
	tone,
	theme,
	disabled,
	className,
	...props
}) => {
	return isString(icon) ? (
		<span
			data-root="Icon-root"
			//
			data-tone={tone}
			data-theme={theme}
			//
			data-size={size}
			data-disabled={disabled}
			//
			className={tvc(className, icon)}
			{...props}
		/>
	) : (
		icon
	);
};
