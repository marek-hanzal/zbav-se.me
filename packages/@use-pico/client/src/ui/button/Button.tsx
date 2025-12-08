import { asButton } from "@use-pico/theme/button";
import type { ComponentProps, FC } from "react";
import { useMemo } from "react";
import type { asIcon } from "../../../../theme/src/icon/asIcon";
import { Icon } from "../../icon/Icon";
import { SpinnerIcon } from "../../icon/SpinnerIcon";
import { Tx } from "../tx/Tx";

const ICON_SIZE_MAP: Partial<Record<asButton.Size, asIcon.Size>> = {
	sm: "xs",
	md: "xs",
	lg: "xl",
	xl: "2xl",
} as const;

export namespace Button {
	export interface Props extends asButton.PropsEx<ComponentProps<"button">> {
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
	disabled,
	//
	tone,
	theme,
	size = "md",
	round,
	background,
	zIndex,
	border,
	snapTo,
	justify,
	className,
	//
	truncate,
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
				zIndex,
				background,
				border,
				justify,
				className,
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
