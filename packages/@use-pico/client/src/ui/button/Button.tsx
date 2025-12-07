import type { Cls } from "@use-pico/cls";
import type { ComponentProps, FC } from "react";
import { useMemo } from "react";
import { Icon } from "../../icon/Icon";
import { SpinnerIcon } from "../../icon/SpinnerIcon";
import { Tx } from "../tx/Tx";
import type { ButtonCls } from "./ButtonCls";

const ICON_SIZE_MAP: Partial<Record<Cls.VariantOf<ButtonCls, "size">, Button.Size>> = {
	sm: "xs",
	md: "xs",
	lg: "sm",
	xl: "md",
} as const;

export namespace Button {
	export type Tone = "primary" | "secondary" | "warning" | "danger" | "link";
	export type Theme = "light" | "dark";
	export type Size = "xs" | "sm" | "md" | "lg" | "xl";
	export type Round = "default" | "sm" | "md" | "lg" | "xl" | "full";
	export type SnapTo =
		| "top-left"
		| "top-center"
		| "top-right"
		| "bottom-left"
		| "bottom-right"
		| "bottom"
		| "left-center"
		| "right-center";

	export interface Props extends ComponentProps<"button"> {
		/**
		 * Goes through translation; in general buttons should _not_ have
		 * any complex content, thus the "label" only.
		 */
		label?: string | null;
		/**
		 * Icon to display when the button is enabled and not loading.
		 */
		iconEnabled?: Icon.Type;
		/**
		 * Icon to display when the button is disabled.
		 * Falls back to `iconEnabled` if not provided.
		 */
		iconDisabled?: Icon.Type;
		/**
		 * Icon to display when the button is loading.
		 * @default SpinnerIcon
		 */
		iconLoading?: Icon.Type;
		/**
		 * Additional props to pass to the icon component.
		 */
		iconProps?: Omit<Icon.Props, "icon">;
		/**
		 * Position of the icon relative to the label.
		 * @default "left"
		 */
		iconPosition?: "left" | "right";
		/**
		 * Whether the button is in a loading state.
		 * When true, shows the loading icon and prevents interaction.
		 */
		loading?: boolean;
		/**
		 * Whether to show the border.
		 * @default true
		 */
		border?: boolean;
		/**
		 * Whether the button should take full width of its container.
		 * @default false
		 */
		full?: boolean;
		/**
		 * Menu-like button
		 * @default false
		 */
		menu?: boolean;
		/**
		 * Whether to show the background.
		 * @default true
		 */
		background?: boolean;
		/**
		 * Size of the button (affects padding and font size).
		 * @default "md"
		 */
		size?: Button.Size;
		/**
		 * Color tone of the button (affects background, text, border, and shadow colors).
		 * @default "primary"
		 */
		tone?: Tone;
		/**
		 * Theme variant (light or dark).
		 * @default "light"
		 */
		theme?: Theme;
		/**
		 * Border radius of the button.
		 * @default undefined
		 */
		round?: Round;
		/**
		 * Whether to truncate text that overflows the button width.
		 * @default false
		 */
		truncate?: boolean;
		/**
		 * Whether to render the button with equal width and height.
		 * When not provided, it defaults to true when neither children nor label are present.
		 * @default false
		 */
		square?: boolean;
		/**
		 * Absolute positioning for snapping the button to corners of a parent container.
		 * Requires the parent element to have relative positioning.
		 * @default undefined
		 */
		snapTo?: SnapTo;
	}
}

export const Button: FC<Button.Props> = ({
	label,
	iconEnabled,
	iconDisabled,
	iconLoading = SpinnerIcon,
	iconProps,
	iconPosition = "left",
	loading,
	size = "md",
	tone,
	theme,
	round,
	border,
	background,
	full,
	menu,
	truncate,
	square,
	snapTo,
	//
	disabled,
	children,
	...props
}) => {
	const iconSize = ICON_SIZE_MAP[size] ?? size;

	const renderIcon = useMemo(
		() =>
			disabled ? (
				<Icon
					icon={loading === true ? iconLoading : (iconDisabled ?? iconEnabled)}
					size={iconSize}
					{...iconProps}
				/>
			) : (
				<Icon
					icon={loading === true ? iconLoading : iconEnabled}
					size={iconSize}
					{...iconProps}
				/>
			),
		[
			disabled,
			loading,
			iconLoading,
			iconDisabled,
			iconEnabled,
			iconSize,
			iconProps,
		],
	);

	return (
		<button
			data-root={"Button-root"}
			type={"button"}
			disabled={disabled}
			//
			data-tone={tone}
			data-theme={theme}
			//
			data-size={size}
			data-round={round}
			//
			data-border={border}
			data-background={background}
			//
			data-full={full}
			data-menu={menu}
			//
			data-truncate={truncate}
			data-square={square}
			//
			data-snap-to={snapTo}
			//
			data-disabled={disabled}
			//
			{...props}
		>
			{iconPosition === "left" && renderIcon}

			{label ? (
				<Tx
					label={label}
					display={"block"}
					truncate={truncate}
				/>
			) : null}

			{children}

			{iconPosition === "right" && renderIcon}
		</button>
	);
};
