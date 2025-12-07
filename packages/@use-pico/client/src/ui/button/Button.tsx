import type { Cls } from "@use-pico/cls";
import type { ComponentProps, FC } from "react";
import { useMemo } from "react";
import { Icon } from "../../icon/Icon";
import { SpinnerIcon } from "../../icon/SpinnerIcon";
import { Tx } from "../tx/Tx";
import { asButton } from "./asButton";
import type { ButtonCls } from "./ButtonCls";

const ICON_SIZE_MAP: Partial<Record<Cls.VariantOf<ButtonCls, "size">, asButton.Size>> = {
	sm: "xs",
	md: "xs",
	lg: "sm",
	xl: "md",
} as const;

export namespace Button {
	export interface Props extends ComponentProps<"button">, asButton.Props {
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
		 * Whether to truncate text that overflows the button width.
		 * @default false
		 */
		truncate?: boolean;
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
			type={"button"}
			disabled={disabled}
			//
			{...asButton({
				tone,
				theme,
				size,
				round,
				snapTo,
				disabled,
			})}
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
